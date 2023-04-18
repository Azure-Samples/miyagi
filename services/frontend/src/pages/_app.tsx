import type {AppProps} from 'next/app';
import type {NextPageWithLayout} from '@/types';
import Head from 'next/head';
import {ThemeProvider} from 'next-themes';
import {QueryClient, QueryClientProvider} from 'react-query';
import ModalsContainer from '@/components/modal-views/container';
import {AccountProvider} from '@/lib/hooks/use-connect';
import 'overlayscrollbars/overlayscrollbars.css';
// base css file
import 'swiper/css';
import 'swiper/css/pagination';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';
import {useState} from 'react';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  //could remove this if you don't need to page level layout
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <title>Miyagi - Intelligent Financial Coach</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          <AccountProvider>
            {getLayout(<Component {...pageProps} />)}
            <ModalsContainer />
            {/* </div> */}
          </AccountProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
