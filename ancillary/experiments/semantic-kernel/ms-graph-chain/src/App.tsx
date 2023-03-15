// Copyright (c) Microsoft. All rights reserved.

import { AuthenticatedTemplate, useAccount, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Subtitle1 } from '@fluentui/react-components';
import { FC, useEffect, useState } from 'react';
import FunctionProbe from './components/FunctionProbe';
import InteractWithGraph from './components/InteractWithGraph';
import ServiceConfig from './components/ServiceConfig';
import YourInfo from './components/YourInfo';
import { IKeyConfig } from './model/KeyConfig';

const App: FC = () => {
    enum AppState {
        ProbeForFunction = 0,
        YourInfo = 1,
        Setup = 2,
        InteractWithGraph = 3,
    }

    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [appState, setAppState] = useState<AppState>(AppState.ProbeForFunction);
    const [selectedTabValue, setSelectedTabValue] = useState<string>(isAuthenticated ? 'setup' : 'yourinfo');
    const [config, setConfig] = useState<IKeyConfig>();

    const appStateToTabValueMap = new Map<AppState, string>([
        [AppState.Setup, 'setup'],
        [AppState.InteractWithGraph, 'interact'],
        [AppState.YourInfo, 'yourinfo'],
    ]);
    const tabValueToAppStateMap = new Map<string, AppState>([
        ['setup', AppState.Setup],
        ['yourinfo', AppState.YourInfo],
        ['interact', AppState.InteractWithGraph],
    ]);

    useEffect(() => {
        changeAppState(appState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState]);

    useEffect(() => {
        if (isAuthenticated) {
            setAppState(AppState.Setup);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const changeAppState = function (newAppState: AppState) {
        setAppState(newAppState);
        setSelectedTabValue(appStateToTabValueMap.get(newAppState) ?? 'setup');
    };
    const changeTabValue = function (newTabValue: string) {
        setSelectedTabValue(newTabValue);
        setAppState(tabValueToAppStateMap.get(newTabValue) ?? AppState.Setup);
    };

    useEffect(() => {
        const fetchAsync = async () => {
            if (config === undefined || config === null) {
                return;
            }

            var result = await instance.acquireTokenSilent({
                account: account !== null ? account : undefined,
                scopes: (process.env.REACT_APP_GRAPH_SCOPES as string).split(','),
                forceRefresh: false,
            });

            config.graphToken = result.accessToken;
            setConfig(config);
        };

        fetchAsync();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);


    return (
        <div id="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div id="header">
                <Subtitle1 as="h1">Miyagi MS Graph usecase</Subtitle1>
            </div>

            {appState === AppState.ProbeForFunction ? (
                <FunctionProbe
                    uri={process.env.REACT_APP_FUNCTION_URI as string}
                    onFunctionFound={() => setAppState(isAuthenticated ? AppState.Setup : AppState.YourInfo)}
                />
            ) : null}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                    paddingLeft: 40,
                    gap: 10,
                    alignContent: 'start',
                    justifyContent: 'space-between',
                }}
            >
                <div id="content">
                    <div id="main">
                        {appState === AppState.YourInfo ? <YourInfo /> : null}

                        {appState === AppState.Setup ? (
                            <ServiceConfig
                                uri={process.env.REACT_APP_FUNCTION_URI as string}
                                onConfigComplete={(config) => {
                                    setConfig(config);
                                    setAppState(AppState.InteractWithGraph);
                                }}
                            />
                        ) : null}

                        {appState === AppState.InteractWithGraph ? (
                            <AuthenticatedTemplate>
                                <InteractWithGraph
                                    uri={process.env.REACT_APP_FUNCTION_URI as string}
                                    config={config!}
                                    onBack={() => {
                                        changeAppState(appState - 1);
                                    }}
                                />
                            </AuthenticatedTemplate>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
