import React, { PropsWithChildren } from 'react';

interface Props {}

function Paper(
  props: PropsWithChildren<React.DetailsHTMLAttributes<HTMLDivElement>>
) {
  return <div className="relative" {...props} />;
}

export default Paper;
