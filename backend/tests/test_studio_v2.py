import pytest
import httpx

BASE_URL = "http://127.0.0.1:8000/api/v1"

@pytest.fixture
def auth_headers():
    client = httpx.Client(base_url=BASE_URL, timeout=10.0)
    res = client.post("/auth/login", json={
        "email": "learner@aiacademy.io",
        "password": "LearnerPass123!"
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_missions_list_and_details():
    """Verify missions catalog returns all engineering troubleshooting challenges."""
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as client:
        res = client.get("/missions")
        assert res.status_code == 200
        missions = res.json()
        assert len(missions) >= 5
        slugs = [m["slug"] for m in missions]
        assert "fix-exploding-gradients" in slugs
        assert "stop-prompt-injection" in slugs
        assert "clean-leaky-dataset" in slugs

        # Get single mission details
        res_single = client.get("/missions/fix-exploding-gradients")
        assert res_single.status_code == 200
        data = res_single.json()
        assert data["slug"] == "fix-exploding-gradients"
        assert data["pillar"] == "Solve"
        assert "initial_broken_params" in data

def test_mission_verification_lifecycle(auth_headers):
    """
    Test end-to-end verification of an engineering mission fix:
    User submits stabilized parameters -> Real compute on CPU worker -> Verified pass.
    """
    with httpx.Client(base_url=BASE_URL, timeout=15.0) as client:
        # Submit valid stabilized fix: learning_rate=0.08, iterations=30
        res = client.post(
            "/missions/fix-exploding-gradients/verify",
            headers=auth_headers,
            json={"fixed_params": {"learning_rate": 0.08, "iterations": 30, "loss_function": "quadratic"}}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["passed"] is True
        assert data["xp_earned"] == 100
        assert data["score"] == 1.0
        assert "verified_metrics" in data
        assert "mean_numerical_diff_error" in data["verified_metrics"]

def test_mentor_quick_prompts_and_assistance():
    """Verify AI Engineering Mentor pedagogical guidance and parameter recommendations."""
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as client:
        # 1. Quick prompts for neural-builder-lab
        res_prompts = client.get("/mentor/quick-prompts/neural-builder-lab")
        assert res_prompts.status_code == 200
        prompts_data = res_prompts.json()
        assert len(prompts_data["quick_prompts"]) >= 3

        # 2. Ask mentor assistance for overfitting
        res_assist = client.post("/mentor/assist", json={
            "lab_slug": "neural-builder-lab",
            "user_goal": "Як запобігти перенавчанню моделі?",
            "current_params": {"hidden_layers": [64, 32], "epochs": 50}
        })
        assert res_assist.status_code == 200
        assist_data = res_assist.json()
        assert "перенавчання" in assist_data["explanation"].lower() or "overfitting" in assist_data["explanation"].lower()
        assert "suggested_params" in assist_data
        assert "suggested_code" in assist_data
        assert len(assist_data["diagnostic_tips"]) > 0

def test_living_projects_lifecycle(auth_headers):
    """Test creating and retrieving living multi-stage projects."""
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as client:
        # Create a new living project
        create_res = client.post("/projects", headers=auth_headers, json={
            "title": "Automated Medical Diagnosis Pipeline",
            "description": "Multi-stage living project from raw data to deployed model",
            "visibility": "public",
            "metrics": {"baseline_accuracy": 0.88, "target_recall": 0.95},
            "configs": {"pipeline_stage": "Deep Learning MLP"},
            "artifacts": {"version": "v1.0-alpha"}
        })
        assert create_res.status_code == 201
        proj = create_res.json()
        assert proj["title"] == "Automated Medical Diagnosis Pipeline"
        proj_id = proj["id"]

        # Retrieve project list
        list_res = client.get("/projects", headers=auth_headers)
        assert list_res.status_code == 200
        user_projects = list_res.json()
        assert any(p["id"] == proj_id for p in user_projects)
