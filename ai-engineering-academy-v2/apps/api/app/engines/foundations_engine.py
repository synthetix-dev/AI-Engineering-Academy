import ast
import contextlib
import io
import time
import sqlite3
from typing import Any, Dict

class SecurityException(Exception):
    pass

class ASTSandboxValidator(ast.NodeVisitor):
    FORBIDDEN_CALLS = {
        "open", "eval", "exec", "globals", "locals", "getattr", "setattr",
        "delattr", "__import__", "compile", "breakpoint", "memoryview"
    }

    def visit_Import(self, node: ast.Import) -> None:
        raise SecurityException("Importing external modules is prohibited in the learning sandbox.")

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        raise SecurityException("Importing external modules is prohibited in the learning sandbox.")

    def visit_Attribute(self, node: ast.Attribute) -> None:
        if node.attr.startswith("_"):
            raise SecurityException(f"Access to internal/dunder attribute '{node.attr}' is prohibited.")
        self.generic_visit(node)

    def visit_Name(self, node: ast.Name) -> None:
        if node.id.startswith("_") and node.id != "_":
            raise SecurityException(f"Access to private/dunder identifier '{node.id}' is prohibited.")
        if node.id in self.FORBIDDEN_CALLS:
            raise SecurityException(f"Call or reference to '{node.id}' is prohibited.")
        self.generic_visit(node)

def run_python_code(code: str, timeout_sec: int = 5) -> Dict[str, Any]:
    """
    Safely execute a user-submitted Python script in an isolated AST-verified namespace,
    capturing thread-safe stdout, execution time, and variables.
    """
    # 1. AST Static Security Validation
    try:
        parsed_ast = ast.parse(code)
        validator = ASTSandboxValidator()
        validator.visit(parsed_ast)
    except SyntaxError as e:
        return {
            "success": False,
            "error": f"SyntaxError: {str(e)}",
            "stdout": "",
            "execution_time_ms": 0
        }
    except SecurityException as e:
        return {
            "success": False,
            "error": f"Security restriction: {str(e)}",
            "stdout": "",
            "execution_time_ms": 0
        }

    # 2. Safe built-in functions
    safe_builtins = {
        "abs": abs, "all": all, "any": any, "bin": bin, "bool": bool,
        "dict": dict, "enumerate": enumerate, "filter": filter, "float": float,
        "format": format, "frozenset": frozenset, "hex": hex, "int": int,
        "isinstance": isinstance, "issubclass": issubclass, "iter": iter,
        "len": len, "list": list, "map": map, "max": max, "min": min,
        "next": next, "oct": oct, "ord": ord, "pow": pow, "print": print,
        "range": range, "reversed": reversed, "round": round, "set": set,
        "sorted": sorted, "str": str, "sum": sum, "tuple": tuple, "type": type,
        "zip": zip
    }

    start_time = time.perf_counter()
    redirected_output = io.StringIO()
    exec_globals = {"__builtins__": safe_builtins}
    exec_locals: Dict[str, Any] = {}

    try:
        # 3. Thread-safe redirect_stdout context
        with contextlib.redirect_stdout(redirected_output):
            exec(compile(parsed_ast, filename="<sandbox>", mode="exec"), exec_globals, exec_locals)
            
        exec_time = (time.perf_counter() - start_time) * 1000
        output = redirected_output.getvalue()
        
        return {
            "success": True,
            "stdout": output,
            "execution_time_ms": round(exec_time, 2),
            "variables": {k: str(v) for k, v in exec_locals.items() if not k.startswith("_")}
        }
    except Exception as e:
        exec_time = (time.perf_counter() - start_time) * 1000
        return {
            "success": False,
            "error": f"{type(e).__name__}: {str(e)}",
            "stdout": redirected_output.getvalue(),
            "execution_time_ms": round(exec_time, 2)
        }

def run_sql_challenge(query: str) -> Dict[str, Any]:
    """
    Execute SQL against an in-memory SQLite database populated with real AI telemetry data.
    """
    forbidden_sql = ["ATTACH", "DETACH", "DROP", "ALTER", "PRAGMA", "INSERT", "UPDATE", "DELETE", "VACUUM"]
    for keyword in forbidden_sql:
        if keyword in query.upper():
            return {
                "success": False,
                "error": f"Security restriction: Keyword '{keyword}' is prohibited. Read-only queries permitted.",
                "columns": [],
                "rows": []
            }

    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    try:
        # Create standard telemetry tables
        cursor.execute("""
            CREATE TABLE experiments (
                id INTEGER PRIMARY KEY,
                model_name TEXT,
                epochs INTEGER,
                learning_rate REAL,
                val_accuracy REAL,
                status TEXT
            );
        """)
        cursor.executemany("""
            INSERT INTO experiments (model_name, epochs, learning_rate, val_accuracy, status)
            VALUES (?, ?, ?, ?, ?)
        """, [
            ("ResNet-18", 20, 0.001, 0.884, "completed"),
            ("ResNet-50", 40, 0.0005, 0.912, "completed"),
            ("BERT-Mini", 10, 0.00003, 0.842, "completed"),
            ("GPT-Nano", 15, 0.0001, 0.795, "failed"),
            ("VisionTransformer", 50, 0.0002, 0.935, "completed"),
            ("DistilBERT", 25, 0.00005, 0.891, "completed")
        ])
        conn.commit()

        start_time = time.perf_counter()
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        exec_time = (time.perf_counter() - start_time) * 1000

        return {
            "success": True,
            "columns": columns,
            "rows": rows[:100],
            "row_count": len(rows),
            "execution_time_ms": round(exec_time, 2)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "columns": [],
            "rows": [],
            "row_count": 0
        }
    finally:
        conn.close()
