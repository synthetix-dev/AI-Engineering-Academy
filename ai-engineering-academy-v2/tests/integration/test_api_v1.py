import pytest
import httpx
from app.main import app, seed_initial_data

@pytest.fixture(autouse=True)
async def init_db():
    await seed_initial_data()

import uuid

@pytest.mark.asyncio
async def test_auth_and_user_flow():
    unique_email = f"student_{uuid.uuid4().hex[:6]}@academy.ai"
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Register new student
        res = await client.post("/api/v1/auth/register", json={
            "email": unique_email,
            "password": "ValidPassword2026!",
            "full_name": "Іван Тестер",
            "career_goal": "ml_engineer"
        })
        assert res.status_code == 200
        token_data = res.json()
        assert "access_token" in token_data
        token = token_data["access_token"]

        # Get Me with token
        res_me = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
        assert res_me.status_code == 200
        user = res_me.json()
        assert user["email"] == unique_email
        assert user["career_goal"] == "ml_engineer"

@pytest.mark.asyncio
async def test_curriculum_and_paths():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Tracks
        r_tracks = await client.get("/api/v1/curriculum/tracks")
        assert r_tracks.status_code == 200
        tracks = r_tracks.json()
        assert len(tracks) == 20

        # Discover lesson for track 4
        r_disc = await client.get("/api/v1/curriculum/tracks/machine-learning/discover")
        assert r_disc.status_code == 200
        disc = r_disc.json()
        assert len(disc["steps"]) == 3
        assert "code_explanation" in disc

        # Career Paths
        r_paths = await client.get("/api/v1/paths")
        assert r_paths.status_code == 200
        assert len(r_paths.json()) == 6

        # Skills
        r_skills = await client.get("/api/v1/skills")
        assert r_skills.status_code == 200
        assert len(r_skills.json()) == 20

@pytest.mark.asyncio
async def test_projects_crud():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Create project
        r = await client.post("/api/v1/projects", json={
            "name": "Тестовий Класифікатор",
            "description": "Модель для аналізу тексту",
            "project_type": "model"
        })
        assert r.status_code == 200
        proj = r.json()
        assert proj["name"] == "Тестовий Класифікатор"
        assert proj["evolution_level"] == 1

        # Patch project
        r_patch = await client.patch(f"/api/v1/projects/{proj['id']}", json={
            "evolution_level": 2,
            "status": "trained"
        })
        assert r_patch.status_code == 200
        assert r_patch.json()["evolution_level"] == 2
        assert r_patch.json()["status"] == "trained"

@pytest.mark.asyncio
async def test_admin_stats():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Login as admin
        r_login = await client.post("/api/v1/auth/login", json={
            "email": "admin@academy.ai",
            "password": "AdminSecret2026!"
        })
        assert r_login.status_code == 200
        admin_token = r_login.json()["access_token"]

        # Fetch admin stats
        r_stats = await client.get("/api/v1/admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
        assert r_stats.status_code == 200
        stats = r_stats.json()
        assert stats["total_users"] >= 1
        assert "queue_status" in stats
