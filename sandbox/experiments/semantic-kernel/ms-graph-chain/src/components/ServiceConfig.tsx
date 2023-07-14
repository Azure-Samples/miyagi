// Copyright (c) Microsoft. All rights reserved.

import { Body1, Button, Input, Label, Spinner, Tab, TabList, Title3 } from '@fluentui/react-components';
import { FC, useEffect, useState } from 'react';
import { useSemanticKernel } from '../hooks/useSemanticKernel';
import { IKeyConfig } from '../model/KeyConfig';

interface IData {
    uri: string;
    onConfigComplete: (keyConfig: IKeyConfig) => void;
}

const ServiceConfig: FC<IData> = ({ uri, onConfigComplete }) => {
    const [isOpenAI, setIsOpenAI] = useState<boolean>(true);
    const [keyConfig, setKeyConfig] = useState<IKeyConfig>({} as IKeyConfig);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const sk = useSemanticKernel(process.env.REACT_APP_FUNCTION_URI as string);

    const [openAiKey, setOpenAiKey] = useState<string>(process.env.REACT_APP_OPEN_AI_KEY as string);
    const [openAiModel, setOpenAiModel] = useState<string>(process.env.REACT_APP_OPEN_AI_MODEL as string);
    const [azureOpenAiKey, setAzureOpenAiKey] = useState<string>(process.env.REACT_APP_AZURE_OPEN_AI_KEY as string);
    const [azureOpenAiDeployment, setAzureOpenAiDeployment] = useState<string>(
        process.env.REACT_APP_AZURE_OPEN_AI_DEPLOYMENT as string,
    );
    const [azureOpenAiEndpoint, setAzureOpenAiEndpoint] = useState<string>(
        process.env.REACT_APP_AZURE_OPEN_AI_ENDPOINT as string,
    );

    const saveKey = async () => {
        setIsBusy(true);

        //POST a simple ask to validate the key
        const ask = { value: 'miyagi', inputs: [{ key: 'style', value: 'Jim Cramer' }] };

        try {
            var result = await sk.invokeAsync(keyConfig, ask, 'funskill', 'joke');
            console.log(result);
            onConfigComplete(keyConfig);
        } catch (e) {
            alert('Something went wrong.\n\nDetails:\n' + e);
        }

        setIsBusy(false);
    };

    useEffect(() => {
        keyConfig.completionConfig = {
            key: isOpenAI ? openAiKey : azureOpenAiKey,
            deploymentOrModelId: isOpenAI ? openAiModel : azureOpenAiDeployment,
            label: isOpenAI ? openAiModel : azureOpenAiDeployment,
            endpoint: isOpenAI ? '' : azureOpenAiEndpoint,
            backend: isOpenAI ? 1 : 0
        }

        setKeyConfig((keyConfig) => ({ ...keyConfig }));
    }, [isOpenAI, openAiKey, openAiModel, azureOpenAiKey, azureOpenAiDeployment, azureOpenAiEndpoint]);

    return (
        <>
            <Title3>Values from .env</Title3>
            <Body1>
                If not present, update .env or here. If you are using Azure OpenAI, you will need to create a deployment
            </Body1>

            <TabList defaultSelectedValue="oai" onTabSelect={(t, v) => setIsOpenAI(v.value === 'oai')}>
                <Tab value="oai">OpenAI</Tab>
                <Tab value="aoai">Azure OpenAI</Tab>
            </TabList>

            {isOpenAI ? (
                <>
                    <Label htmlFor="openaikey">OpenAI Key</Label>
                    <Input
                        id="openaikey"
                        type="password"
                        value={openAiKey}
                        onChange={(e, d) => {
                            setOpenAiKey(d.value);
                            setKeyConfig({ ...keyConfig, completionConfig: { ...keyConfig.completionConfig, key: d.value } });
                        }}
                        placeholder="Enter your OpenAI key here"
                    />
                    <Label htmlFor="oaimodel">Model</Label>
                    <Input
                        id="oaimodel"
                        value={openAiModel}
                        onChange={(e, d) => {
                            setOpenAiModel(d.value);
                            setKeyConfig({ ...keyConfig, completionConfig: { ...keyConfig.completionConfig, deploymentOrModelId: d.value, label: d.value } });
                        }}
                        placeholder="Enter the model id here, ie: text-davinci-003"
                    />
                </>
            ) : (
                <>
                    <Label htmlFor="azureopenaikey">Azure OpenAI Key</Label>
                    <Input
                        id="azureopenaikey"
                        type="password"
                        value={azureOpenAiKey}
                        onChange={(e, d) => {
                            setAzureOpenAiKey(d.value);
                            setKeyConfig({ ...keyConfig, completionConfig: { ...keyConfig.completionConfig, key: d.value } });
                        }}
                        placeholder="Enter your Azure OpenAI key here"
                    />
                    <Label htmlFor="oaimodel">Model</Label>
                    <Input
                        id="aoaideployment"
                        value={azureOpenAiDeployment}
                        onChange={(e, d) => {
                            setAzureOpenAiDeployment(d.value);
                            setKeyConfig({ ...keyConfig, completionConfig: { ...keyConfig.completionConfig, deploymentOrModelId: d.value, label: d.value } });
                        }}
                        placeholder="Enter your deployment id here, ie: my-deployment"
                    />
                    <Label htmlFor="oaiendpoint">Endpoint</Label>
                    <Input
                        id="aoaiendpoint"
                        value={azureOpenAiEndpoint}
                        onChange={(e, d) => {
                            setAzureOpenAiEndpoint(d.value);
                            setKeyConfig({ ...keyConfig, completionConfig: { ...keyConfig.completionConfig, endpoint: d.value } });
                        }}
                        placeholder="Enter the endpoint here, ie: https://my-resource.openai.azure.com"
                    />
                </>
            )}

            <Button style={{ width: 70, height: 32 }} disabled={isBusy} appearance="primary" onClick={saveKey}>
                Save
            </Button>
            {isBusy ? <Spinner /> : null}
        </>
    );
};

export default ServiceConfig;
