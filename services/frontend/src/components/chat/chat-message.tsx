import Image from '@/components/ui/image';
import miyagilogo from '@/assets/images/logo.png';
import usericon from '@/assets/images/avatar/user_icon.png';
import cn from "classnames";
import {Chats} from "@/data/static/chats";

type ChatProps = {
  id: string;
  authorRole: number;
  content: string;
  timestamp: string;
  userId: string;
  userName: string;
  chatId: string;
};

export default function ChatMessage({ chat }: { chat: ChatProps }) {
  const {
    userName,
    content
  } = chat ?? {};
  return (
      <div className="chat-content">
        <div className={cn('flex items-end ', {
          'justify-end':
              userName !== Chats[0].userName,
        })}>
          <div className={cn('flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 ', {
            'items-end':
                userName !== Chats[0].userName,
            'items-start':
                userName == Chats[0].userName,
          })}>
            <div><span
                className={cn('px-4 py-2 rounded-lg inline-block  ', {
                  'rounded-br-none bg-blue-600 text-white':
                      userName !== Chats[0].userName,
                  'rounded-bl-none bg-gray-300 text-gray-600':
                      userName == Chats[0].userName,
                })}>{content}</span>
            </div>
          </div>
          <Image
              width={10} height={10}
              src={(userName == Chats[0].userName) ? miyagilogo : usericon}
              alt="Actor" className={cn('w-6 h-6 rounded-full  ', {
            'order-2':
                userName !== Chats[0].userName,
            'order-1':
                userName == Chats[0].userName,
          })} />
        </div>
      </div>
  );
}
