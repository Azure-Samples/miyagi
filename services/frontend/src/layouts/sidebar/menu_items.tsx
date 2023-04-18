import routes from '@/config/routes';
import {ChartBarIcon, FlagIcon, HomeIcon, ReceiptPercentIcon, TagIcon, UserIcon} from "@heroicons/react/24/outline";

export const menuItems = [
  {
    name: 'Home',
    icon: <HomeIcon className="h-6 w-6 text-gray-500" />,
    href: routes.home,
  },
  {
    name: 'Investments',
    icon: <ChartBarIcon className="h-6 w-6 text-gray-500" />,
    href: routes.investments,
  },
  {
    name: 'Goals',
    icon: <FlagIcon className="h-6 w-6 text-gray-500" />,
    href: routes.goals,
  },
  {
    name: 'Bills',
    icon: <ReceiptPercentIcon className="h-6 w-6 text-gray-500" />,
    href: routes.bills,
  },
  {
    name: 'Offers',
    icon: <TagIcon className="h-6 w-6 text-gray-500" />,
    href: routes.offers,
  },
  {
    name: 'Profile',
    icon: <UserIcon className="h-6 w-6 text-gray-500" />,
    href: routes.profile,
  }
];
