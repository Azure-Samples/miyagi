#!/bin/bash

# Creates a Semantic Kernel service deployment.

set -e

usage() {
    echo "Usage: $0 -d DEPLOYMENT_NAME -s SUBSCRIPTION [OPTIONS]"
    echo ""
    echo "Arguments:"
    echo "  -d, --deployment-name DEPLOYMENT_NAME      Name for the deployment (mandatory)"
    echo "  -s, --subscription SUBSCRIPTION            Subscription to which to make the deployment (mandatory)"
    echo "  -rg, --resource-group RESOURCE_GROUP       Resource group to which to make the deployment (default: \"rg-\$DEPLOYMENT_NAME\")"
    echo "  -r, --region REGION                        Region to which to make the deployment (default: \"South Central US\")"
    echo "  -p, --package-uri PACKAGE_URI              Package to deploy to web service (default: 'https://skaasdeploy.blob.core.windows.net/api/skaas.zip')"
    echo "  -a, --app-service-sku APP_SERVICE_SKU      SKU for the Azure App Service plan (default: \"B1\")"
    echo "  -k, --sk-server-api-key SK_SERVER_API_KEY  API key to access Semantic Kernel server's endpoints (default: random UUID)"
    echo "  -nq, --no-qdrant                           Don't deploy Qdrant for memory storage - Use volatile memory instead"
    echo "  -nc, --no-cosmos-db                        Don't deploy Cosmos DB for chat storage - Use volatile memory instead"
    echo "  -ns, --no-speech-services                  Don't deploy Speech Services to enable speech as chat input"
    echo "  -dd, --debug-deployment                    Switches on verbose template deployment output"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--deployment-name)
        DEPLOYMENT_NAME="$2"
        shift
        shift
        ;;
        -s|--subscription)
        SUBSCRIPTION="$2"
        shift
        shift
        ;;
        -rg|--resource-group)
        RESOURCE_GROUP="$2"
        shift
        shift
        ;;
        -r|--region)
        REGION="$2"
        shift
        shift
        ;;
        -p|--package-uri)
        PACKAGE_URI="$2"
        shift
        shift
        ;;
        -a|--app-service-sku)
        APP_SERVICE_SKU="$2"
        shift
        shift
        ;;
        -k|--sk-server-api-key)
        SK_SERVER_API_KEY="$2"
        shift
        shift
        ;;
        -nq|--no-qdrant)
        NO_QDRANT=true
        shift
        ;;
        -nc|--no-cosmos-db)
        NO_COSMOS_DB=true
        shift
        ;;
        -ns|--no-speech-services)
        NO_SPEECH_SERVICES=true
        shift
        ;;
        -dd|--debug-deployment)
        DEBUG_DEPLOYMENT=true
        shift
        ;;
        *)
        usage
        exit 1
        ;;
    esac
done

if [[ -z "$DEPLOYMENT_NAME" ]] || [[ -z "$SUBSCRIPTION" ]]; then
    usage
    exit 1
fi

if [ -z "$RESOURCE_GROUP" ]; then
    RESOURCE_GROUP="$rg-{RESOURCE_GROUP}"
fi

TEMPLATE_FILE="$(dirname "$0")/sk-new.bicep"

echo "Log into your Azure account"
az login --use-device-code

az account set -s "$SUBSCRIPTION"

# Set defaults
: "${REGION:="South Central US"}"
: "${PACKAGE_URI:="https://skaasdeploy.blob.core.windows.net/api/skaas.zip"}"
: "${APP_SERVICE_SKU:="B1"}"
: "${SK_SERVER_API_KEY:="$(uuidgen)"}"
: "${NO_QDRANT:=false}"
: "${NO_COSMOS_DB:=false}"
: "${NO_SPEECH_SERVICES:=false}"

# Create JSON config
JSON_CONFIG=$(cat << EOF
{
    "name": { "value": "$DEPLOYMENT_NAME" },
    "packageUri": { "value": "$PACKAGE_URI" },
    "appServiceSku": { "value": "$APP_SERVICE_SKU" },
    "skServerApiKey": { "value": "$SK_SERVER_API_KEY" },
    "deployQdrant": { "value": $([ "$NO_QDRANT" = true ] && echo "false" || echo "true") },
    "deployCosmosDB": { "value": $([ "$NO_COSMOS_DB" = true ] && echo "false" || echo "true") },
    "deploySpeechServices": { "value": $([ "$NO_SPEECH_SERVICES" = true ] && echo "false" || echo "true") }
}
EOF
)

echo "Creating resource group $RESOURCE_GROUP if it doesn't exist..."
az group create --location "$REGION" --name "$RESOURCE_GROUP" --tags Creator="$USER"

echo "Validating template file..."
az deployment group validate --name "$DEPLOYMENT_NAME" --resource-group "$RESOURCE_GROUP" --template-file "$TEMPLATE_FILE" --parameters "$JSON_CONFIG"

echo "Deploying..."
if [ "$DEBUG_DEPLOYMENT" = true ]; then
    az deployment group create --name "$DEPLOYMENT_NAME" --resource-group "$RESOURCE_GROUP" --template-file "$TEMPLATE_FILE" --debug --parameters "$JSON_CONFIG"
else
    az deployment group create --name "$DEPLOYMENT_NAME" --resource-group "$RESOURCE_GROUP" --template-file "$TEMPLATE_FILE" --parameters "$JSON_CONFIG"
fi