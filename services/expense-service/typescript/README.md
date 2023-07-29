# Classifying expenses using TypeChat

This example shows how to use [TypeChat](https://github.com/microsoft/TypeChat) to classify expenses for the Miyagi classification use case.


## Running the example

### Option 1: Local development environment

Ensure [Node.js (18.16.0 LTS or newer)](https://nodejs.org/en) or newer is installed.

```
npm install
```

### Option 2: GitHub Codespaces

On the Miyagi repository page:

1. Click the green button labeled `<> Code`
2. Select the `Codespaces` tab.
3. Click the green `Create codespace` button.

<details>
<summary>If this is your first time creating a codespace, read this.</summary>

If this is your first time creating a codespace on this repository, GitHub will take a moment to create a dev container image for your session.
Once the image has been created, the browser will load Visual Studio Code in a developer environment automatically configured with the necessary prerequisites, Miyagi cloned, and packages installed.

Remember that you are running in the cloud, so all changes you make to the source tree must be committed and pushed before destroying the codespace. GitHub accounts are usually configured to automatically delete codespaces that have been inactive for 30 days.

For more information, see the [GitHub Codespaces Overview](https://docs.github.com/en/codespaces/overview)
</details>

## Step 2: Build Expense Service

Build Miyagi's Expense Service:

```
npm run build
```

## Step 3: Configure environment variables

Currently, the examples are running on OpenAI or Azure OpenAI endpoints.
To use an OpenAI endpoint, include the following environment variables:

| Variable | Value |
|----------|-------|
| `OPENAI_MODEL`| The OpenAI model name (e.g. `gpt-3.5-turbo` or `gpt-4`) |
| `OPENAI_API_KEY` | Your OpenAI API key |

To use an Azure OpenAI endpoint, include the following environment variables:

| Variable | Value |
|----------|-------|
| `AZURE_OPENAI_ENDPOINT` | The full URL of the Azure OpenAI REST API (e.g. `https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2023-05-15`) |
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI API key |

We recommend setting environment variables by creating a `.env` file in the root directory of the project that looks like the following:

```
# For OpenAI
OPENAI_MODEL=...
OPENAI_API_KEY=...

# For Azure OpenAI
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
```

## Step 4: Run

To run interactively, type `node ./dist/main.js` from this directory and enter requests when prompted. Type `quit` or `exit` to end the session. You can also open in VS Code the selected example's directory and press <kbd>F5</kbd> to launch it in debug mode. 

To run an example with one of these input files, run `node ./dist/main.js <input-file-path>`.

# Usage

For example, given the following input statement:

**Input**:
```
> TypeChat is awesome!
```

**Output**:
```
The sentiment is positive
```