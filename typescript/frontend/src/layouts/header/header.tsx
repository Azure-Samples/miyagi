import {useRouter} from 'next/router';
import cn from 'classnames';
import LogoIcon from '@/components/ui/logo-icon';
import {useWindowScroll} from '@/lib/hooks/use-window-scroll';
import {BellAlertIcon} from "@heroicons/react/24/outline";
import Hamburger from '@/components/ui/hamburger';
import ActiveLink from '@/components/ui/links/active-link';
import SearchButton from '@/components/search/button';
import {useIsMounted} from '@/lib/hooks/use-is-mounted';
import {useDrawer} from '@/components/drawer-views/context';
import LinkAccounts from '@/components/accounts/link-accounts';
import routes from '@/config/routes';

function NotificationButton() {
  return (
    <ActiveLink href={routes.notification}>
      <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
        <BellAlertIcon className="h-6 w-6 text-gray-500" />
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light dark:bg-slate-50 sm:h-3 sm:w-3" />
      </div>
    </ActiveLink>
  );
}

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-4 sm:gap-6 lg:gap-8">
      <NotificationButton />
      <LinkAccounts />
    </div>
  );
}

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  // @ts-ignore
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full transition-all duration-300 ltr:right-0 rtl:left-0 sm:h-20 3xl:h-24',
        (isMounted && windowScroll.y) > 2
          ? 'bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80'
          : '',
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('DASHBOARD_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          /> <span className="opacity-25">Semantic Search, Powered by Azure Cognitive Search</span>
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
