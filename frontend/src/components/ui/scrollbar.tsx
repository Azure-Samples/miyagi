import cn from 'classnames';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';

interface ScrollbarProps extends OverlayScrollbarsComponentProps {
  style?: React.CSSProperties;
  className?: string;
  autoHide?: 'never' | 'scroll' | 'leave' | 'move';
}

export default function Scrollbar({
  options,
  style,
  className,
  autoHide = 'scroll',
  ...props
}: React.PropsWithChildren<ScrollbarProps>) {
  // @ts-ignore
    return (
    <OverlayScrollbarsComponent
      options={{className: cn('os-theme-thin', className), scrollbars: {
              autoHide: autoHide,
          },...options,
      }}
      style={style}
      {...props}
    />
  );
}
