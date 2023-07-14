import { useRouter } from 'next/router';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import lightLogo from '@/assets/images/logo.png';
import routes from '@/config/routes';
import { LAYOUT_OPTIONS } from '@/lib/constants';

export default function Logo() {
  const router = useRouter();
  const {
    query: { layout },
  } = router;
  return (
    <AnchorLink
      href={{
        pathname: routes.home,
        ...(layout !== LAYOUT_OPTIONS.MIYAGI &&
          layout !== undefined && {
            query: {
              layout,
            },
          }),
      }}
      className="flex w-18 outline-none sm:w-42 4xl:w-36"
    >
      <span className="relative flex overflow-hidden">
          <Image src={lightLogo} alt="Miyagi" height={44} priority />
          <h1 className="indent-4 text-2xl pt-2 font-extralight">Miyagi</h1>
      </span>

    </AnchorLink>
  );
}
