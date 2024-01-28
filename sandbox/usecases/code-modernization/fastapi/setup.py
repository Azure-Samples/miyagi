# Python script to generate requirements.txt from setup.py
from setuptools import find_packages, setup

# Define your setup configuration as a dictionary
setup_cfg = {
    "name": "code-converter",
    "version": "0.1.0",
    "description": "Sample app to showcase code conversion with Azure OpenAI",
    "packages": find_packages(),
    "install_requires": [
        "uvicorn>=0.27.0",
        "langchain>=0.1.4",
        "langchain-openai>=0.0.5",
        "fastapi>=0.109.0",
        "pydantic>=2.5.3",
        "pydantic-settings>=2.1.0"
    ],
    "extras_require": {
        "dev": [
            "pytest>=7.4.4",
        ],
    },
    "classifiers": [
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
    ],
}

# Run setup with the configuration
setup(**setup_cfg)

# Write the install_requires to requirements.txt
with open("requirements.txt", "w") as f:
    for dep in setup_cfg["install_requires"]:
        f.write(dep + "\n")
