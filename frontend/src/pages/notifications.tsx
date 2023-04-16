import type {NextPageWithLayout} from '@/types';
import {NextSeo} from 'next-seo';
import Button from '@/components/ui/button';
import NotificationCard, {NotificationCardProps,} from '@/components/ui/notification-card';
import RootLayout from '@/layouts/_root-layout';
//images

const notifications = [
  {
    id: 1,
    type: 'investment',
    actor: {
      name: 'user'
    },
    time: 'Just Now',
    url: '#',
    notifier: 'Miyagi',
  },
  {
    id: 2,
    type: 'expense',
    actor: {
      name: 'user'
    },
    time: '10 minutes ago',
    url: '#',
    notifier: 'Jarvis',
  }
];

const NotificationPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Miyagi - Notifications"
        description="Miyagi - Hyper-Personalzied Financial coach"
      />
      <div className="mx-auto w-[660px] max-w-full">
        <div className="mb-7 flex items-center justify-between gap-6">
          <h2 className="text-center text-lg font-medium text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
            Notifications
          </h2>
          <Button
            color="white"
            variant="transparent"
            size="mini"
            shape="rounded"
          >
            <span className="text-xs tracking-tighter">Mark all as read</span>
          </Button>
        </div>

        {notifications.map((notification) => {
          const notificationItem = notification as NotificationCardProps;
          return (
            <NotificationCard key={notification.id} {...notificationItem} />
          );
        })}
      </div>
    </>
  );
};

NotificationPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default NotificationPage;
