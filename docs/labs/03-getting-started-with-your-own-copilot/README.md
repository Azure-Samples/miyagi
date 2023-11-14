# Getting Started with Your Own Copilot

## 0. Prerequisites

> Ensure the prerequisites mentioned [in Build and Run Miyagi](../02-build-and-run-miyagi/README.md/#1-setup-local-environment) are completed.

## 1. Configure and Run the Semantic Kernel Sample

1. Open a new window in VSCode and select the Semantic Kernel plugin from the left panel.
1. Under `AI Endpoints (Azure OpenAI)`, click on `Sign in to Azure` and follow the prompts to sign in.
1. From the `Functions` panel, click on the `Get started` icon and follow the wizard to create your app with the semantic function:
   ![SK-getting started](get-started-sk.png)
1. Choose either the `C# Hello World` or `Python Hello World` sample.
   ![App Selector](starter-app.png)
1. Follow the `README` in the Hello World starter and configure it with your `Azure OpenAI` endpoint.
1. Run the sample application after configuring.

## 2. Configure Azure Cognitive Search

1. From the Azure Portal, create and provision Azure Cognitive Search.
1. Click on the `Import data` button at the top of the Overview blade.
1. Follow the wizard to ingest a document and semantically index it.
