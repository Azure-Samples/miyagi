import cn from 'classnames';
import {useState} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {ArrowLongUpIcon, ArrowUpIcon} from "@heroicons/react/24/outline";
import {assetsDataAtom, loadingPersonalizeAtom} from "@/data/personalize/store";
import {useAtom} from "jotai";
import Skeleton from "@/components/ui/skeleton";

const data = [
    {
        name: 'Stocks',
        value: 400,
        volume: '+12.5%',
        isChangePositive: true,
    },
    {
        name: 'Bonds',
        value: 300,
        volume: '-8.47%',
        isChangePositive: false,
    },
    {
        name: 'Cash',
        value: 300,
        volume: '+5.63%',
        isChangePositive: true,
    },
    {
        name: 'Real Estate',
        value: 15,
        volume: '-3.02%',
        isChangePositive: false,
    },
];

export default function AssetsCard() {
    const [isChangePositive, setChangeStatus] = useState(true);
    const [percentage, setPercentage] = useState(data[0].volume);
    const [assetsData] = useAtom(assetsDataAtom);
    const [loadingPersonalize] = useAtom(loadingPersonalizeAtom);
    return (
        <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
            <h3 className="mb-2 text-base font-medium uppercase">Assets</h3>

            <div className="relative flex h-[290px] justify-center">
                <ResponsiveContainer width={290} height="100%">
                    <PieChart width={290} height={290}>
                        <Pie
                            data={data}
                            cx={140}
                            cy={140}
                            innerRadius={98}
                            outerRadius={135}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            onMouseMove={(data) => {
                                setChangeStatus(
                                    data.payload.payload && data.payload.payload.isChangePositive
                                );
                                setPercentage(
                                    data.payload.payload && data.payload.payload.volume
                                );
                            }}
                        >
                            {assetsData.map((currency) => (
                                <Cell
                                    key={`cell-${currency.code}`}
                                    fill={currency.color}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<></>}/>
                    </PieChart>
                </ResponsiveContainer>
                <div
                    className="absolute left-2/4 top-2/4 flex h-[156px] w-[156px] -translate-x-2/4 -translate-y-2/4 transform items-center justify-center rounded-full border border-dashed border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-900">
          <span
              className={cn(
                  'flex items-center text-base font-medium',
                  isChangePositive ? 'text-green-500' : 'text-red-500'
              )}
          >
            <ArrowLongUpIcon
                className={cn('w-4', {
                    'rotate-180': !isChangePositive,
                })}
            />
              {percentage}
          </span>
                </div>
            </div>

            <div className="mt-2">
                <div className="mb-5 flex items-center justify-between text-sm font-medium text-gray-400">
                    <span>Asset</span>
                    <span>GPT recommendation</span>
                    <span>YTD performance</span>
                </div>
                <ul className="grid gap-5">
                    {assetsData.map((asset) => (
                        <li
                            key={asset.volume}
                            className="grid grid-cols-[150px_repeat(2,1fr)] items-center justify-between text-sm font-medium text-gray-900 dark:text-white 2xl:grid-cols-[140px_repeat(2,1fr)] 3xl:grid-cols-[150px_repeat(2,1fr)]"
                        >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                {asset.icon}
                  {asset.name}
              </span>
                            <span className="text-center">
                              {loadingPersonalize ? (
                                  <Skeleton className="!h-4 !w-full" animation/>
                              ) : (
                                  asset.gptRecommendation
                              )}
                            </span>

                            <span
                                className={cn(
                                    'flex items-center justify-end',
                                    asset.isChangePositive ? 'text-green-500' : 'text-red-500'
                                )}
                            >
                <span
                    className={cn('ltr:mr-2 rtl:ml-2', {
                        'rotate-180': !asset.isChangePositive,
                    })}
                >
                  <ArrowUpIcon/>
                </span>
                                {asset.volume}
              </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
