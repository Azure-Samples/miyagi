import {format} from "date-fns";

export default function CustomAxis({ x, y, payload }: any) {
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
