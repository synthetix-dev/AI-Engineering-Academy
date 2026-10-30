from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RAGCollectionCreate(BaseModel):
    name: str
    description: str
    project_id: Optional[str] = None
    chunk_size: int = 250
    chunk_overlap: int = 50

class RAGDocumentCreate(BaseModel):
    title: str
    content: str

class RAGSearchRequest(BaseModel):
    collection_id: str
    query: str
    top_k: int = 3

class RAGSearchResponse(BaseModel):
    query: str
    results: List[Dict[str, Any]]
    synthesized_answer: Optional[str] = None

class AgentConfigCreate(BaseModel):
    name: str
    system_role: str
    allowed_tools: List[str]
    max_iterations: int = 5
    project_id: Optional[str] = None

class AgentRunCreate(BaseModel):
    agent_config_id: str
    task_input: str

class AgentRunResponse(BaseModel):
    id: str
    task_input: str
    status: str
    steps_trace: List[Dict[str, Any]]
    final_output: str
    execution_time_ms: float
