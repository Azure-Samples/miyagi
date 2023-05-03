import Image from '@/components/ui/image';
import miyagilogo from '@/assets/images/logo.png';
import usericon from '@/assets/images/avatar/user_icon.png';
import cn from "classnames";
import {Chats} from "@/data/static/chats";

type ChatProps = {
  id: number;
  actor: string;
  message: string;
  timestamp: string;
  config: object;
};

export default function ChatMessage({ chat }: { chat: ChatProps }) {
  const {
    actor,
    message
  } = chat ?? {};
  return (
      <div className="chat-message">
        <div className={cn('flex items-end ', {
          'justify-end':
              actor !== Chats[0].actor,
        })}>
          <div className={cn('flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 ', {
            'items-end':
                actor !== Chats[0].actor,
            'items-start':
                actor == Chats[0].actor,
          })}>
            <div><span
                className={cn('px-4 py-2 rounded-lg inline-block  ', {
                  'rounded-br-none bg-blue-600 text-white':
                      actor !== Chats[0].actor,
                  'rounded-bl-none bg-gray-300 text-gray-600':
                      actor == Chats[0].actor,
                })}>{message}</span>
            </div>
          </div>
          <Image
              width={10} height={10}
              src={(actor == Chats[0].actor) ? miyagilogo : usericon}
              alt="Actor" className={cn('w-6 h-6 rounded-full  ', {
            'order-2':
                actor !== Chats[0].actor,
            'order-1':
                actor == Chats[0].actor,
          })} />
        </div>
      </div>
  );
}
