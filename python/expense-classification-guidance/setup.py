from setuptools import setup, find_packages

setup(
    name="data-prep",
    version="0.1.0",
    description="Preps private data for Miyagi",
    packages=find_packages(),
    install_requires=[
        "uvicorn>=0.22.0",
        "openai>=0.27.6",
        "fastapi>=0.95.1",
        "pydantic>=1.10.7",
        "asyncpraw>=7.7.0",
        "guidance">="0.0.57"
        "memory-client>=1.1.7",
        "semantic-kernel>=0.2.7.dev0"
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
