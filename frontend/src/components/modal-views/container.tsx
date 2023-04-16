import cn from 'classnames';
import {Fragment, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {Dialog} from '@/components/ui/dialog';
import {Transition} from '@/components/ui/transition';
import Button from '@/components/ui/button';
import {MODAL_VIEW, useModal} from '@/components/modal-views/context';
import {useLayout} from '@/lib/hooks/use-layout';
import {LAYOUT_OPTIONS} from '@/lib/constants';
import {XMarkIcon} from "@heroicons/react/24/outline";
// dynamic imports
const AccountsModal = dynamic(() => import('@/components/accounts/accounts-modal'));
function renderModalContent(view: MODAL_VIEW | string) {
  switch (view) {
    case 'LINK_ACCOUNTS_VIEW':
      return <AccountsModal />;
    default:
      return null;
  }
}

export default function ModalContainer() {
  const router = useRouter();
  const { view, isOpen, closeModal } = useModal();
  const { layout } = useLayout();

  useEffect(() => {
    // close search modal when route change
    router.events.on('routeChangeStart', closeModal);
    return () => {
      router.events.off('routeChangeStart', closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden p-4 text-center sm:p-6 lg:p-8 xl:p-10 3xl:p-12"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 z-40 cursor-pointer bg-gray-700 bg-opacity-60 backdrop-blur" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        {view && view !== 'SEARCH_VIEW' && (
          <span className="inline-block h-full align-middle" aria-hidden="true">
            &#8203;
          </span>
        )}

        {/* This element is need to fix FocusTap headless-ui warning issue */}
        <div className="sr-only">
          <Button
            size="small"
            color="gray"
            shape="circle"
            onClick={closeModal}
            className="opacity-50 hover:opacity-80 "
          >
            <XMarkIcon className="h-auto w-[13px] text-gray-500" />
          </Button>
        </div>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-105"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-105"
        >
          <div
            className={cn(
              'relative z-50 inline-block w-full text-left align-middle',
              layout === LAYOUT_OPTIONS.RETRO ? 'sm:w-auto' : 'xs:w-auto'
            )}
          >
            {view && renderModalContent(view)}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
