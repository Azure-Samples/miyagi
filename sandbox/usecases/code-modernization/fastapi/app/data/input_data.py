from typing import Optional

from pydantic import BaseModel

from app.data.orchestrator import Orchestrator


class CodeMetadata(BaseModel):
    domain: Optional[str] = "Microsoft"
    subdomain: Optional[str] = "msal"
    existing_language: Optional[str] = "python"
    desired_language: Optional[str] = "typescript-react"


class LegacyCode(BaseModel):
    code: str
    metadata: Optional[CodeMetadata] = None


class InputData(BaseModel):
    payload: LegacyCode
    orchestrator: Optional[Orchestrator] = Orchestrator.LANGCHAIN
