from app.data.input_data import InputData
from app.data.orchestrator import Orchestrator
from app.services.lc_transformer import transform
from app.orchestration.promptflow import pf_transform


async def transform_with(input_data: InputData):
    """
    This function is the entry point for the transforming code with orchestrator
    """
    match input_data.orchestrator:
        case Orchestrator.LANGCHAIN:
            return await transform(input_data)
        case Orchestrator.PROMPTFLOW:
            return await pf_transform(input_data)
        case _:
            raise ValueError(f"Invalid orchestrator: {input_data.orchestrator}")
