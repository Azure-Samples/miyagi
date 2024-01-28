# Code Convertor Service

This service showcases code conversion by utilizing Language Learning Models (LLMs). This project is set up using a `setup.py` script for easy installation and management of dependencies.

## Getting Started
Before you begin, ensure you have the following software installed and provisioned:
- [Docker](https://www.docker.com/)
- [Python](https://www.python.org/downloads/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Setup
To initialize the project, you'll need to create a `.env` file at the root of the project. This file should contain all of the environment variables required by the project. Use the `.env.example` file as a template.

## Local Development

```bash
pip install .
uvicorn app/main:app --reload
```
or, if you are using a virtual environment for development:
```bash
conda activate <env_name>
pip install ".[dev]"
uvicorn app/main:app --reload
```

```

### Local Development with Docker and Milvus
To run the project locally, execute the following command:
```bash
docker-compose up
```

### Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
