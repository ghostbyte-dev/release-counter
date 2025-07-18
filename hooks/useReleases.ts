import type { Release } from '@/types/release';
import { useQuery } from '@tanstack/react-query';

export default function useReleases(
  user: string,
  repository: string,
): [Release[] | undefined, boolean, boolean] {
  const {
    data: releases,
    isPending: isReleasesPending,
    isError: isReleasesError,
  } = useQuery({
    queryFn: () => fetchReleases(user, repository),
    queryKey: ['releases', user, repository],
  });

  return [releases, isReleasesPending, isReleasesError];
}

export const fetchReleases = async (
  user: string,
  repository: string,
  page = 0,
): Promise<Release[]> => {
  const response = await fetch(`/api/releases?user=${user}&repo=${repository}&page=${page}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const releases: Release[] = await response.json();

  let latestAlreadyUsed = false;
  const modifiedReleases = releases.map((release: Release) => {
    if (release.draft || release.prerelease) {
      release.latest = false;
      return release;
    }
    release.latest = !latestAlreadyUsed;
    latestAlreadyUsed = true;
    return release;
  });

  return modifiedReleases;
};
