from time import sleep

from celery import current_task

from celery_app import celery_app


@celery_app.task(acks_late=True)
def agent_chat_with_celery(prompt: str) -> str:
    for i in range(1, 11):
        sleep(1)
        current_task.update_state(state='PROGRESS',
                                  meta={'process_percent': i*10})
    return f"Working on {prompt}"
