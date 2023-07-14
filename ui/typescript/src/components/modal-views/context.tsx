import { atom, useAtom } from 'jotai';

export type MODAL_VIEW =
  | 'SEARCH_VIEW'
  | 'NOTIFICATIONS_VIEW';

interface ModalTypes {
  isOpen: boolean;
  view: MODAL_VIEW;
  data: any;
}

const modalAtom = atom<ModalTypes>({
  isOpen: false,
  view: 'SEARCH_VIEW',
  data: null,
});

export function useModal() {
  const [state, setState] = useAtom(modalAtom);
  const openModal = (view: MODAL_VIEW, data?: any) =>
    setState({ ...state, isOpen: true, view, data });
  const closeModal = () => setState({ ...state, isOpen: false });

  return {
    ...state,
    openModal,
    closeModal,
  };
}
