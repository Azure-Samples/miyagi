import dynamic from 'next/dynamic';
import {useLayout} from '@/lib/hooks/use-layout';
import {LAYOUT_OPTIONS} from '@/lib/constants';
import Loader from '@/components/ui/loader';
import {useIsMounted} from '@/lib/hooks/use-is-mounted';
import React from "react";
// dynamic imports
const RetroLayout = dynamic(() => import('@/layouts/_retro'), {
  loading: () => <FallbackLoader />,
});

function FallbackLoader() {
  return (
    <div className="fixed z-50 grid h-full w-full place-content-center">
      <Loader variant="blink" />
    </div>
  );
}

export default function RootLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  const isMounted = useIsMounted();
  const { layout } = useLayout();

  if (!isMounted) return null;

  // render modern layout
  if (layout === LAYOUT_OPTIONS.MODERN) {
    return (
        <RetroLayout contentClassName={contentClassName}>{children}</RetroLayout>
    );
  }

  // render default layout which is retro
  return (
    <RetroLayout contentClassName={contentClassName}>{children}</RetroLayout>
  );
}
