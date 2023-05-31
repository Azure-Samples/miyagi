import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Input from "@/components/ui/forms/input";
import { Chats } from "@/data/static/chats";
import ChatMessage from "@/components/chat/chat-message";
import { useAtom } from "jotai";
import { chatsAtom, userInfoAtom, chatSessionsAtom } from "@/data/personalize/store";
import { ChatSessionList } from "@/components/chat/chat-session-list";
import Button from "@/components/ui/button";
import React, { useState } from "react";

type Variable = {
    key: string;
    value: string;
};

type ApiResponse = {
    value: string;
    variables: Variable[];
};

type SidebarProps = {
    className?: string;
    setSelectedSession: (session: any) => void;
    setUserInfoAtom: (userInfo: any) => void;
};

export default function Sidebar({ className, setSelectedSession, setUserInfoAtom }: SidebarProps) {
    const [chats, setChatsAtom] = useAtom(chatsAtom);
    const [userInfo] = useAtom(userInfoAtom);
    const [chatSessions, setChatSessionsAtom] = useAtom(chatSessionsAtom);

    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);


    // Handle input change
    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setUserInput(event.currentTarget.value);
    };

    // Handle enter key press
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            submitQuestion().then(r => console.log(r));
        }
    };

    // Function to send a POST request with the user input
    async function submitQuestion() {
        if (!userInput.trim()) return; // avoid empty submissions

        // start loading and clear input
        setTyping(true);
        setUserInput('');

        // Create a chat object for the user's message
        const userInputChat = {
            id: userInfo.chatId + '-' + new Date().toISOString(),
            content: userInput,
            timestamp: new Date().toISOString(),
            userId: userInfo.userId,
            userName: userInfo.userName,
            chatId: userInfo.chatId,
            authorRole: 0,
        };

        // Update chatsAtom with the user's message first
        setChatsAtom((prevChats) => {
            const nextId = prevChats.length + 1;
            return [
                ...prevChats,
                {
                    ...userInputChat,
                    id: `${userInfo.chatId}-${nextId}`,
                },
            ];
        });


        const response = await fetch(`${process.env.NEXT_PUBLIC_COPILOT_CHAT_BASE_URL}/skills/ChatSkill/functions/Chat/invoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: userInput,
                variables: [
                    { key: 'userId', value: userInfo.userId },
                    { key: 'userName', value: userInfo.userName },
                    { key: 'chatId', value: userInfo.chatId },
                ],
            }),
        });

        const data: ApiResponse = await response.json();

        setTyping(false); // stop loading

        // Update chatsAtom with the bot's response
        setChatsAtom((prevChats) => {
            const nextId = prevChats.length + 1;
            return [
                ...prevChats,
                {
                    id: `${userInfo.chatId}-${nextId}`,
                    content: data.value,
                    timestamp: new Date().toISOString(),
                    userId: "bot",
                    userName: "bot",
                    chatId: userInfo.chatId,
                    authorRole: 1,
                },
            ];
        });
    }



    async function createNewChatSession() {
        setLoading(true);
        const response = await fetch(
            "${process.env.COPILOT_CHAT_BASE_URL}/chatSession/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userInfo.userId,
                    title: "New Chat Session",
                }),
            }
        );

        const newChatSession = await response.json();

        // Add the new chat session to the chatSessionsAtom
        setChatSessionsAtom((prevChatSessions: any[]) => [...prevChatSessions, newChatSession]);

        // Set the selectedSession to the new one
        if (typeof setSelectedSession === 'function') {
            setSelectedSession(newChatSession);
        } else {
            console.error('setSelectedSession is not a function', setSelectedSession);
        }

        setLoading(false);
    }



    return (
        <aside
            className={cn(
                'top-0 z-20 h-full w-full max-w-full border-dashed border-slate-200 ltr:left-0 rtl:right-0 dark:border-gray-700 lg:fixed lg:w-80 ltr:lg:border-l rtl:lg:border-r xl:pt-20 3xl:w-[350px]',
                className
            )}
        >

            <div className="my-16 mx-5 flex h-full flex-col justify-between overflow-x-hidden rounded-lg bg-transparent sm:mx-6 sm:flex-row lg:mx-0 lg:flex-col lg:p-4 xl:my-0 2xl:p-4">
                <ChatSessionList className="" setSelectedSession={setSelectedSession} setChatsAtom={setChatsAtom} setUserInfoAtom={setUserInfoAtom} />


                <Scrollbar>

                    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
                        <div id="messages"
                            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                            {chats?.map((chat) => (
                                <ChatMessage chat={chat} key={chat?.id} />
                            ))}
                            {typing && (
                                <div className="animate-pulse flex items-center space-x-2">
                                    <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
                                    <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
                                    <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
                                </div>
                            )}
                        </div>

                    </div>
                </Scrollbar>

                <div className="border-t-2 border-gray-200 pt-4 mb-2 sm:mb-0 ">
                    <div className="relative flex">
                        <span className="absolute inset-y-0 flex items-center dark:bg-dark/60">
                            <button type="button"
                                className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    className="h-6 w-6 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                </svg>
                            </button>
                        </span>
                        <Input
                            type="text"
                            placeholder="Ask Miyagi"
                            className="w-full dark:bg-dark/60 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">

                        </div>

                    </div>
                    <div className="flex-none w-full mt-2 flex justify-center">
                        <Button
                            variant="ghost"
                            className={`mt-2 dark:text-white xs:mt-3 mx-auto ${loading ? "opacity-50" : ""
                                }`}
                            onClick={createNewChatSession}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 inline-block"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l1-1.647z"
                                        ></path>
                                    </svg>
                                    Creating New Chat Session...
                                </>
                            ) : (
                                "New Chat Session"
                            )}
                        </Button>

                    </div>
                </div>
            </div>
        </aside>
    );
}
