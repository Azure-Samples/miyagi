// Copyright (c) Microsoft. All rights reserved.

import { useMsal } from '@azure/msal-react';
import { Body1, Button, Image, Title3 } from '@fluentui/react-components';
import { FC } from 'react';
import signInLogo from '../../src/ms-symbollockup_signin_light.svg';

const YourInfo: FC = () => {
    const { instance } = useMsal();
    const loginRequest = {
        scopes: (process.env.REACT_APP_GRAPH_SCOPES as string).split(','),
    };

    return (
        <div style={{ padding: 40, gap: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Button
                style={{ padding: 0 }}
                appearance="transparent"
                onClick={() => instance.loginRedirect(loginRequest)}
            >
                <Image src={signInLogo} />
            </Button>
        </div>
    );
};

export default YourInfo;
