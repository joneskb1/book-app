import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function useBooklist(filter, sort) {
  let url = `/api/v1/users/books`;
  if (filter != null || sort != null) {
    url += `?filterBy=${filter}&sort=${sort}`;
  }

  const { data, error, isLoading, isValidating } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
}
