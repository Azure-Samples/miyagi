// Copyright (c) Microsoft. All rights reserved.

import { Body1, Button, Image, Textarea, Title3 } from '@fluentui/react-components';
import React, { FC } from 'react';
import wordLogo from '../../src/word.png';
import { useSemanticKernel } from '../hooks/useSemanticKernel';
import { IKeyConfig } from '../model/KeyConfig';
import InteractionButton from './InteractionButton';

interface IData {
    uri: string;
    config: IKeyConfig;
    onBack: () => void;
}

const InteractWithGraph: FC<IData> = ({ uri, config, onBack }) => {
    const sk = useSemanticKernel(uri);
    const defaultText = `Financial advisers are often asked to help clients with their estate planning. This can be a complex area, and it is important to understand the client's goals and objectives before making any recommendations. This article will provide an overview of the estate planning process, and will also discuss some of the key issues that advisers should consider when working with clients on their estate planning needs.`;
    const filename = 'FinancialAdvise.docx';
    const path = '%temp%\\' + filename;
    const destinationPath = '/' + filename;

    const [text, setText] = React.useState(defaultText);

    const runTask1 = async () => {
        try {
            //get summary
            var summary = await sk.invokeAsync(config, { value: text }, 'summarizeskill', 'summarize');

            //write document
            await sk.invokeAsync(
                config,
                {
                    value: summary.value,
                    inputs: [{ key: 'filePath', value: path }],
                },
                'documentskill',
                'appendtextasync',
            );

            //upload to onedrive
            await sk.invokeAsync(
                config,
                {
                    value: path,
                    inputs: [{ key: 'destinationPath', value: destinationPath }],
                },
                'clouddriveskill',
                'uploadfileasync',
            );
        } catch (e) {
            alert('Something went wrong.\n\nDetails:\n' + e);
        }
    };

    const runTask2 = async () => {
        try {
            var shareLink = await sk.invokeAsync(
                config,
                { value: destinationPath },
                'clouddriveskill',
                'createlinkasync',
            );
            var myEmail = await sk.invokeAsync(config, { value: '' }, 'emailskill', 'getmyemailaddressasync');

            await sk.invokeAsync(
                config,
                {
                    value: `Here's the link: ${shareLink.value}\n\nReminder: Please delete the document on your OneDrive after you finish with this sample app.`,
                    inputs: [
                        {
                            key: 'recipients',
                            value: myEmail.value,
                        },
                        {
                            key: 'subject',
                            value: 'Miyagi Document Link',
                        },
                    ],
                },
                'emailskill',
                'sendemailasync',
            );
        } catch (e) {
            alert('Something went wrong.\n\nDetails:\n' + e);
        }
    };

    const runTask3 = async () => {
        try {
            var reminderDate = new Date();
            reminderDate.setDate(reminderDate.getDate() + 3);

            await sk.invokeAsync(
                config,
                {
                    value: 'Remind me to follow up re the authentication sample email',
                    inputs: [
                        {
                            key: 'reminder',
                            value: reminderDate.toISOString(),
                        },
                    ],
                },
                'tasklistskill',
                'addtaskasync',
            );
        } catch (e) {
            alert('Something went wrong.\n\nDetails:\n' + e);
        }
    };

    return (
        <div style={{ padding: 40, gap: 10, display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
            <Title3>Interact via MS Graph</Title3>
            <Body1>
                Miyagi interacts with MS services on behalf of the user by using skills and functions in Semantic Kernel.
                The user's intent is all that is needed to invoke the right skill and function.
                The user's data is passed to the skill and function as input. The skill and function then perform the necessary operations and return the result to the user.
            </Body1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 30 }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 7.25, alignItems: 'left' }}>
                    <Image src={wordLogo} width={24} />
                    <Body1>Sample Doc: {filename}</Body1>
                </div>

                <Textarea
                    appearance="filled-lighter-shadow"
                    textarea={{ style: { height: 306 } }}
                    style={{ maxWidth: 761 }}
                    resize="vertical"
                    value={text}
                    onChange={(e, d) => setText(d.value)}
                />
                <InteractionButton
                    taskDescription="Summarize the above into a new Word Document and save it on OneDrive"
                    runTask={runTask1}
                />

                <InteractionButton
                    taskDescription="Get a shareable link and email the link to myself"
                    runTask={runTask2}
                />
                <InteractionButton
                    taskDescription="Add a reminder to follow-up with the email sent above"
                    runTask={runTask3}
                />
            </div>
            <br />
            <Button style={{ width: 54 }} appearance="secondary" onClick={() => onBack()}>
                Back
            </Button>
        </div>
    );
};

export default InteractWithGraph;
