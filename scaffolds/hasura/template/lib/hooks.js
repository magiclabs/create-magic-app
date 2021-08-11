import useSWR from 'swr';

const fetchUser = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

export function useUser() {
  const { data, error } = useSWR('/api/user', fetchUser);
  return !data && !error ? { loading: true } : data && data?.user;
}
