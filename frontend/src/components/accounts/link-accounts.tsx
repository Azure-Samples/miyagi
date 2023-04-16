import cn from 'classnames';
import Button from '@/components/ui/button';
import {useModal} from '@/components/modal-views/context';

export default function LinkAccounts({
  btnClassName}: {
  btnClassName?: string;
  anchorClassName?: string;
}) {
  const { openModal } = useModal();
  return (
    <>
        <Button
          onClick={() => openModal('LINK_ACCOUNTS_VIEW')}
          className={cn('shadow-main hover:shadow-large', btnClassName)}
        >
          Link Accounts
        </Button>
    </>
  );
}
