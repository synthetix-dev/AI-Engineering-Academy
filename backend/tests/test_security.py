import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.engines.foundations_engine import run_python_code, run_sql_challenge

def test_ast_sandbox_blocks_imports():
    # Attempt import
    res = run_python_code("import os\nprint(os.listdir('.'))")
    assert res["success"] is False
    assert "prohibited" in res["error"].lower()

def test_ast_sandbox_blocks_dunder_traversal():
    # Attempt escape via __subclasses__
    res = run_python_code("x = ().__class__.__bases__[0].__subclasses__()")
    assert res["success"] is False
    assert "prohibited" in res["error"].lower()

def test_ast_sandbox_blocks_eval_exec_open():
    res1 = run_python_code("eval('2 + 2')")
    assert res1["success"] is False
    assert "prohibited" in res1["error"].lower()

    res2 = run_python_code("open('/etc/passwd')")
    assert res2["success"] is False
    assert "prohibited" in res2["error"].lower()

def test_ast_sandbox_allows_safe_code():
    code = """
def compute_fibonacci(n):
    a, b = 0, 1
    out = []
    for _ in range(n):
        out.append(a)
        a, b = b, a + b
    return out

result = compute_fibonacci(8)
print("Fibonacci sequence:", result)
"""
    res = run_python_code(code)
    assert res["success"] is True
    assert "Fibonacci sequence: [0, 1, 1, 2, 3, 5, 8, 13]" in res["stdout"]
    assert "result" in res["variables"]

def test_sql_sandbox_blocks_drop_and_ddl():
    res = run_sql_challenge("DROP TABLE experiments;")
    assert res["success"] is False
    assert "prohibited" in res["error"].lower()

def test_sql_sandbox_allows_select():
    res = run_sql_challenge("SELECT model_name, val_accuracy FROM experiments WHERE val_accuracy > 0.85;")
    assert res["success"] is True
    assert len(res["rows"]) >= 3
    assert res["columns"] == ["model_name", "val_accuracy"]

@pytest.mark.asyncio
async def test_career_paths_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/career-paths")
        assert res.status_code == 200
        paths = res.json()
        assert len(paths) == 6
        slugs = [p["slug"] for p in paths]
        assert "ai-engineer" in slugs
        assert "llm-engineer" in slugs
        assert "mlops-engineer" in slugs

@pytest.mark.asyncio
async def test_async_run_queuing():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": "learner@aiacademy.io",
            "password": "LearnerPass123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        labs_res = await ac.get("/api/v1/labs", headers=headers)
        lab = labs_res.json()[0]

        # Dispatch async run with wait=false (OPS-01)
        run_res = await ac.post(
            "/api/v1/runs?wait=false",
            headers=headers,
            json={
                "lab_id": lab["id"],
                "execution_mode": "cpu-real",
                "params": {"code": "print('Async task executed')"}
            }
        )
        assert run_res.status_code == 201
        run_data = run_res.json()
        # Should be queued immediately
        assert run_data["status"] in ["queued", "running", "succeeded"]

@pytest.mark.asyncio
async def test_project_ownership_isolation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Login as learner
        learner_login = await ac.post("/api/v1/auth/login", json={
            "email": "learner@aiacademy.io",
            "password": "LearnerPass123!"
        })
        learner_token = learner_login.json()["access_token"]
        learner_headers = {"Authorization": f"Bearer {learner_token}"}

        # Create private project
        create_res = await ac.post("/api/v1/projects", headers=learner_headers, json={
            "title": "Private LLM Evaluation",
            "description": "Proprietary benchmark",
            "visibility": "private",
            "metrics": {"score": 95}
        })
        assert create_res.status_code == 201
        proj_id = create_res.json()["id"]

        # 2. Register/login a second unprivileged user
        sec_login = await ac.post("/api/v1/auth/register", json={
            "email": "other_learner@aiacademy.io",
            "password": "OtherPass123!",
            "full_name": "Other Learner"
        })
        if sec_login.status_code == 200:
            other_token = sec_login.json()["access_token"]
        else:
            # Login if already exists
            alt_res = await ac.post("/api/v1/auth/login", json={
                "email": "other_learner@aiacademy.io",
                "password": "OtherPass123!"
            })
            other_token = alt_res.json()["access_token"]

        other_headers = {"Authorization": f"Bearer {other_token}"}

        # Attempt to access learner's private project (IDOR check SEC-04)
        get_res = await ac.get(f"/api/v1/projects/{proj_id}", headers=other_headers)
        assert get_res.status_code == 403

        # Attempt to update learner's project
        put_res = await ac.put(f"/api/v1/projects/{proj_id}", headers=other_headers, json={
            "title": "Hacked Title",
            "description": "Unauthorized alteration"
        })
        assert put_res.status_code == 403

        # Attempt to delete learner's project
        del_res = await ac.delete(f"/api/v1/projects/{proj_id}", headers=other_headers)
        assert del_res.status_code == 403

@pytest.mark.asyncio
async def test_dataset_storage_quota_enforced():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": "learner@aiacademy.io",
            "password": "LearnerPass123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Upload a valid small CSV
        csv_data = "feature1,feature2,target\n1.2,3.4,0\n5.6,7.8,1\n2.3,4.5,0\n"
        files = {"file": ("sample.csv", csv_data, "text/csv")}
        data = {"name": "Test Quota Dataset", "license": "MIT", "is_public": "true"}

        upload_res = await ac.post("/api/v1/datasets", headers=headers, data=data, files=files)
        assert upload_res.status_code == 201
        ds = upload_res.json()
        assert ds["name"] == "Test Quota Dataset"
        assert ds["size_bytes"] == len(csv_data)

        # Cleanup
        del_res = await ac.delete(f"/api/v1/datasets/{ds['id']}", headers=headers)
        assert del_res.status_code == 204

