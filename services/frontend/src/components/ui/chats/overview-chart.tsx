import cn from 'classnames';
import {Line, LineChart, ResponsiveContainer} from 'recharts';
import {useLayout} from '@/lib/hooks/use-layout';
import {LAYOUT_OPTIONS} from '@/lib/constants';

const data = [
  {
    name: 'Page A',
    uv: 1200,
    pv: 1250,
  },
  {
    name: 'Page B',
    uv: 1300,
    pv: 1200,
  },
  {
    name: 'Page C',
    uv: 1450,
    pv: 1000,
  },
  {
    name: 'Page D',
    uv: 1000,
    pv: 1020,
  },
  {
    name: 'Page E',
    uv: 1200,
    pv: 980,
  },
  {
    name: 'Page F',
    uv: 1500,
    pv: 1000,
  },
  {
    name: 'Page G',
    uv: 1200,
    pv: 800,
  },
];

interface Props {
  chartWrapperClass?: string;
}

export default function OverviewChart({ chartWrapperClass }: Props) {
  const { layout } = useLayout();

  return (
    <div
      className={cn(
        'rounded-lg bg-light-dark p-6 text-white shadow-card sm:p-8',
        {
          'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
        }
      )}
    >
      <h3 className="text-xl font-medium tracking-tighter text-white sm:text-blue-600">
        GPT recommends to reduce expenses by 5.2%
      </h3>
      <p className="mt-2 mb-1 text-xs font-medium text-gray-400 sm:text-sm">
        vs. current trend to maintain positive cash flow
      </p>
      <div className={cn('h-60 w-full', chartWrapperClass)}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="natural"
              dataKey="pv"
              stroke="#1E40AF"
              strokeWidth={4}
              dot={false}
            />
            <Line
              type="natural"
              dataKey="uv"
              stroke="#374151"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
