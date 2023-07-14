import type {LinkProps} from 'next/link';
import {useRouter} from 'next/router';
import cn from 'classnames';
import AnchorLink from '@/components/ui/links/anchor-link';

interface ActiveLinkProps extends LinkProps {
  activeClassName?: string;
}
const ActiveLink: React.FC<
  ActiveLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ href, className, activeClassName = 'active', ...props }) => {
  const { pathname } = useRouter();
  const _href = typeof href === 'object' ? href.pathname : href;
  return (
    <AnchorLink
      href={href}
      className={cn(className, {
        [activeClassName]: pathname === _href,
      })}
      {...props}
    />
  );
};

export default ActiveLink;
