/* eslint-disable import/no-anonymous-default-export */
import {API_ENDPOINTS} from '@/data/utils/endpoints';
import type {GetParams, Investments,} from '@/types';
import {HttpClient} from '@/data/utils/client';
import {MiyagiContext, PersonalizeResponse} from "@/data/utils/types";

class client {


  personalize = async (requestData: MiyagiContext): Promise<PersonalizeResponse> => {
    const response = await HttpClient.post<PersonalizeResponse>(`${API_ENDPOINTS.PERSONALIZE}`, requestData);
    return response;
  };

  investments = {
    get: ({ id }: GetParams) =>
      HttpClient.get<Investments>(
        `${API_ENDPOINTS.INVESTMENTS}/${id}`
      ),
  };
}

export default new client();
