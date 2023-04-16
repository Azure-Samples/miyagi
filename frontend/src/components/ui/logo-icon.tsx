import Image from '@/components/ui/image';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import lightLogo from '@/assets/images/logo-icon.svg';
import darkLogo from '@/assets/images/logo-icon-white.png';

const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();

  return (
    <div className="flex cursor-pointer outline-none" {...props}>
      <span className="relative flex overflow-hidden">
        {isMounted && isDarkMode && (
          <Image src={darkLogo} alt="Miyagi" priority width={28} />
        )}
        {isMounted && !isDarkMode && (
          <Image src={lightLogo} alt="Miyagi" priority width={28} />
        )}
      </span>
    </div>
  );
};

export default Logo;
