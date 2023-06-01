import useSWR from 'swr';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useBooklist(filter, sort) {
  const { isLoggedIn } = useContext(AuthContext);

  const fetcher = (url) => {
    if (isLoggedIn) {
      return axios.get(url).then((res) => res.data);
    } else {
      return null;
    }
  };

  let url = `/api/v1/users/books`;
  if (filter != null || sort != null) {
    url += `?filterBy=${filter}&sort=${sort}`;
  }

  const { data, error, isLoading, isValidating } = useSWR(url, fetcher, {
    revalidateOnMount: true,
    shouldRetryOnError: () => false,
    key: isLoggedIn !== true ? null : `${url}`,
  });

  // const fetchData = async () => {
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   console.log(data);
  //   return data;
  // };

  // const data = await fetchData();

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
}
