import {KeyValueDescProp} from "@/types";
import {Fragment, useEffect, useRef, useState} from "react";
import {Listbox} from "@/components/ui/listbox";
import cn from "classnames";
import {ChevronDownIcon, InformationCircleIcon} from "@heroicons/react/24/solid";
import {Transition} from "@/components/ui/transition";
import {BooksList} from "@/data/static/personalize";
import {selectedBookAtom} from "@/data/personalize/store";
import {useAtom} from "jotai";
import {ChevronRightIcon} from "@heroicons/react/24/outline";

export function BookList({
                                  sortData,
                                  className,
                              }: {
    sortData: KeyValueDescProp[];
    className?: string;
}) {

    const [selectedItem, setSelectedBookAtom] = useAtom(selectedBookAtom);

    return (
        <div className="relative w-full lg:w-auto">
            <Listbox value={selectedItem} onChange={setSelectedBookAtom}>
                <Listbox.Button
                    className={cn(
                        'flex h-11 w-full items-center justify-between gap-1 rounded-lg bg-slate-600/80 px-3 text-sm text-white',
                        className
                    )}
                >
                    {selectedItem.description}
                    <ChevronDownIcon className="h-auto w-6"/>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 translate-y-2"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 -translate-y-0"
                    leaveTo="opacity-0 translate-y-2"
                >
                    <Listbox.Options
                        className="absolute z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-lg bg-white p-3 px-1.5 shadow-large shadow-gray-400/10 ltr:right-0 rtl:left-0 dark:bg-[rgba(0,0,0,0.5)] dark:shadow-gray-900 dark:backdrop-blur">
                        {sortData.map((item) => (
                            <Listbox.Option key={item.id} value={item}>
                                {({selected}) => (
                                    <div
                                        className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition dark:text-white  ${
                                            selected
                                                ? 'my-1 bg-gray-100 dark:bg-gray-700'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {item.name}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>
        </div>
    );
}

export function FavoriteBookSelector() {

    const [popoverVisible, setPopoverVisible] = useState(false);
    const buttonRef = useRef(null);
    const popoverRef = useRef(null);

    let timeoutId: number | null = null;

    const handleMouseOver = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        setPopoverVisible(true);
    };

    const handleMouseOut = () => {
        timeoutId = window.setTimeout(() => {
            setPopoverVisible(false);
        }, 500); // 500ms delay
    };

    const openInNewTab = (url: string) => {
        window.open(url, "_blank");
    };

    useEffect(() => {
        return () => {
            // Clear the timeout when the component is unmounted
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (
        <div className="px-6 pt-8">
            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                Favorite Historical Book
                <button
                    ref={buttonRef}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    className="relative ml-1"
                >
                    <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                </button>
            </h4>
            <div
                ref={popoverRef}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                className={`absolute z-10 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 ${popoverVisible ? 'opacity-100' : 'opacity-0 invisible'}`}
            >
                <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Domain specific datasets</h3>
                    <p>This authoritative dataset is stored as embeddings in vector database, which is used to highlight
                        the Retrieval Augmented Generation (RaG) pattern</p>
                    <a onClick={() => openInNewTab("https://iappwksp.com/wksp/05-use-cases/synthesis/")}
                       className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 cursor-pointer">Read
                        more <ChevronRightIcon className="w-4 h-4 ml-1" aria-hidden="true" />
                    </a>
                </div>
                <div></div>
            </div>
            <BookList sortData={BooksList}/>
        </div>
    );
}
