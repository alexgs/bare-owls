/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import useSWR from 'swr';
import { Fetcher } from 'swr/dist/types';
import { Session } from 'types';

interface Data {
  payload?: Session;
  status: number;
}

const fetcher: Fetcher<Data> = async (path: string) => {
  const response = await fetch(path);
  if (response.status === 200) {
    const payload = await response.json();
    return {
      payload,
      status: response.status,
    };
  }
  return { status: response.status };
};

export function useSession() {
  const { data, error } = useSWR<Data>('/api/session', fetcher);
  let session = null;
  if (data) {
    session = data.status === 200 ? data.payload : null;
  }
  return {
    session,
    isError: error,
    isLoading: !data && !error,
  };
}
