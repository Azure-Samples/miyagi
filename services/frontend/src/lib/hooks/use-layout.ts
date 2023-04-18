import { atom, useAtom } from 'jotai';
import { LAYOUT_OPTIONS } from '@/lib/constants';

// 1. set initial atom for miyagi layout
const miyagiLayoutAtom = atom(
  typeof window !== 'undefined'
    ? localStorage.getItem('miyagi-layout')
    : LAYOUT_OPTIONS.MODERN
);

const miyagiLayoutAtomWithPersistence = atom(
  (get) => get(miyagiLayoutAtom),
  (get, set, newStorage: any) => {
      console.log('newStorage', typeof window)
    set(miyagiLayoutAtom, newStorage);
    localStorage.setItem('miyagi-layout', newStorage);
  }
);

// 2. useLayout hook to check which layout is available
export function useLayout() {
  const [layout, setLayout] = useAtom(miyagiLayoutAtomWithPersistence);
  return {
    layout,
    setLayout,
  };
}
