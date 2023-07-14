import React from "react";

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

export default function SqlModal({ isOpen, closeModal }: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {/* TODO: Fetch generated SQL */}
                        <div className="text-center">
                            <h4 className="text-lg leading-6 font-medium text-white" id="modal-title">
                                GPT Generated SQL from prompt:
                            </h4>
                            <div className="mt-2">
                                <p className="text-sm text-gray-300">
                                    &quot;What is the most expensive purchase made by the user in the last year?&quot;
                                </p>
                            </div>
                            <h4 className="text-lg leading-6 font-medium text-white mt-4" id="modal-title">
                                Generated SQL:
                            </h4>
                            <p className="mt-2 mb-1 text-xs font-medium text-white sm:text-sm">
                                SELECT
                                u.user_id,
                                u.first_name,
                                u.last_name,
                                MAX(t.transaction_amount) AS most_expensive_purchase
                                FROM
                                users u
                                JOIN
                                transactions t ON u.user_id = t.user_id
                                WHERE
                                t.transaction_date {'>'}= DATE_TRUNC(&apos;year&apos;, CURRENT_DATE - INTERVAL &apos;1 year&apos;)
                                GROUP BY
                                u.user_id, u.first_name, u.last_name;
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={closeModal} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
