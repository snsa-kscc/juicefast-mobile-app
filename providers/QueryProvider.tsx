import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { useLoading } from './LoadingProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function QueryLoadingHandler() {
  const isFetching = useIsFetching();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(isFetching > 0);
  }, [isFetching, setLoading]);

  return null;
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryLoadingHandler />
      {children}
    </QueryClientProvider>
  );
}