import {BanknotesIcon, ChartBarSquareIcon, CurrencyDollarIcon, HomeModernIcon} from "@heroicons/react/24/outline";

export const AssetsData = [
  {
    icon: <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />,
    name: 'Stocks',
    gptRecommendation: 'Buy',
    code: 'stocks',
    volume: '+12.5%',
    color: '#F79517',
    isChangePositive: true,
  },
  {
    icon: <BanknotesIcon className="h-6 w-6 text-gray-500" />,
    name: 'Bonds',
    gptRecommendation: 'Sell',
    code: 'bonds',
    volume: '-8.47%',
    color: '#259C77',
    isChangePositive: false,
  },
  {
    icon: <CurrencyDollarIcon className="h-6 w-6 text-gray-500" />,
    name: 'Cash',
    gptRecommendation: 'Hold',
    code: '$',
    volume: '+5.63%',
    color: '#3468D1',
    isChangePositive: true,
  },
  {
    icon: <HomeModernIcon className="h-6 w-6 text-gray-500" />,
    name: 'Home Equity',
    gptRecommendation: 'Buy',
    code: 'real-estate',
    volume: '-3.02%',
    color: '#F3BA2F',
    isChangePositive: false,
  },
];
