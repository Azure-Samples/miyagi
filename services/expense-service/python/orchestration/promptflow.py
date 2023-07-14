import urllib.request
import json
import os
import ssl

from fastapi.encoders import jsonable_encoder

from data.expense_data import ExpenseInput
from settings import settings


async def allow_self_signed_https(allowed):
    # bypass the server certificate verification on client side
    if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
        ssl._create_default_https_context = ssl._create_unverified_context


async def pf_classify(expense_input: ExpenseInput):
    # this line is needed if you use self-signed certificate in your scoring service.
    await allow_self_signed_https(True)

    # Request data goes here
    # The example below assumes JSON formatting which may be updated
    # depending on the format your endpoint expects.
    # More information can be found here:
    # https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script
    data = jsonable_encoder(expense_input.data)  # Convert data to JSON serializable format
    data = json.dumps(data).encode('utf-8')
    url = settings.pf_url
    # Replace this with the primary/secondary key or AMLToken for the endpoint
    api_key = settings.pf_api_key
    if not api_key:
        raise Exception("A key should be provided to invoke the endpoint")

    # The azureml-model-deployment header will force the request to go to a specific deployment.
    # Remove this header to have the request observe the endpoint traffic rules
    headers = {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + api_key),
               'azureml-model-deployment': 'blue'}

    req = urllib.request.Request(url, data, headers)

    try:
        response = urllib.request.urlopen(req)

        result = response.read()
        print(result)
        return result
    except urllib.error.HTTPError as error:
        print("The request failed with status code: " + str(error.code))

        # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
        print(error.info())
        print(error.read().decode("utf8", 'ignore'))
