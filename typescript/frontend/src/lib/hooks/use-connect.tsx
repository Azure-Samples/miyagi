/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, createContext, ReactNode } from 'react';

const miyiAccountKey = 'MIYAGI_ACCOUNT_CACHE';

export const AccountContext = createContext<any>({});

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [accountInfo, setAccountInfo] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (window) {
          if (localStorage.getItem(miyiAccountKey)) {
            console.log(`miyagi account key ${miyiAccountKey}`)
          }
        } else {
          console.log('window is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accountInfo,
        balance,
        loading,
        error,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
