# azure_ai_utils.py
import io
import matplotlib.pyplot as plt
from typing import Iterable
from pathlib import Path
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Import AzureOpenAI and assistant-related Message classes
from openai import AzureOpenAI
from openai.types.beta.threads.message_content_image_file import MessageContentImageFile
from openai.types.beta.threads.message_content_text import MessageContentText
from openai.types.beta.threads.messages import MessageFile


class NotCompletedException(Exception):
    """Custom exception for handling incomplete run statuses."""
    pass


class AzureAIUtils:
    """
    A utility class for various Azure AI operations including
    message formatting, file uploading, and lifecycle status checking.
    """

    def __init__(self, client: AzureOpenAI):
        """
        Initialize the utility class with an AzureOpenAI client.

        Parameters:
        client (AzureOpenAI): An instance of the AzureOpenAI client.
        """
        self.client = client

    def format_response(self, messages: Iterable[MessageFile]) -> None:
        """
        Formats and prints the content of messages from AzureOpenAI.

        Parameters:
        messages (Iterable[MessageFile]): An iterable of MessageFile objects.
        """
        message_list = []

        for message in messages:
            message_list.append(message)
            if message.role == "user":
                break

        message_list.reverse()

        for message in message_list:
            for item in message.content:
                if isinstance(item, MessageContentText):
                    print(f"{message.role}:\n{item.text.value}\n")
                elif isinstance(item, MessageContentImageFile):
                    try:
                        response_content = self.client.files.content(
                            item.image_file.file_id
                        )
                        data_in_bytes = response_content.read()
                        readable_buffer = io.BytesIO(data_in_bytes)
                        image = plt.imread(readable_buffer, format="jpeg")
                        plt.imshow(image)
                        plt.axis("off")
                        plt.show()
                    except Exception as e:
                        print(f"Exception: {e}")

    def upload_file(self, path: Path):
        """
        Uploads a file to AzureOpenAI.

        Parameters:
        path (Path): The path to the file to be uploaded.

        Returns:
        FileObject: The file object created in AzureOpenAI.
        """
        with path.open("rb") as f:
            return self.client.files.create(file=f, purpose="assistants")

    @retry(
    stop=stop_after_attempt(15),
    wait=wait_exponential(multiplier=1.5, min=4, max=20),
    retry=retry_if_exception_type(NotCompletedException),
    )
    def get_run_lifecycle_status(self, thread_id, run_id, action_func=None):
        """
        Retrieves and prints the lifecycle status of a run and
        retries based on specific conditions. Optionally calls a function if provided.

        Parameters:
        thread_id: The ID of the thread.
        run_id: The ID of the run.
        action_func (optional): A callable function to be executed when the run requires action.

        Returns:
        The run object if its status is 'completed', 'failed', 'expired', or 'cancelled'.

        Raises:
        NotCompletedException: If the run is not yet completed.
        """
        run = self.client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        print(f"Run status: {run.status}")
        if run.status in ["completed", "failed", "expired", "cancelled"]:
            print(f"Run info: {run}")
            return run
        elif run.status == "requires_action":
            print(f"Run requires action: {run}")
            if action_func:
                action_func() 
            return run
        else:
            raise NotCompletedException("Run not completed yet")
