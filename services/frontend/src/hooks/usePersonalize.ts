import { PersonalizeRequestData, PersonalizeResponse } from '@/data/utils/types';
import client from '@/data/utils';
import { useMutation, UseMutationOptions } from 'react-query';

export function usePersonalize(
  options?: UseMutationOptions<PersonalizeResponse, Error, PersonalizeRequestData>
) {
  const mutation = useMutation<PersonalizeResponse, Error, PersonalizeRequestData>(
    (requestData) => client.personalize({ ...requestData }),
    options
  );

  return mutation;
}
