import React from 'react';

interface SkeletonProps {
  animation?: boolean;
  className?: string;
}

function Skeleton({ className, animation }: SkeletonProps) {
  const classNames = `bg-gray-200 dark:bg-slate-700 w-full h-10 rounded-sm ${className} ${
    animation ? 'animate-pulse' : ''
  }`;

  return <div className={classNames}></div>;
}

export default Skeleton;
