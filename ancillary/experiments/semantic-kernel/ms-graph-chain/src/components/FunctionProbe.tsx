// Copyright (c) Microsoft. All rights reserved.

import { Body1, Spinner, Title3 } from '@fluentui/react-components';
import { FC, useEffect } from 'react';

interface IData {
    uri: string;
    onFunctionFound: () => void;
}

const FunctionProbe: FC<IData> = ({ uri, onFunctionFound }) => {
    useEffect(() => {
        const fetchAsync = async () => {
            try {
                const result = await fetch(`${uri}/api/ping`);

                if (result.ok) {
                    onFunctionFound();
                }
            } catch {}
        };

        fetchAsync().then(r => r);
    });

    return (
        <div style={{ padding: 80, gap: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            Start Semantic Kernel HTTP Server
        </div>
    );
};

export default FunctionProbe;
