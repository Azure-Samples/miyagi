# Semantic Kernel MS Graph Sample

Based on Semantic Kernel's [Authenticated API Sample](https://github.com/microsoft/semantic-kernel/tree/main#samples-), 
this subfolder contains a sample that demonstrates how to use Semantic Kernel to connect to the Microsoft Graph using your personal account.
It highlights Open ID Connect (OIDC) authentication and calling APIs for MS Graph to personalize the user experience.


## Pre-requisites

- [Node.js](https://nodejs.org/en/download/) (v14.17.0 or later)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) (v1.22.10 or later)
- [Open AI Key](https://openai.com/api/) or [Azure Open AI Service key](https://learn.microsoft.com/azure/cognitive-services/openai/quickstart)
- [Semantic Kernel HTTP Server](https://github.com/microsoft/semantic-kernel)

## Running the sample

1. Copy the `.env.example` file to `.env` and fill in the values for the missing keys.
2. Ensure Semantic Kernel's service API is already running `http://localhost:7071`.
3. For MS Graph, 
   [register your application](https://learn.microsoft.com/azure/active-directory/develop/quickstart-register-app)
   . Follow the steps to register your app
   [here](https://learn.microsoft.com/azure/active-directory/develop/quickstart-register-app).
    - Select **`Single-page application (SPA)`** as platform type, and the Redirect URI will be **`http://localhost:3000`**
    - It is recommended you use the **`Personal Microsoft accounts`** account type for this sample.
4. Once registered, copy the **Application (client) ID** from the Azure Portal and paste
   the GUID into the **[.env](.env)** file next to `REACT_APP_GRAPH_CLIENT_ID=` (first line of the .env file).
5. **Run** the following command `yarn install` (if you have never run the sample before)
   and/or `yarn start` from the command line.
6. A browser will automatically open, otherwise you can navigate to `http://localhost:3000` to use the sample.

