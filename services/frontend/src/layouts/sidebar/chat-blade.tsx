import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
//images
import Input from "@/components/ui/forms/input";
import {Chats} from "@/data/static/chats";
import ChatMessage from "@/components/chat/chat-message";
import {useAtom} from "jotai";
import {chatsAtom, userInfoAtom} from "@/data/personalize/store";
import { ChatSessionList } from "@/components/chat/chat-session-list";
import Button from "@/components/ui/button";
import React, {useState} from "react";

type Variable = {
    key: string;
    value: string;
};

type ApiResponse = {
    value: string;
    variables: Variable[];
};

export default function Sidebar({ className }: { className?: string }) {
    const [chats, setChatsAtom] = useAtom(chatsAtom);
    const [userInfo] = useAtom(userInfoAtom);

    const [userInput, setUserInput] = useState('');

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
        const response = await fetch('https://9bd77a1b-ebd4-479e-9a43-03dac6567dfe.mock.pstmn.io/skills/ChatSkill/functions/Chat/invoke', {
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

        // Update chatsAtom with the user's message and the response
        setChatsAtom((prevChats) => [
            ...prevChats,
            userInputChat,
            {
                id: data.variables.find((v) => v.key === 'chatId').value,
                content: data.value,
                timestamp: new Date().toISOString(),
                userId: data.variables.find((v) => v.key === 'userId').value,
                userName: data.variables.find((v) => v.key === 'userName').value,
                chatId: userInfo.chatId,
                authorRole: 1,
            },
        ]);

        // Clear the input field
        setUserInput('');
    }


    return (
      <aside
          className={cn(
              'top-0 z-20 h-full w-full max-w-full border-dashed border-slate-200 ltr:left-0 rtl:right-0 dark:border-gray-700 lg:fixed lg:w-80 ltr:lg:border-l rtl:lg:border-r xl:pt-20 3xl:w-[350px]',
              className
          )}
      >

      <div className="my-16 mx-5 flex h-full flex-col justify-between overflow-x-hidden rounded-lg bg-transparent sm:mx-6 sm:flex-row lg:mx-0 lg:flex-col lg:p-4 xl:my-0 2xl:p-4">
          <ChatSessionList className="" />
          <Scrollbar>

            <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
              <div id="messages"
                   className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                  {chats?.map((chat) => (
                      <ChatMessage chat={chat} key={chat?.id} />
                  ))}
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
                <Button variant="ghost" className="mt-2 dark:text-white xs:mt-3 mx-auto">
                    New Chat Session
                </Button>
            </div>
        </div>
      </div>
    </aside>
  );
}
