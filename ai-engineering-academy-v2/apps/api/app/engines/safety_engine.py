import re
from typing import Any, Dict, List

INJECTION_PATTERNS = [
    (r"(?i)ignore\s+(all\s+)?(previous|prior|above)\s+instructions?", "LLM01: Ignore Instructions Override"),
    (r"(?i)you\s+are\s+now\s+(unrestricted|in\s+god\s+mode|dan|jailbroken)", "LLM01: Role Hijacking / DAN Mode"),
    (r"(?i)system\s*:\s*override", "LLM01: System Prompt Forgery"),
    (r"(?i)print\s+['\"]pwned['\"]", "LLM01: Adversarial Canary Trigger"),
    (r"(?i)reveal\s+(your\s+)?(developer\s+prompt|system\s+instructions?)", "LLM01: System Instructions Exfiltration"),
    (r"---BEGIN\s+SYSTEM\s+PROMPT---", "LLM01: Delimiter Escape Injection")
]

PII_PATTERNS = [
    (r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "PII: Email Address"),
    (r"\b\d{3}-\d{2}-\d{4}\b", "PII: US Social Security Number"),
    (r"\b(?:\d{4}[-\s]?){3}\d{4}\b", "PII: Credit Card Number"),
    (r"(?i)(api_key|secret_key|private_key)\s*[:=]\s*['\"]?[a-zA-Z0-9_\-]{20,}['\"]?", "PII: API / Private Key")
]

def audit_prompt_safety(prompt_text: str, strict_mode: bool = True) -> Dict[str, Any]:
    """
    Scan user prompt or context for security vulnerabilities, injection vectors,
    and sensitive data disclosures following OWASP LLM guidelines.
    """
    detected_threats = []
    
    # 1. Check prompt injection indicators
    for pattern, threat_name in INJECTION_PATTERNS:
        match = re.search(pattern, prompt_text)
        if match:
            detected_threats.append({
                "category": "prompt_injection",
                "threat_name": threat_name,
                "matched_substring": match.group(0),
                "severity": "HIGH",
                "owasp_code": "LLM01"
            })

    # 2. Check PII exfiltration indicators
    for pattern, threat_name in PII_PATTERNS:
        match = re.search(pattern, prompt_text)
        if match:
            detected_threats.append({
                "category": "sensitive_data_exposure",
                "threat_name": threat_name,
                "matched_substring": match.group(0)[:6] + "****", # partially redacted
                "severity": "CRITICAL",
                "owasp_code": "LLM06"
            })

    is_safe = (len(detected_threats) == 0)
    safety_score = max(0.0, 100.0 - (len(detected_threats) * 35.0))

    mitigations = []
    if not is_safe:
        mitigations.append("Enforce strict input sanitization and delimiter sandboxing.")
        mitigations.append("Use separate privilege domains for untrusted user inputs.")
        mitigations.append("Implement automated PII scrubbing prior to model inference.")

    return {
        "is_safe": is_safe,
        "safety_score_100": safety_score,
        "threats_detected_count": len(detected_threats),
        "threats": detected_threats,
        "recommended_mitigations": mitigations
    }
