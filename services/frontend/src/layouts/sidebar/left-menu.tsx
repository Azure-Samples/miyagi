import cn from 'classnames';
import UserCard from '@/components/ui/user-card';
import Logo from '@/components/ui/logo';
import Image from '@/components/ui/image';
import {MenuItem} from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import {useDrawer} from '@/components/drawer-views/context';
import {XMarkIcon} from "@heroicons/react/24/outline";
import {menuItems} from '@/layouts/sidebar/menu_items';
//images
import AuthorImage from '@/assets/images//avatar/user_icon.png';
import ShapeImage from '@/assets/images/workshop-gbb.png';

export default function Sidebar({ className }: { className?: string }) {
  const { closeDrawer } = useDrawer();
  return (
    <aside
      className={cn(
        'top-0 z-40 h-full w-full max-w-full border-dashed border-gray-200 bg-body ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-gray-700 dark:bg-dark xs:w-80 xl:fixed  xl:w-72 2xl:w-80',
        className
      )}
    >
      <div className="relative flex h-24 items-center justify-between overflow-hidden px-6 py-4 2xl:px-8">
        <Logo />
        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <XMarkIcon className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar style={{ height: 'calc(100% - 96px)' }}>
        <div className="px-6 pb-5 2xl:px-8">
          <UserCard
            image={AuthorImage}
            name="John Doe"
            role="user"
          />

          <div className="mt-12">
            {menuItems.map((item, index) => (
              <MenuItem
                key={`retro-left-${index}`}
                name={item.name}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
          <div className="relative mt-20 hidden flex-col rounded-lg bg-gray-200 p-6 dark:bg-[#333E59] lg:flex">
            <div className="-mt-16">
              <Image src={ShapeImage} alt="Shape image" width={200} />
            </div>
            <h2 className="mt-5 mb-7 text-center text-[20px] font-semibold leading-8 text-light-dark dark:text-white">
              Intelligent app workshop
            </h2>
            <button className="h-12 rounded-lg bg-brand text-white">
              Lab Guide {' '}
            </button>
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
