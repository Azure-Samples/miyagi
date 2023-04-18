/* eslint-disable import/no-anonymous-default-export */
import {API_ENDPOINTS} from '@/data/utils/endpoints';
import type {GetParams, Investments,} from '@/types';
import {HttpClient} from '@/data/utils/client';

class client {

  investments = {
    get: ({ id }: GetParams) =>
      HttpClient.get<Investments>(
        `${API_ENDPOINTS.INVESTMENTS}/${id}`
      ),
  };
}

export default new client();
