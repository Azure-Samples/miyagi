import Button from "@/components/ui/button";
import {useState} from "react";
import {RadioGroup} from "@/components/ui/radio-group";

export function AccountsList() {
    let [account, setAccount] = useState('banks');
    return (
        <RadioGroup
            value={account}
            onChange={setAccount}
            className="grid grid-cols-2 gap-2 p-5"
        >
            <RadioGroup.Option value="banks">
                {({checked}) => (
                    <span
                        className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
                            checked
                                ? 'border-brand bg-brand/20 text-white shadow-button'
                                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                        }`}
                    >
            Banks
          </span>
                )}
            </RadioGroup.Option>
            <RadioGroup.Option value="brokerage">
                {({checked}) => (
                    <span
                        className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
                            checked
                                ? 'border-brand bg-brand/20 text-white shadow-button'
                                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                        }`}
                    >
            Brokerage
          </span>
                )}
            </RadioGroup.Option>
            <RadioGroup.Option value="expenses">
                {({checked}) => (
                    <span
                        className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
                            checked
                                ? 'border-brand bg-brand/20 text-white shadow-button'
                                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                        }`}
                    >
            Expenses
          </span>
                )}
            </RadioGroup.Option>
            <RadioGroup.Option value="credit">
                {({checked}) => (
                    <span
                        className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
                            checked
                                ? 'border-brand bg-brand/20 text-white shadow-button'
                                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                        }`}
                    >
            Credit Card
          </span>
                )}
            </RadioGroup.Option>
        </RadioGroup>
    );
}

export function LinkAccounts() {

    return (
        <div className="px-6 pt-8">
            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                Accounts (<a
                href="https://github.com/Azure-Samples/miyagi/blob/main/services/user-service/java/src/main/java/com/microsoft/gbb/miyagi/userservice/service/OpenAIGeneratorService.java#L24-L28" target="_blank" className="text-blue-600 cursor-pointer underline">synthetic data w/ GPT</a>)
            </h4>
            <AccountsList/>

            <div className="flex justify-center mt-2">
                <Button
                    size="small"
                    shape="rounded"
                    className="max-w-fit bg-slate-500/80"
                >
                    Link
                </Button>
            </div>
        </div>
    );
}