import { atom, useAtom } from 'jotai';

export type MODAL_VIEW =
  | 'SEARCH_VIEW'
  | 'SHARE_VIEW'
  | 'LINK_ACCOUNTS_VIEW'
  | 'PROFILE_INFO_VIEW'
  | 'FOLLOWING_VIEW'
  | 'FOLLOWERS_VIEW'
  | 'NFT_PREVIEW';

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
