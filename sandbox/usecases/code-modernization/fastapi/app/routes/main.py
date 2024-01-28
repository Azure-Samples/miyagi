# routes.py

from fastapi import APIRouter, HTTPException

from app.data.input_data import InputData
from app.orchestration.transformer_selector import transform_with

router = APIRouter()


@router.post("/transform")
async def transform_code(input_data: InputData):
    try:
        return await transform_with(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
