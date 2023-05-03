import {Fragment, useState} from 'react';
import toast from 'react-hot-toast';
import {Dialog} from '@/components/ui/dialog';
import {Transition} from '@/components/ui/transition';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import {Close} from '@/components/icons/close';
import MicrosoftSignInBtn from '@/assets/images/ms-symbollockup_signin_dark.svg';
import Image from "@/components/ui/image";
import {usePersonalizeDrawer} from "@/components/personalize/personalize-context";
import {BingNews} from "@/components/icons/bing";
import {usePersonalize} from "@/hooks/usePersonalize";
import {SubRedditSelector} from "@/components/personalize/selectors/subreddit-list";
import {FavoriteAdvisorSelector} from "@/components/personalize/selectors/fin-advisor-list";
import {RiskTolerance} from "@/components/personalize/selectors/risk-tolerance-list";
import {LinkAccounts} from "@/components/personalize/selectors/link-accounts";
import {useAtom} from "jotai";
import {fetchedDataAtom} from "@/data/personalize/store";


// Component: B2CLogin
function B2CLogin() {

    return (
        <div className="px-6 pt-8 flex flex-col items-center cursor-pointer">
            <Image src={MicrosoftSignInBtn} alt="Login with Microsoft AAD B2C" width={200}/>
        </div>

    );
}

function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
    );
}


export default function PersonalizeDrawer() {
    const { isPersonalizeOpen, closePersonalize } = usePersonalizeDrawer();
    const personalizeMutation = usePersonalize();
    const [, setFetchedData] = useAtom(fetchedDataAtom);
    const [, setLoading] = useState(false);

    const handlePersonalize = async () => {
        setLoading(true);
        try {
            // TODO: Fetch dynamically from atoms
            const requestData = {
                "input": "string",
                "userId": "5966",
                "firstName": "First",
                "lastName": "Last",
                "age": 50,
                "riskLevel": "aggressive",
                "annualHouseholdIncome": 80000,
                "favoriteSubReddit": "finance",
                "favoriteAdvisor": "Jim Cramer",
                "portfolio": [
                    {
                        "name": "Stocks",
                        "allocation": 0.5
                    },
                    {
                        "name": "Bonds",
                        "allocation": 0.3
                    },
                    {
                        "name": "Cash",
                        "allocation": 0.1
                    },
                    {
                        "name": "HomeEquity",
                        "allocation": 0.1
                    }
                ],
                "stocks": [
                    {
                        "symbol": "MSFT",
                        "allocation": 0.3
                    },
                    {
                        "symbol": "ACN",
                        "allocation": 0.1
                    },
                    {
                        "symbol": "JPM",
                        "allocation": 0.3
                    },
                    {
                        "symbol": "PEP",
                        "allocation": 0.3
                    }
                ]
            };
            const response = await personalizeMutation.mutateAsync(requestData);
            console.log('Successfully got personalization');
            console.dir(response);
            toast.success('Personalization successful');

// Extract the relevant data from the response
            const updatedAssetData = response.assets.portfolio.map((item) => ({
                ...item,
                gptRecommendation: item.gptRecommendation,
            }));

            const updatedInvestmentData = response.investments.portfolio.map((item) => ({
                ...item,
                gptRecommendation: item.gptRecommendation,
            }));

// Update the fetched data atoms
            setFetchedAssetData(updatedAssetData);
            setFetchedInvestmentData(updatedInvestmentData);


            closePersonalize();
        } catch (error) {
            console.error('Failed to fetch personalizations');
            console.dir(error);
            toast.error('Failed to fetch personalization');
            closePersonalize();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isPersonalizeOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-40 overflow-hidden"
                onClose={closePersonalize}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-0"/>
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-out duration-300"
                    enterFrom="ltr:translate-x-full rtl:-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in duration-300"
                    leaveFrom="translate-x-0"
                    leaveTo="ltr:translate-x-full rtl:-translate-x-full"
                >
                    <div
                        className="fixed inset-y-0 w-80 max-w-full bg-white/95 shadow-[0_0_80px_rgba(17,24,39,0.2)] backdrop-blur ltr:right-0 rtl:left-0 dark:bg-dark/90">
                        <div className="h-full w-full">
                            <div
                                className="flex h-16 items-center justify-between gap-6 border-b border-dashed border-gray-200 px-6 dark:border-gray-700">
                                <h3 className="text-base font-medium uppercase text-gray-900 dark:text-white">
                                    Personalize
                                </h3>
                                <Button
                                    title="Close"
                                    color="white"
                                    shape="circle"
                                    variant="transparent"
                                    size="small"
                                    onClick={closePersonalize}
                                >
                                    <Close className="h-auto w-2.5"/>
                                </Button>
                            </div>

                            <Scrollbar style={{height: 'calc(100% - 64px)'}}>
                                <div className="pb-8">
                                    <B2CLogin/>
                                    <LinkAccounts/>
                                    <SubRedditSelector/>
                                    <FavoriteAdvisorSelector/>
                                    <RiskTolerance/>

                                    <Button
                                        size="large"
                                        shape="rounded"
                                        fullWidth={true}
                                        className="mx-auto mt-8 text-lg bg-indigo-500"
                                        onClick={handlePersonalize}
                                    >
                                        Personalize
                                    </Button>
                                    <div className="mt-8 mx-auto px-12">
                                        <BingNews className="mt-8"/>
                                        <span>Finance & News Data</span>
                                    </div>
                                </div>
                            </Scrollbar>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
