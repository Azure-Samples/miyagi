import cn from 'classnames';
import Sidebar from '@/layouts/sidebar/left-menu';
import SidebarTwo from '@/layouts/sidebar/chat-blade';
import Header from '@/layouts/header/header';
import React from "react";

export default function RetroLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  return (
    <>
      <Header className="ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-[320px] rtl:2xl:pr-[320px] ltr:3xl:pl-80 rtl:3xl:pr-80" />
      <Sidebar className="z-40 hidden xl:block" />
      <main
        className={cn(
          'min-h-[100vh] pt-4 pb-16 sm:pb-20 ltr:lg:pr-80 rtl:lg:pl-80 xl:pb-24 ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80 3xl:pt-0.5 ltr:3xl:pr-[350px] rtl:3xl:pl-[350px]',
          contentClassName
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 3xl:px-10">{children}</div>
      </main>
      <SidebarTwo className="ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto  xl:block" />
    </>
  );
}
