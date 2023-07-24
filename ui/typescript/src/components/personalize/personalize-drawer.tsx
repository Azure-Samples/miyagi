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
import {FavoriteBookSelector} from "@/components/personalize/selectors/book-list";
import {FavoriteAdvisorSelector} from "@/components/personalize/selectors/fin-advisor-list";
import {RiskTolerance} from "@/components/personalize/selectors/risk-tolerance-list";
import {LinkAccounts} from "@/components/personalize/selectors/link-accounts";
import {useAtom} from "jotai";
import {
    assetsDataAtom,
    investmentsDataAtom,
    loadingPersonalizeAtom,
    selectedAdvisorAtom,
    userInfoAtom
} from "@/data/personalize/store";
import {formatRequestData} from "@/data/utils/format-request-data";
import {ReasoningEngine} from "@/components/personalize/selectors/reasoning-engine-list";


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
    const [, setFetchedData] = useAtom(investmentsDataAtom);
    const [loadingPersonalize, setLoadingPersonalizeAtom] = useAtom(loadingPersonalizeAtom);

    const [userInfo] = useAtom(userInfoAtom);
    const [investmentsInfo, setInvestmentsDataAtom] = useAtom(investmentsDataAtom);
    const [assetsInfo, setAssetsDataAtom] = useAtom(assetsDataAtom);

    const handlePersonalize = async () => {
        setLoadingPersonalizeAtom(true);
        try {
            // Format data from assetsInfo and investmentsInfo
            const { portfolio, stocks } = formatRequestData(assetsInfo, investmentsInfo);

            // Fetch data from atoms
            const requestData = {
                userInfo,
                portfolio,
                stocks,
            };

            const response = await personalizeMutation.mutateAsync(requestData);
            console.log('Successfully got personalization');
            console.dir(response);
            toast.success('Personalization successful');

            // Extract the relevant data from the response
            const updatedAssetData = response.assets.portfolio.map((item, index) => ({
                ...assetsInfo[index],
                gptRecommendation: item.gptRecommendation,
            }));

            const updatedInvestmentData = response.investments.portfolio.map((item, index) => ({
                ...investmentsInfo[index],
                gptRecommendation: item.gptRecommendation,
            }));

            // Update the fetched data atoms
            setAssetsDataAtom(updatedAssetData);
            setInvestmentsDataAtom(updatedInvestmentData);

            closePersonalize();
        } catch (error) {
            console.error('Failed to fetch personalizations');
            console.dir(error);
            toast.error('Failed to fetch personalization');
            closePersonalize();
        } finally {
            setLoadingPersonalizeAtom(false);
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
                                    <FavoriteBookSelector/>
                                    <FavoriteAdvisorSelector/>
                                    <RiskTolerance/>
                                    <ReasoningEngine/>

                                    <Button
                                        size="large"
                                        shape="rounded"
                                        fullWidth={true}
                                        className={`mx-auto mt-8 text-lg bg-indigo-500 ${loadingPersonalize ? 'opacity-50' : ''}`}
                                        onClick={handlePersonalize}
                                        disabled={loadingPersonalize}
                                    >
                                        {loadingPersonalize ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 mr-3 inline-block"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l1-1.647z"
                                                    ></path>
                                                </svg>
                                                Semantic Kernel processing w/ AZ OpenAI...
                                            </>
                                        ) : (
                                            'Personalize'
                                        )}
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
