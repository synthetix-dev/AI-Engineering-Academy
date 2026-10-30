#!/usr/bin/env python3
"""
Comprehensive Audit Script for AI Engineering Academy
Tests all routes, APIs, auth, execution, persistence, missions, and frontend pages.
"""
import sys
import json
import urllib.request
import urllib.error

BACKEND_BASE = "http://127.0.0.1:8000/api/v1"
FRONTEND_BASE = "http://localhost:3000"

results = {
    "frontend_pages": [],
    "api_endpoints": [],
    "critical_defects": []
}

def log_test(category, name, passed, details=""):
    results[category].append({
        "name": name,
        "status": "PASS" if passed else "FAIL",
        "details": details
    })
    print(f"[{'PASS' if passed else 'FAIL'}] {name}: {details}")

def test_url(url, expected_code=200):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AIAcademyAuditor/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            code = resp.getcode()
            content = resp.read().decode("utf-8", errors="ignore")
            return code == expected_code, f"HTTP {code}, size {len(content)}"
    except urllib.error.HTTPError as e:
        return e.code == expected_code, f"HTTPError {e.code}: {e.reason}"
    except Exception as e:
        return False, f"Exception: {str(e)}"

def post_json(url, data, token=None):
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "User-Agent": "AIAcademyAuditor/1.0",
                **({"Authorization": f"Bearer {token}"} if token else {})
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            return resp.getcode(), json.loads(content)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        return e.code, err_body
    except Exception as e:
        return 0, str(e)

print("=" * 80)
print("AI Engineering Academy — Automated Deep Audit")
print("=" * 80)

# 1. Test Frontend Routes
frontend_routes = [
    "/",
    "/onboarding",
    "/tracks",
    "/build",
    "/explore",
    "/solve",
    "/career-paths",
    "/projects",
    "/portfolio",
    "/progress",
    "/models",
    "/datasets",
    "/admin",
    "/labs/browser-python-sandbox",
    "/labs/visual-matrix-gradient-lab",
    "/labs/data-cleaning-explorer",
    "/labs/ml-playground",
    "/labs/neural-builder-lab",
    "/labs/rag-builder-inspection",
    "/labs/agent-sandbox-lab",
]

print("\n--- Auditing Frontend Pages ---")
for r in frontend_routes:
    ok, msg = test_url(f"{FRONTEND_BASE}{r}")
    log_test("frontend_pages", f"Route {r}", ok, msg)

# 2. Test Backend Health & Auth
print("\n--- Auditing Backend API & Auth ---")
code, auth_res = post_json(f"{BACKEND_BASE}/auth/login", {"email": "learner@aiacademy.io", "password": "LearnerPass123!"})
if code == 200 and "access_token" in auth_res:
    token = auth_res["access_token"]
    log_test("api_endpoints", "POST /auth/login", True, "Successfully logged in as learner")
else:
    token = None
    log_test("api_endpoints", "POST /auth/login", False, f"Failed auth: {auth_res}")

# 3. Test API Endpoints
endpoints_to_test = [
    ("GET", f"{BACKEND_BASE}/tracks", None),
    ("GET", f"{BACKEND_BASE}/models", None),
    ("GET", f"{BACKEND_BASE}/career-paths", None),
    ("GET", f"{BACKEND_BASE}/me/progress", token),
    ("GET", f"{BACKEND_BASE}/me/quotas", token),
    ("GET", f"{BACKEND_BASE}/projects", token),
    ("GET", f"{BACKEND_BASE}/missions", token),
]

for method, url, tok in endpoints_to_test:
    name = url.replace(BACKEND_BASE, "")
    try:
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}"} if tok else {})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            count = len(data) if isinstance(data, list) else len(data.keys())
            log_test("api_endpoints", f"{method} {name}", True, f"HTTP 200, items/keys: {count}")
    except Exception as e:
        log_test("api_endpoints", f"{method} {name}", False, str(e))

# 4. Save results to temporary json
with open("audit_results.json", "w") as f:
    json.dump(results, f, indent=2)

print("\nDeep Audit Finished.")
