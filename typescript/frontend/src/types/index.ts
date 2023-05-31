import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type ChatProps = {
  id: string;
  authorRole: number;
  content: string;
  timestamp: string;
  userId: string;
  userName: string;
  chatId: string;
};

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface SearchParamOptions {
  rating: string;
  question: string;

  [key: string]: unknown;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  language?: string;
}

export interface Investments extends QueryOptions {
  id: string;
  name: string;
  symbol: string;
  price: number;
}

export interface GetParams {
  id: string;
  language?: string;
}

export interface GetParamsChat {
  userId: string;
  language?: string;
}

export interface KeyValueListProp {
  id: number;
  name: string;
}

