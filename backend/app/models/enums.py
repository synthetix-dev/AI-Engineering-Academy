import enum

class UserRole(str, enum.Enum):
    GUEST = "guest"
    LEARNER = "learner"
    MENTOR = "mentor"
    CONTENT_AUTHOR = "content_author"
    ML_OPERATOR = "ml_operator"
    PLATFORM_ADMIN = "platform_admin"
    SERVICE_WORKER = "service_worker"

class RuntimeClass(str, enum.Enum):
    BROWSER_WASM = "browser_wasm"
    CPU_WORKER = "cpu_worker"
    GPU_WORKER = "gpu_worker"

class ExecutionMode(str, enum.Enum):
    DEMO = "demo"
    CPU_REAL = "cpu-real"
    GPU_REAL = "gpu-real"

class RunStatus(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

class RunErrorCode(str, enum.Enum):
    NONE = "NONE"
    VALIDATION = "VALIDATION"
    QUOTA = "QUOTA"
    UNSUPPORTED_MODE = "UNSUPPORTED_MODE"
    TIMEOUT = "TIMEOUT"
    OUT_OF_MEMORY = "OUT_OF_MEMORY"
    SANDBOX_VIOLATION = "SANDBOX_VIOLATION"
    INTERNAL = "INTERNAL"

class ProjectVisibility(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class MasteryLevel(str, enum.Enum):
    NOVICE = "novice"
    PROFICIENT = "proficient"
    EXPERT = "expert"
    MASTER = "master"
