import {Listbox} from "@headlessui/react";
import cn from "classnames";
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {Fragment, useEffect, useState} from "react";
import {Transition} from "@/components/ui/transition";
import {chatsAtom, chatSessionsAtom, userInfoAtom} from "@/data/personalize/store";
import {useAtom} from "jotai";
import {ChatProps} from "@/types";
import {UserInfoProps} from "@/data/static/user-info";

export function ChatSessionList({ className, setSelectedSession: updateSelectedSession, setChatsAtom: updateChatsAtom, setUserInfoAtom: updateUserInfoAtom }: { className?: string; setSelectedSession: (session: any) => void; setChatsAtom: (chats: ChatProps[]) => void; setUserInfoAtom: (userInfo: UserInfoProps) => void }) {
    const [chatSessions, setChatSessions] = useAtom(chatSessionsAtom);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [userInfo, setUserInfoAtom] = useAtom(userInfoAtom);
    const [, setChatsAtom] = useAtom(chatsAtom);

    useEffect(() => {
        async function fetchChatSessions() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_COPILOT_CHAT_BASE_URL}/chatSession/getAllChats/${userInfo.userName}`);
            const data = await response.json();
            setChatSessions(data);
            console.log("Chat sessions");
            console.dir(chatSessions);
            console.dir(selectedSession);
        }
        fetchChatSessions().then(r => console.log(r));
    }, []);

    async function fetchChatMessages(chatId: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_COPILOT_CHAT_BASE_URL}/chatSession/getChatMessages/${chatId}?startIdx=0&count=-1`);
        const data = await response.json();
        setChatsAtom(data as ChatProps[]);
    }

    // New handler for Listbox onChange event
    async function handleSessionChange(currentSession: any) {
        setSelectedSession(currentSession);
        console.log("Selected current session");
        console.dir(currentSession);
        await fetchChatMessages("4d68fa35-571a-4b6a-ae47-bfe47d28ea5d" || currentSession.id);

        setUserInfoAtom((prevUserInfo: UserInfoProps) => ({ // Add type to prevUserInfo
            ...prevUserInfo,
            chatId: "52247c33-002b-4888-a560-de3f40cdd198" || currentSession.id,
        }));
    }

    return (
        <div className="relative w-full lg:w-auto mt-4">
            <Listbox value={selectedSession} onChange={handleSessionChange}>
                <Listbox.Button
                    className={cn(
                        "flex h-11 w-full items-center justify-between gap-1 rounded-lg bg-slate-600/80 px-3 text-sm text-white",
                        className
                    )}
                >
                    {selectedSession?.name || "Chat history from CosmosDB"}
                    <ChevronDownIcon className="h-auto w-6" />
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 translate-y-2"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 -translate-y-0"
                    leaveTo="opacity-0 translate-y-2"
                >
                    <Listbox.Options
                        className="absolute z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-lg bg-white p-3 px-1.5 shadow-large shadow-gray-400/10 ltr:right-0 rtl:left-0 dark:bg-[rgba(0,0,0,0.5)] dark:shadow-gray-900 dark:backdrop-blur"
                    >
                        {chatSessions.map((chat) => {
                            if (!chat.id) {
                                console.error('Chat id is undefined', chat);
                                return null;
                            }
                            const chatIdParts = chat.id.split("-");
                            const chatLabel = chatIdParts[chatIdParts.length - 1];

                            return (
                                <Listbox.Option
                                    key={chat.id}
                                    value={{ ...chat, name: chatLabel }}
                                >
                                    {({ selected }) => (
                                        <div
                                            className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition dark:text-white  ${
                                                selected
                                                    ? "my-1 bg-gray-100 dark:bg-gray-700"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {chatLabel}
                                        </div>
                                    )}
                                </Listbox.Option>
                            );
                        })}
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </div>
    );
}
