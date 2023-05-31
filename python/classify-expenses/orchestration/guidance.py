import logging

import guidance

from data.expense_data import ExpenseInput
from settings import settings

classify_llm = guidance.llms.AzureOpenAI(
    model="gpt-4-0314",
    client_id=settings.openai_api_key,
    endpoint=settings.openai_api_base)

async def guidance_classify(expense_input: ExpenseInput):
    # pre-define valid expense categories
    valid_categories = ["Learning", "Housing", "Utilities", "Clothing", "Transportation"]

    classify = guidance(f"""
            {{#system~}}
            You are an expense classifier that responds back in valid JSON. \n
            Classify the expense, given the description, vendor name, and price. Include a \
            justification, omitting excess details
            {{/system~}}
            {{#user~}}
            Classify the following JSON:
            ---
            ```json
            {
                "description": "{{expense_input.data.description}}",
                "vendor": "{{expense_input.data.vendor}}",
                "price": "{{expense_input.data.price}}",
                "name": "{{gen 'name'}}",
                "category": "{{select 'category' options=valid_categories}}",
                "justification": "{{gen 'justification'}}"
            }```""", llm=classify_llm)

    output = classify(expense_input=expense_input)
    logging.info('Classified %s', output)
    return output
