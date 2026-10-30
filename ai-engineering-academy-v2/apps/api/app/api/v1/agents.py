import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.rag_agent import AgentConfig, AgentRun
from app.schemas.rag_agent import AgentConfigCreate, AgentRunCreate, AgentRunResponse
from app.api.deps import get_current_user
from app.engines.agent_engine import execute_agent_loop

router = APIRouter(prefix="/agents", tags=["AI Agents"])

@router.post("", response_model=AgentConfigCreate)
async def create_agent(
    payload: AgentConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agent = AgentConfig(
        user_id=current_user.id,
        project_id=payload.project_id,
        name=payload.name,
        system_role=payload.system_role,
        allowed_tools_json=payload.allowed_tools,
        max_iterations=payload.max_iterations
    )
    db.add(agent)
    await db.commit()
    return payload

@router.post("/run", response_model=AgentRunResponse)
async def run_agent(
    payload: AgentRunCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start = time.perf_counter()
    
    # Run agent loop
    agent_res = execute_agent_loop(
        user_goal=payload.task_input,
        auto_approve_writes=True
    )
    duration_ms = (time.perf_counter() - start) * 1000

    run = AgentRun(
        agent_config_id=payload.agent_config_id,
        user_id=current_user.id,
        task_input=payload.task_input,
        status="completed",
        steps_trace_json=agent_res.get("trace", []),
        final_output=agent_res.get("final_answer", "Виконано"),
        execution_time_ms=duration_ms
    )
    db.add(run)
    await db.commit()
    await db.refresh(run)

    return AgentRunResponse(
        id=run.id,
        task_input=run.task_input,
        status=run.status,
        steps_trace=run.steps_trace_json,
        final_output=run.final_output,
        execution_time_ms=round(duration_ms, 2)
    )
