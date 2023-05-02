import type {NextPageWithLayout} from '@/types';
import {NextSeo} from 'next-seo';
import {useRouter} from 'next/router';
import RootLayout from '@/layouts/_root-layout';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import {useIsMounted} from '@/lib/hooks/use-is-mounted';
import {useIsDarkMode} from '@/lib/hooks/use-is-dark-mode';
import ErrorLightImage from '@/assets/images/404-light.svg';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import {LAYOUT_OPTIONS} from '@/lib/constants';

const ErrorPage: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    query: { layout },
  } = router;
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  return (
    <>
      <NextSeo
        title="Miyagi - 404 - WIP"
        description="Hyper-Personalzied Financial Coach"
      />

      <div className="flex max-w-full flex-col items-center justify-center text-center">
        <div className="relative w-52 max-w-full sm:w-[400px] xl:w-[450px] 3xl:w-[500px]">
          {isMounted && !isDarkMode && (
            <Image src={ErrorLightImage} alt="404 Error" fill />
          )}
          {isMounted && isDarkMode && (
            <Image src={ErrorDarkImage} alt="404 Error" fill />
          )}
        </div>

        <h2 className="mt-5 mb-2 text-base font-medium uppercase tracking-wide text-gray-900 dark:text-white sm:mt-10 sm:mb-4 sm:text-xl 3xl:mt-12 3xl:text-2xl">
            🚧Work In Progress🚧
        </h2>
        <p className="mb-4 max-w-full text-xs leading-loose tracking-tight text-gray-600 dark:text-gray-400 sm:mb-6 sm:w-[430px] sm:text-sm sm:leading-loose">
            App Innovation GBB team is still developing this component. Check <a href="https://github.com/Azure-Samples/miyagi#contributing" target="_blank" className="text-blue-600 cursor-pointer underline"> Contribution Guidelines</a> to help us out!
        </p>
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
        >
          <Button shape="rounded">Back to Home</Button>
        </AnchorLink>
      </div>
    </>
  );
};

ErrorPage.getLayout = function getLayout(page) {
  return (
    <RootLayout contentClassName="flex items-center justify-center">
      {page}
    </RootLayout>
  );
};

export default ErrorPage;
