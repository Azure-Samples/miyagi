import Button from '@/components/ui/button';
import {useModal} from '@/components/modal-views/context';
import {SearchIcon} from "@/components/icons/search";

export default function SearchButton({ ...props }) {
  const { openModal } = useModal();
  return (
    <Button
      shape="circle"
      aria-label="Search"
      onClick={() => openModal('SEARCH_VIEW')}
      {...props}
    >
      <SearchIcon className="h-auto w-3.5 sm:w-auto" />
    </Button>
  );
}
