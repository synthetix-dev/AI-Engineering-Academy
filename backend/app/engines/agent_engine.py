import time
from typing import Any, Dict, List

# Sandboxed isolated tool services state
SIMULATED_SERVICES = {
    "crm": {
        "CUST-101": {"name": "Alice Cooper", "tier": "gold", "status": "active"},
        "CUST-102": {"name": "Bob Martin", "tier": "silver", "status": "pending_kyc"}
    },
    "mailbox": [
        {"id": "msg_1", "from": "alice@cooper.net", "subject": "Contract Renewal Inquiry", "read": False}
    ],
    "calendar": [
        {"id": "cal_1", "title": "Quarterly Review", "time": "2026-11-02 10:00"}
    ],
    "inventory": {
        "SKU-A100": {"name": "HPC GPU Compute Unit", "stock": 4, "reserved": 0},
        "SKU-M256": {"name": "High-Bandwidth RAM Module", "stock": 18, "reserved": 2}
    }
}

ALLOWED_TOOLS = {
    "crm_get_customer": {
        "description": "Retrieve customer details from CRM by ID.",
        "parameters": {"customer_id": "string"},
        "state_changing": False
    },
    "crm_update_status": {
        "description": "Update customer account status (e.g., active, suspended).",
        "parameters": {"customer_id": "string", "new_status": "string"},
        "state_changing": True # requires approval
    },
    "mailbox_list_inbox": {
        "description": "Fetch unread messages from incoming mailbox.",
        "parameters": {},
        "state_changing": False
    },
    "mailbox_send_reply": {
        "description": "Send outbound email message.",
        "parameters": {"to": "string", "subject": "string", "body": "string"},
        "state_changing": True # requires approval
    },
    "inventory_check": {
        "description": "Check current inventory levels for an SKU.",
        "parameters": {"sku": "string"},
        "state_changing": False
    },
    "inventory_reserve": {
        "description": "Reserve a specified quantity of an item.",
        "parameters": {"sku": "string", "quantity": "integer"},
        "state_changing": True # requires approval
    }
}

def execute_agent_loop(
    user_goal: str,
    max_steps: int = 5,
    auto_approve_writes: bool = False
) -> Dict[str, Any]:
    """
    Execute step-by-step ReAct reasoning loop with tool calls, state isolation,
    and human-in-the-loop approval gating for state-changing operations.
    """
    trace = []
    goal_lower = user_goal.lower()
    step_num = 1
    action_log = []

    # Step 1: Analyze goal and decide on initial inspection tool
    if "customer" in goal_lower or "crm" in goal_lower or "alice" in goal_lower:
        thought_1 = "Goal mentions customer Alice. First, I need to query the CRM database for CUST-101."
        tool_1 = "crm_get_customer"
        args_1 = {"customer_id": "CUST-101"}
        obs_1 = SIMULATED_SERVICES["crm"].get("CUST-101", {"error": "Not found"})
        
        trace.append({
            "step": step_num,
            "thought": thought_1,
            "action": tool_1,
            "arguments": args_1,
            "observation": obs_1,
            "status": "completed"
        })
        step_num += 1

        # Step 2: Formulate reply or write action
        if "update" in goal_lower:
            thought_2 = "Customer profile retrieved. Now requesting status update to 'active'."
            tool_2 = "crm_update_status"
            args_2 = {"customer_id": "CUST-101", "new_status": "active"}
            is_state_changing = True

            if not auto_approve_writes:
                trace.append({
                    "step": step_num,
                    "thought": thought_2,
                    "action": tool_2,
                    "arguments": args_2,
                    "observation": "PAUSED: Action changes persistent customer state. Awaiting operator confirmation.",
                    "requires_human_approval": True,
                    "status": "waiting_approval"
                })
                return {
                    "goal": user_goal,
                    "completed": False,
                    "paused_for_approval": True,
                    "trace": trace,
                    "final_answer": "Execution paused awaiting human approval for CRM write."
                }
            else:
                SIMULATED_SERVICES["crm"]["CUST-101"]["status"] = "active"
                trace.append({
                    "step": step_num,
                    "thought": thought_2,
                    "action": tool_2,
                    "arguments": args_2,
                    "observation": "Status updated successfully.",
                    "status": "completed"
                })
                step_num += 1

    elif "inventory" in goal_lower or "gpu" in goal_lower or "stock" in goal_lower:
        thought_1 = "Goal requests inventory inspection. Checking stock for SKU-A100."
        tool_1 = "inventory_check"
        args_1 = {"sku": "SKU-A100"}
        obs_1 = SIMULATED_SERVICES["inventory"].get("SKU-A100", {"error": "SKU not found"})
        
        trace.append({
            "step": step_num,
            "thought": thought_1,
            "action": tool_1,
            "arguments": args_1,
            "observation": obs_1,
            "status": "completed"
        })
        step_num += 1

        if "reserve" in goal_lower:
            thought_2 = "Sufficient stock found (4 units available). Requesting reservation of 1 unit."
            tool_2 = "inventory_reserve"
            args_2 = {"sku": "SKU-A100", "quantity": 1}

            if not auto_approve_writes:
                trace.append({
                    "step": step_num,
                    "thought": thought_2,
                    "action": tool_2,
                    "arguments": args_2,
                    "observation": "PAUSED: Inventory reservation modifies stock. Awaiting human approval.",
                    "requires_human_approval": True,
                    "status": "waiting_approval"
                })
                return {
                    "goal": user_goal,
                    "completed": False,
                    "paused_for_approval": True,
                    "trace": trace,
                    "final_answer": "Execution paused awaiting operator confirmation for inventory write."
                }
            else:
                SIMULATED_SERVICES["inventory"]["SKU-A100"]["reserved"] += 1
                trace.append({
                    "step": step_num,
                    "thought": thought_2,
                    "action": tool_2,
                    "arguments": args_2,
                    "observation": "1 unit of SKU-A100 successfully reserved.",
                    "status": "completed"
                })
                step_num += 1
    else:
        # Default mailbox check
        trace.append({
            "step": step_num,
            "thought": "Checking inbox for relevant customer communications.",
            "action": "mailbox_list_inbox",
            "arguments": {},
            "observation": SIMULATED_SERVICES["mailbox"],
            "status": "completed"
        })
        step_num += 1

    final_thought = "Task objective successfully satisfied based on tool observations."

    return {
        "goal": user_goal,
        "completed": True,
        "paused_for_approval": False,
        "total_steps": len(trace),
        "trace": trace,
        "final_answer": final_thought
    }
