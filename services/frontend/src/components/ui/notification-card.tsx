import AnchorLink from '@/components/ui/links/anchor-link';

type notificationType = 'investment' | 'expense' | 'savings';
type actor = {
  name: string;
};

export interface NotificationCardProps {
  type: notificationType;
  actor: actor;
  time: string;
  url: string;
  notifier: string;
}

export default function NotificationCard({
  type,
  actor,
  time,
  url,
  notifier,
}: NotificationCardProps) {
  return (
    <AnchorLink
      href={url}
      className="mb-4 flex items-center rounded-lg bg-white p-4 shadow-card transition-all duration-200 last:mb-0 hover:-translate-y-0.5 hover:shadow-large dark:bg-light-dark sm:mb-5 sm:p-5"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
      </div>
      <div className="ltr:ml-3 rtl:mr-3 ltr:sm:ml-4 rtl:sm:mr-4">
        <div className="text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:text-sm">
          <span className="font-medium text-gray-900 ltr:mr-2 rtl:ml-2 dark:text-white">
            @{actor.name}
          </span>
          {type} {notifier}
        </div>
        <div className="mt-1 text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:text-sm">
          {time}
        </div>
      </div>
    </AnchorLink>
  );
}
