/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef} from 'react';
import cn from 'classnames';

interface ButtonDripTypes {
  x: number;
  y: number;
  color: string;
  fullWidth?: boolean;
  onCompleted: () => void;
}

export default function ButtonDrip({
  x = 0,
  y = 0,
  color,
  fullWidth,
  onCompleted,
}: ButtonDripTypes) {
  const dripRef = useRef<HTMLDivElement>(null);
  let top = Number.isNaN(+y) ? 0 : y - 10;
  let left = Number.isNaN(+x) ? 0 : x - 10;
  useEffect(() => {
    if (!dripRef.current) return;
    dripRef.current.addEventListener('animationend', onCompleted);
    return () => {
      if (!dripRef.current) return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dripRef.current.removeEventListener('animationend', onCompleted);
    };
  });
  return (
    <span ref={dripRef} className="drip absolute inset-0 block">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className={cn(
          'absolute h-4 w-4',
          fullWidth ? 'animate-drip-expand-large' : 'animate-drip-expand'
        )}
        style={{ top, left }}
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g fill={color}>
            <rect width="100%" height="100%" rx="10" />
          </g>
        </g>
      </svg>
    </span>
  );
}

ButtonDrip.displayName = 'ButtonDrip';
