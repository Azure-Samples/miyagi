from pydantic import BaseModel

from data.orchestrator import Orchestrator


class ExpenseData(BaseModel):
    vendor: str
    description: str
    price: str


class ExpenseInput(BaseModel):
    data: ExpenseData
    orchestrator: Orchestrator
