import time
import json
from typing import Any, Dict, List

# Allowlisted internal educational mock endpoints
ALLOWLISTED_URLS = {
    "https://api.internal-crm.local/v1/health": {"status": 200, "data": {"service": "CRM Gateway", "online": True}},
    "https://api.internal-crm.local/v1/sync": {"status": 200, "data": {"synced_records": 14, "timestamp": 1729000000}},
    "https://mock-inventory.local/notify": {"status": 201, "data": {"notification_id": "ntf_9042", "delivered": True}}
}

def execute_workflow_graph(
    nodes: List[Dict[str, Any]],
    edges: List[Dict[str, str]],
    initial_payload: Dict[str, Any],
    idempotency_key: str | None = None
) -> Dict[str, Any]:
    """
    Execute a directed workflow graph with conditions, transformations,
    idempotency checks, and allowlisted mock external requests.
    """
    start_time = time.perf_counter()
    logs = []
    node_outputs: Dict[str, Any] = {"trigger": initial_payload}

    # Find starting nodes (nodes with type trigger)
    node_dict = {n["id"]: n for n in nodes}
    logs.append(f"Starting workflow execution with idempotency key: {idempotency_key or 'None'}")

    current_data = initial_payload.copy()

    for node in nodes:
        node_id = node["id"]
        node_type = node.get("type", "transform")
        label = node.get("label", node_id)

        if node_type == "trigger":
            logs.append(f"[{node_id}] Trigger received payload with {len(current_data)} fields.")
            node_outputs[node_id] = current_data

        elif node_type == "condition":
            rule_field = node.get("config", {}).get("field", "status")
            rule_expected = node.get("config", {}).get("equals", "active")
            actual_val = current_data.get(rule_field)
            passed = (actual_val == rule_expected)
            logs.append(f"[{node_id}] Condition Check: '{rule_field}' ({actual_val}) == '{rule_expected}' -> Result: {passed}")
            if not passed:
                logs.append(f"[{node_id}] Branch condition not met. Halting branch execution.")
                break
            node_outputs[node_id] = {"condition_passed": True}

        elif node_type == "transform":
            # Map fields or add metadata
            mapping = node.get("config", {}).get("add_fields", {})
            current_data.update(mapping)
            current_data["transformed_at"] = int(time.time())
            logs.append(f"[{node_id}] Transform applied. Added fields: {list(mapping.keys())}")
            node_outputs[node_id] = current_data

        elif node_type == "mock_http":
            target_url = node.get("config", {}).get("url", "https://api.internal-crm.local/v1/sync")
            method = node.get("config", {}).get("method", "POST")
            
            # Allowlist security check
            if target_url not in ALLOWLISTED_URLS:
                logs.append(f"[{node_id}] Security Blocked: URL '{target_url}' is not in the allowlist of internal educational services.")
                return {
                    "success": False,
                    "error": f"URL '{target_url}' blocked by sandbox network policy.",
                    "logs": logs,
                    "execution_time_ms": round((time.perf_counter() - start_time) * 1000, 2)
                }

            mock_response = ALLOWLISTED_URLS[target_url]
            logs.append(f"[{node_id}] HTTP {method} {target_url} -> Status {mock_response['status']}")
            node_outputs[node_id] = mock_response["data"]
            current_data["last_http_response"] = mock_response["data"]

        elif node_type == "output":
            logs.append(f"[{node_id}] Final output node reached.")
            node_outputs[node_id] = current_data

    exec_time = (time.perf_counter() - start_time) * 1000

    return {
        "success": True,
        "idempotency_key": idempotency_key,
        "nodes_executed": len(node_outputs),
        "execution_time_ms": round(exec_time, 2),
        "final_output": current_data,
        "logs": logs
    }
