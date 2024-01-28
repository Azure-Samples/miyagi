import * as vscode from 'vscode';

const REFACTOR_COMMAND_ID = 'miyagi.modernize';

interface IMiyagiChatAgentResult extends vscode.ChatAgentResult2 {
	subCommand: string;
}

export function activate(context: vscode.ExtensionContext) {

    // Define a Miyagi chat agent handler. 
    const handler: vscode.ChatAgentHandler = async (request: vscode.ChatAgentRequest, context: vscode.ChatAgentContext, progress: vscode.Progress<vscode.ChatAgentProgress>, token: vscode.CancellationToken): Promise<IMiyagiChatAgentResult> => {
        // To talk to an LLM in your subcommand handler implementation, your
        // extension can use VS Code's `requestChatAccess` API to access the Copilot API.
        // The GitHub Copilot Chat extension implements this provider.
        if (request.subCommand == 'refactor') {
            const access = await vscode.chat.requestChatAccess('copilot');
			const topics = ['linked list', 'recursion', 'stack', 'queue', 'pointers'];
			const topic = topics[Math.floor(Math.random() * topics.length)];
            const messages = [
                {
                    role: vscode.ChatMessageRole.System,
					content: 'You are a code modernization expert. You take existing legacy code and modernize it. Reply with a latest and greatest code snippet that is a modernized version of the legacy code snippet.'
                },
                {
                    role: vscode.ChatMessageRole.User,
                    content: topic
                },
            ];
            const chatRequest = access.makeRequest(messages, {}, token);
            for await (const fragment of chatRequest.response) {
                progress.report({ content: fragment });
            }
			return { subCommand: 'refactor' };
        } else if (request.subCommand == 'troubleshoot') {
            const access = await vscode.chat.requestChatAccess('copilot');
            const messages = [
                {
                    role: vscode.ChatMessageRole.System,
					content: 'You are a troubleshooting and code debugging expert. You take existing code and debug it. Reply with a potential fix for the error.'
                },
                {
                    role: vscode.ChatMessageRole.User,
                    content: request.prompt
                }
            ];
            const chatRequest = access.makeRequest(messages, {}, token);
            for await (const fragment of chatRequest.response) {
                progress.report({ content: fragment });
            }
			return { subCommand: 'troubleshoot' };
        } else {
			const access = await vscode.chat.requestChatAccess('copilot');
			const messages = [
				{
					role: vscode.ChatMessageRole.System,
					content: 'You are a modernization expert. Reply with a latest and greatest code snippet that is a modernized version of the legacy code snippet.'
				},
				{
					role: vscode.ChatMessageRole.User,
					content: request.prompt
				}
			];
			const chatRequest = access.makeRequest(messages, {}, token);
			for await (const fragment of chatRequest.response) {
				progress.report({ content: fragment });
			}
			
			return { subCommand: '' };
		}
    };
    
    // Agents appear as top-level options in the chat input
    // when you type `@`, and can contribute sub-commands in the chat input
    // that appear when you type `/`.
    const agent = vscode.chat.createChatAgent('miyagi', handler);
    agent.iconPath = vscode.Uri.joinPath(context.extensionUri, 'miyagi.jpg');
    agent.description = vscode.l10n.t('Refactor! What can I help you with?');
	agent.fullName = vscode.l10n.t('Miyagi');
    agent.subCommandProvider = {
        provideSubCommands(token) {
            return [
                { name: 'refactor', description: 'Convert code from legacy to latest' },
                { name: 'troubleshoot', description: 'Troubleshoot and find problem resolutions' }
            ];
        }
    };

    agent.followupProvider = {
		provideFollowups(result: IMiyagiChatAgentResult, token: vscode.CancellationToken) {
            if (result.subCommand === 'refactor') {
                return [{
                    commandId: REFACTOR_COMMAND_ID,
                    message: '@miyagi updated it',
                    title: vscode.l10n.t('Help Miyagi modernize it!')
                }];
            } else if (result.subCommand === 'troubleshoot') {
                return [{
                    message: '@miyagi fixed it',
                    title: vscode.l10n.t('Help Miyagi fix it!')
                }];
            }
        }
    };

    context.subscriptions.push(
        agent,
        // Register the command handler for the /refactor followup
        vscode.commands.registerCommand(REFACTOR_COMMAND_ID, async () => {
            vscode.window.showInformationMessage('Refactor!');
        }),
    );
}

export function deactivate() { }
