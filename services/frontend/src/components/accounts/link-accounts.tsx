import cn from 'classnames';
import Button from '@/components/ui/button';
import {useModal} from '@/components/modal-views/context';
import {usePersonalizeDrawer} from "@/components/personalize/personalize-context";

export default function LinkAccounts({
  btnClassName}: {
  btnClassName?: string;
  anchorClassName?: string;
}) {
    const { openPersonalize } = usePersonalizeDrawer();
  return (
    <>
        <Button
          onClick={openPersonalize}
          className={cn('shadow-main hover:shadow-large', btnClassName)}
        >
          Personalize
        </Button>
    </>
  );
}
