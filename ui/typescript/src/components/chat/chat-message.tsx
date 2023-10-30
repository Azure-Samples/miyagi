import Image from '@/components/ui/image';
import miyagilogo from '@/assets/images/logo.png';
import usericon from '@/assets/images/avatar/user_icon.png';
import cn from "classnames";
import {Chats} from "@/data/static/chats";
import {ChatProps} from "@/types";



export default function ChatMessage({ chat }: { chat: ChatProps }) {
  const {
    authorRole,
    content
  } = chat ?? {};

  return (
      <div className="chat-content">
        <div className={cn('flex items-end ', {
          'justify-end':
              authorRole !== Chats[0].authorRole,
        })}>
          <div className={cn('flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 ', {
            'items-end':
                authorRole !== Chats[0].authorRole,
            'items-start':
                authorRole === Chats[0].authorRole,
          })}>
            <div><span
                className={cn('px-4 py-2 rounded-lg inline-block  ', {
                  'rounded-br-none bg-blue-600 text-white':
                      authorRole !== Chats[0].authorRole,
                  'rounded-bl-none bg-gray-300 text-gray-600':
                      authorRole === Chats[0].authorRole,
                })}>{content}</span>
            </div>
          </div>
          <Image
              width={10} height={10}
              src={(authorRole == Chats[0].authorRole) ? miyagilogo : usericon}
              alt="Actor" className={cn('w-6 h-6 rounded-full  ', {
            'order-2':
                authorRole !== Chats[0].authorRole,
            'order-1':
                authorRole === Chats[0].authorRole,
          })} />
        </div>
      </div>
  );
}
