import {MiyagiContext, PersonalizeResponse} from '@/data/utils/types';
import client from '@/data/utils';
import {useMutation, UseMutationOptions} from 'react-query';

export function usePersonalize(
  options?: UseMutationOptions<PersonalizeResponse, Error, MiyagiContext>
) {
  const mutation = useMutation<PersonalizeResponse, Error, MiyagiContext>(
    (requestData) => client.personalize({ ...requestData }),
    options
  );

  return mutation;
}
