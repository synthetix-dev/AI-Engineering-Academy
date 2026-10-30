import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_health_and_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json() == {"status": "healthy"}

        root_res = await ac.get("/")
        assert root_res.status_code == 200
        assert root_res.json()["platform"] == "AI Engineering Academy"

@pytest.mark.asyncio
async def test_tracks_catalog():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/tracks")
        assert res.status_code == 200
        tracks = res.json()
        assert len(tracks) == 20
        # Verify first track
        assert tracks[0]["slug"] == "foundations"

@pytest.mark.asyncio
async def test_models_catalog():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/models")
        assert res.status_code == 200
        models = res.json()
        assert len(models) >= 4
        assert any(m["model_id"] == "tinystories-cpu-15m" for m in models)

@pytest.mark.asyncio
async def test_auth_login_and_me():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Login with learner seeded account
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": "learner@aiacademy.io",
            "password": "LearnerPass123!"
        })
        assert login_res.status_code == 200
        token_data = login_res.json()
        token = token_data["access_token"]
        assert token is not None

        # Verify /auth/me
        headers = {"Authorization": f"Bearer {token}"}
        me_res = await ac.get("/api/v1/auth/me", headers=headers)
        assert me_res.status_code == 200
        user_info = me_res.json()
        assert user_info["email"] == "learner@aiacademy.io"

@pytest.mark.asyncio
async def test_lab_run_execution():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Login
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": "learner@aiacademy.io",
            "password": "LearnerPass123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Find ML Playground lab
        labs_res = await ac.get("/api/v1/labs", headers=headers)
        assert labs_res.status_code == 200
        ml_lab = next(l for l in labs_res.json() if l["slug"] == "ml-playground")

        # Execute run
        run_res = await ac.post("/api/v1/runs", headers=headers, json={
            "lab_id": ml_lab["id"],
            "execution_mode": "cpu-real",
            "params": {
                "algorithm": "random_forest",
                "dataset_name": "synthetic",
                "n_estimators": 50,
                "seed": 42
            }
        })
        assert run_res.status_code == 201
        run_data = run_res.json()
        assert run_data["status"] == "succeeded"
        assert run_data["execution_mode"] == "cpu-real"
        assert "accuracy" in run_data["metrics"]
        assert run_data["metrics"]["accuracy"] > 0.7
        assert "confusion_matrix" in run_data["artifacts"]

        # Run evaluation
        eval_res = await ac.post("/api/v1/evaluations", headers=headers, json={
            "run_id": run_data["id"],
            "criteria": {"min_accuracy": 0.7}
        })
        assert eval_res.status_code == 200
        assert eval_res.json()["passed"] is True

@pytest.mark.asyncio
async def test_project_creation_and_export():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": "learner@aiacademy.io",
            "password": "LearnerPass123!"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create project
        proj_res = await ac.post("/api/v1/projects", headers=headers, json={
            "title": "Customer Churn Prediction",
            "description": "Production random forest classifier predicting subscriber turnover with 88% ROC-AUC.",
            "visibility": "public",
            "metrics": {"roc_auc": 0.884, "f1_score": 0.852},
            "configs": {"algorithm": "random_forest", "trees": 100}
        })
        assert proj_res.status_code == 201
        proj_id = proj_res.json()["id"]

        # Export markdown
        export_res = await ac.get(f"/api/v1/projects/{proj_id}/export/markdown")
        assert export_res.status_code == 200
        assert "Customer Churn Prediction" in export_res.text
        assert "0.884" in export_res.text
