import cn from 'classnames';
import {NextSeo} from 'next-seo';
import OverviewChart from '@/components/ui/chats/overview-chart';
import SpendingChart from '@/components/ui/chats/spending-chart';
import TransactionTable from '@/components/transaction/transaction-table';
import TopInvestmentsTable from '@/components/top-investments/investments-table';

//images
import AssetsCard from "@/components/ui/assets-card";

export default function ModernScreen() {
  return (
    <>
      <NextSeo
        title="Miyagi"
        description="Miyagi - Hyper-personalized Financial Coach"
      />

      <div className="mt-2 grid gap-4 sm:my-2 md:grid-cols-2">
        <AssetsCard />
        <SpendingChart />
      </div>

      <div className="my-8 sm:my-10">
        <TopInvestmentsTable />
      </div>

      <div className="flex flex-wrap">
        <div
          className={cn(
            'w-full lg:w-[calc(100%-288px)] ltr:lg:pr-6 rtl:lg:pl-6 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)]'
          )}
        >
          <TransactionTable />
        </div>
        <div
          className={cn(
            'order-first mb-8 grid w-full grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 lg:order-1 lg:mb-0 lg:flex lg:w-72 lg:flex-col 2xl:w-80 3xl:w-[358px]'
          )}
        >
          <OverviewChart />
        </div>
      </div>
    </>
  );
}
