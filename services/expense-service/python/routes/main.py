# routes.py

from fastapi import APIRouter, HTTPException

from data.expense_data import ExpenseInput
from orchestration.classify_expense import classify_expense

router = APIRouter()


@router.post("/classify")
async def classify_expenses_route(expense_input: ExpenseInput):
    try:
        return await classify_expense(expense_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
