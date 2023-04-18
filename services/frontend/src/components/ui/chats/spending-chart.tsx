import {useState} from 'react';
import {format} from 'date-fns';
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis} from 'recharts';
import {SpendingData} from '@/data/static/spending';

function CustomAxis({ x, y, payload }: any) {
  const date = format(new Date(payload.value * 1000), 'MMM');
  return (
    <g
      transform={`translate(${x},${y})`}
      className="text-xs text-gray-500 md:text-sm"
    >
      <text x={0} y={0} dy={10} textAnchor="end" fill="currentColor">
        {date}
      </text>
    </g>
  );
}


export default function SpendingChart() {
  let [date, setDate] = useState(Date.now());
  let [spending, setSpending] = useState('34,500');
    const formattedDate = format(new Date(date * 1000), 'MMMM d, yyyy');
  return (
    <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
        Spending
      </h3>
      <div className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:text-xl">
        ${spending} / YTD
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {formattedDate}
      </div>
      <div className="mt-5 h-64 sm:mt-8 2xl:h-72 3xl:h-[340px] 4xl:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={SpendingData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(data) => {
              if (data.isTooltipActive) {
                setDate(
                  data.activePayload && data.activePayload[0].payload.date
                );
                setSpending(
                  data.activePayload &&
                    data.activePayload[0].payload.monthlyExpense
                );
              }
            }}
          >
            <defs>
              <linearGradient
                id="spending-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#bc9aff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7645D9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={<CustomAxis />}
              interval={0}
              tickMargin={5}
            />
            <Tooltip content={<></>} cursor={{ stroke: '#7645D9' }} />
            <Area
              type="linear"
              dataKey="monthlyExpense"
              stroke="#7645D9"
              strokeWidth={1.5}
              fill="url(#spending-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
