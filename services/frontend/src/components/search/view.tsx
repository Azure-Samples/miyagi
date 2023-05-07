import { useState, useRef } from 'react';
import { SearchIcon } from '@/components/icons/search';
import { Transition } from '@/components/ui/transition';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useModal } from '@/components/modal-views/context';
import { Close } from '@/components/icons/close';
import { useCallback } from 'react';

type TagProps = {
  label: string;
  link: string;
};

export function Suggestion({ label, link, onClick }: TagProps & { onClick: () => void }) {
  return (
      <AnchorLink
          href={link}
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className="mr-2.5 mt-2.5 inline-flex transform rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium tracking-tighter text-gray-900 shadow-light outline-none transition-transform duration-200 last:mr-0 hover:-translate-y-0.5 hover:bg-gray-50 focus:-translate-y-0.5 focus:bg-gray-50 dark:bg-gray-800 dark:text-white xs:mr-3 xs:mt-3 xs:px-3 xs:py-2 xs:text-sm"
      >
        {label}
      </AnchorLink>
  );
}

type SearchFromProps = {
  placeholder?: string;
};

const suggestions = [
  {
    label: 'Technology companies',
    link: '#',
  },
  {
    label: 'Tax mitigation strategies',
    link: '#',
  },
  {
    label: 'College Fund',
    link: '#',
  },
  {
    label: 'Charities to donate',
    link: '#',
  },
  {
    label: 'Reduce expenses',
    link: '#',
  }
];

export function SearchFrom({ placeholder = 'Semantic Search, powered by Azure Cognitive Search' }: SearchFromProps) {
  const { closeModal } = useModal();
  let [showSuggestion, setShowSuggestion] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => {
    setShowSuggestion(false);
  });

  const [inputValue, setInputValue] = useState('');

  const handleSuggestionClick = useCallback((value: string) => {
    setInputValue(value);
    setShowSuggestion(false);
  }, []);

  return (
    <div className="relative" ref={ref} onFocus={() => setShowSuggestion(true)}>
      <form
        className="relative flex w-full rounded-full"
        noValidate
        role="search"
      >
        <label className="flex w-full items-center">
          <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
            placeholder={placeholder}
            autoComplete="off"
          />
          <span className="pointer-events-none absolute flex h-full w-10 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-white sm:w-14 sm:ltr:pl-3 sm:rtl:pr-3 xl:w-16">
            <SearchIcon className="h-4 w-4" />
          </span>
        </label>
        <div
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white ltr:ml-3.5 rtl:ml-3.5 dark:bg-light-dark xl:hidden"
          onClick={() => closeModal()}
        >
          <Close className="h-auto w-3 text-gray-600 dark:text-white" />
        </div>
      </form>

      <Transition
        show={showSuggestion}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="absolute left-0 top-full mt-3.5 w-full rounded-lg bg-white p-5 shadow-large dark:bg-light-dark xs:mt-4 xs:p-6">
          <h3 className="mb-2 text-sm font-medium tracking-tighter text-gray-900 dark:text-white xs:mb-2.5 xs:text-base">
            Suggestions
          </h3>

          {suggestions.map((tag, index) => (
              <Suggestion
                  key={index}
                  label={tag.label}
                  link={tag.link}
                  onClick={() => handleSuggestionClick(tag.label)}
              />
          ))}
        </div>
      </Transition>
    </div>
  );
}

export default function SearchView({ ...props }) {
  return (
    <div
      className="relative z-50 mx-auto w-full max-w-full xs:w-[480px] sm:w-[600px] lg:w-[900px]"
      {...props}
    >
      <SearchFrom />
    </div>
  );
}
