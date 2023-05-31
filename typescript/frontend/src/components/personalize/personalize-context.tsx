import { atom, useAtom } from 'jotai';

const personalizeDrawerAtom = atom(false);
export function usePersonalizeDrawer() {
  const [isPersonalizeOpen, setPersonalizeOpen] = useAtom(personalizeDrawerAtom);
  const openPersonalize = () => setPersonalizeOpen(true);
  const closePersonalize = () => setPersonalizeOpen(false);
  return {
    isPersonalizeOpen,
    openPersonalize,
    closePersonalize,
  };
}
