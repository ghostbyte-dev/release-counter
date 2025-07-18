import type { repository } from '@/types/repository';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useRepository(
  user: string,
  repositoryName: string,
): [repository | undefined, boolean, boolean] {
  const {
    data: repository,
    isPending: isRepositoryPending,
    isError: isRepositoryError,
  } = useQuery({
    queryFn: () => fetchRepository(user, repositoryName),
    queryKey: ['repository', user, repositoryName],
  });

  return [repository, isRepositoryPending, isRepositoryError];
}

export const fetchRepository = async (user: string, repository: string): Promise<repository> => {
  const response = await fetch(`/api/repository?user=${user}&repo=${repository}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
