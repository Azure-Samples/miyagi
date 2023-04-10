from setuptools import setup, find_packages

setup(
    name="memory-service",
    version="0.1.0",
    description="A facade to vector memory stores",
    packages=find_packages(),
    install_requires=[
        "uvicorn==0.20.0",
        "openai==0.26.1",
        "fastapi==0.89.1",
        "pydantic~=1.10.4",
        "qdrant-client==1.1.3",
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
