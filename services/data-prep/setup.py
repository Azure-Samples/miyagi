from setuptools import setup, find_packages

setup(
    name="data-prep",
    version="0.1.0",
    description="Preps private data for Miyagi",
    packages=find_packages(),
    install_requires=[
        "uvicorn>=0.20.0",
        "openai>=0.26.1",
        "fastapi>=0.89.1",
        "pydantic>=1.10.4",
        "praw>=7.7.0",
        "pypdf>=3.8.0",
        "azure-storage-blob>=12.16.0",
    ],
    extras_require={
        "dev": [
            "pytest>=6.2.5",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
    ],
)
