from data.expense_data import ExpenseInput
from data.orchestrator import Orchestrator
from orchestration.guidance import guidance_classify
from orchestration.promptflow import pf_classify


async def classify_expense(expense_input: ExpenseInput):
    orchestrator = expense_input.orchestrator
    # Here you need to implement the logic for each of the orchestrators
    if orchestrator == Orchestrator.GUIDANCE:
        # classify using guidance orchestrator
        return await guidance_classify(expense_input)
    elif orchestrator == Orchestrator.SEMANTICKERNEL:
        # classify using semantickernel orchestrator
        pass
    elif orchestrator == Orchestrator.PROMPTFLOW:
        return await pf_classify(expense_input)
        pass
    elif orchestrator == Orchestrator.LANGCHAIN:
        # classify using langchain via promptflow
        pass
    else:
        raise ValueError(f"Invalid orchestrator: {orchestrator}")
