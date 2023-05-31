# pull official base image
FROM python:3.9-slim-buster

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
  && apt-get -y install netcat gcc \
  && apt-get clean

# install python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . .

# expose port 1025
EXPOSE 1025

# run uvicorn command
CMD ["uvicorn", "main:app", "--port", "1025", "--host", "0.0.0.0", "--reload"]
