/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@/components/ui/button";

export default function AccountsModal({ ...props }) {

  return (
    <div
      className="relative z-50 mx-auto w-[440px] max-w-full rounded-lg bg-white px-9 py-16 dark:bg-light-dark"
      {...props}
    >
      <h2 className="mb-4 text-center text-2xl font-medium uppercase text-gray-900 dark:text-white">
        Link Accounts
      </h2>
      <p className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400">
        Link accounts for hyper-personalized experience
      </p>

      <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mx-auto"
      >
        Link Accounts
      </Button>

    </div>
  );
}
