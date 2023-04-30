import {KeyValueListProp} from "@/types";
import {Fragment, useState} from "react";
import {Listbox} from "@/components/ui/listbox";
import cn from "classnames";
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {Transition} from "@/components/ui/transition";
import {subreddits} from "@/data/static/personalize";

export function SubRedditList({
                                  sortData,
                                  className,
                              }: {
    sortData: KeyValueListProp[];
    className?: string;
}) {
    const [selectedItem, setSelectedItem] = useState(sortData[0]);
    return (
        <div className="relative w-full lg:w-auto">
            <Listbox value={selectedItem} onChange={setSelectedItem}>
                <Listbox.Button
                    className={cn(
                        'flex h-11 w-full items-center justify-between gap-1 rounded-lg bg-slate-600/80 px-3 text-sm text-white',
                        className
                    )}
                >
                    r/{selectedItem.name}
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

export function SubRedditSelector() {

    return (
        <div className="px-6 pt-8">
            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                Favorite Sub-reddit
            </h4>
            <SubRedditList sortData={subreddits}/>
        </div>
    );
}