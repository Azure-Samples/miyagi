import os

from celery import Celery

celery_app = None

if not bool(os.getenv('DOCKER')):
    celery_app = Celery(
        "worker",
        backend="redis://:use_managed_identity-change-this@localhost:6379/0",
        broker="amqp://user:bitnami@localhost:5672//"
    )
    celery_app.conf.task_routes = {
        "app.worker.celery_worker.agent_chat_with_celery": "test-queue"}
else:
    celery_app = Celery(
        "worker",
        backend="redis://:use_managed_identity-change-this@redis:6379/0",
        broker="amqp://user:bitnami@rabbitmq:5672//"
    )
    celery_app.conf.task_routes = {
        "app.app.worker.celery_worker.agent_chat_with_celery": "test-queue"}

celery_app.conf.update(task_track_started=True)
