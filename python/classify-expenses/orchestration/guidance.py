import logging

import guidance

from data.expense_data import ExpenseInput
from settings import settings


guidance.llm = guidance.llms.OpenAI(
    'text-davinci-003',
    api_type='azure',
    api_key=settings.openai_api_key,
    api_base=settings.openai_api_base,
    api_version='2023-05-15',
    deployment_id='gk-davinci-003',
    caching=True
)


async def guidance_classify(expense_input: ExpenseInput):
    # pre-define valid expense categories
    valid_categories = ["Learning", "Housing", "Utilities", "Clothing", "Transportation"]

    # define the prompt
    classify = guidance("""
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
            }```""")

    # execute the prompt
    output = classify(expense_input=expense_input, valid_categories=valid_categories)
    logging.info('Classified %s', output)

    return output
