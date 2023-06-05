from data.expense_data import ExpenseInput
from data.orchestrator import Orchestrator


async def classify_expense(expense_input: ExpenseInput):
    orchestrator = expense_input.orchestrator
    # Here you need to implement the logic for each of the orchestrators
    if orchestrator == Orchestrator.GUIDANCE:
        # classify using guidance orchestrator
        pass
    elif orchestrator == Orchestrator.SEMANTICKERNEL:
        # classify using semantickernel orchestrator
        pass
    elif orchestrator == Orchestrator.LANGCHAIN:
        # classify using langchain orchestrator
        pass
    else:
        raise ValueError(f"Invalid orchestrator: {orchestrator}")
