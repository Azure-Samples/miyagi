import os
import requests
from pprint import pprint


def bing_news_search(query: str, mkt: str = 'en-US'):
    """
    This function makes a call to the Bing News Search API with a text query and returns relevant news webpages.
    Documentation: https: // docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/
    """
    # Add your Bing Search V7 subscription key and endpoint to your environment variables.
    SUBSCRIPTION_KEY = os.environ['BING_SEARCH_V7_SUBSCRIPTION_KEY']
    endpoint = os.environ['BING_SEARCH_V7_ENDPOINT'] + "/bing/v7.0/news/search"

    # Construct a request
    params = {'q': query, 'mkt': mkt}
    headers = {'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY}

    # Call the API
    try:
        response = requests.get(endpoint, headers=headers, params=params)
        response.raise_for_status()

        print("\nHeaders:\n")
        print(response.headers)

        print("\nJSON Response:\n")
        pprint(response.json())
    except Exception as ex:
        raise ex
