'use client';

import { useRepository } from '@/hooks/useRepository';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  BookOpenIcon,
  EyeIcon,
  GitForkIcon,
  LinkIcon,
  PulseIcon,
  ScalesIcon,
  StarIcon,
} from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import type { Release } from '@/types/release';
import ReleaseCard from '@/components/releaseCard';
import { formatLargeNumber } from '@/common/formatLargeNumber';
import { useEffect, useState } from 'react';
import { getReleasesDownloadsCount } from '@/common/getReleasesDownloadsCount';
import Link from 'next/link';
import LoadingIndicator from '@/components/loadingIndicator';
import useReleasesInfinite from '@/hooks/useReleasesInfinite';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import type { Metadata } from 'next/types';

const MyChart = dynamic(() => import('../../../components/releasesChart'), {
  ssr: false,
});

const MyStargazersChart = dynamic(() => import('../../../components/stargazersChart'), {
  ssr: false,
});

export default function RepositoryDetails() {
  const params = useParams();
  const user = params.user as string;
  const repositoryName = params.repository as string;
  const { ref, inView } = useInView();
  const [isDownloadChart, setIsDownloadChart] = useState<boolean>(true);
  const {
    data: releases,
    isPending: isReleasesPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReleasesInfinite(user, repositoryName);

  const [repository, isRepositoryPending] = useRepository(user, repositoryName);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    document.title = `${user}/${repositoryName} - Github Release Stats`;
  }, [user, repositoryName]);

  useEffect(() => {
    if (releases && releases.pages[0].length === 0) {
      setIsDownloadChart(false);
    }
  }, [releases]);

  const pagesToReleaseArray = () => {
    const releaseArrayEmpty: Release[] = [];
    const pages = releases?.pages;
    if (pages) {
      return releaseArrayEmpty.concat(...pages);
    }
    return [];
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col p-4 lg:p-8 w-full md:w-[90%]">
        <div>
          {repository ? (
            <div className="flex flex-row gap-4 items-center">
              <Image
                src={repository.owner.avatar_url}
                height={48}
                width={48}
                alt={'Avatar'}
                className="rounded-full h-12 w-12 aspect-square"
              />
              <h1 className="text-2xl font-medium">
                <Link
                  href={repository.owner.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repository.owner.login}
                </Link>{' '}
                <span className="text-gray-300 font-extralight">/</span>{' '}
                <Link
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span className="font-semibold">{repository.name}</span>
                </Link>
              </h1>
            </div>
          ) : isRepositoryPending ? (
            <LoadingIndicator />
          ) : (
            <>an error occured</>
          )}
        </div>
        <div className="flex flex-wrap-reverse flex-row mt-10 gap-y-4">
          <div className="flex-2/3 card p-0">
            <div className="bg-bg-secondary py-2 px-2 rounded-md flex justify-between items-center">
              <div className="border-border border-1 w-min flex rounded-md gap-1 bg-switch-inactive">
                <button
                  type="button"
                  onClick={() => setIsDownloadChart(true)}
                  className={`${isDownloadChart ? 'bg-switch-active border-switch-border-active border-1 font-semibold' : 'bg-transparent'} rounded-md py-1 px-2 m-[-1px] cursor-pointer`}
                >
                  Downloads
                </button>
                <button
                  type="button"
                  onClick={() => setIsDownloadChart(false)}
                  className={`${!isDownloadChart ? 'bg-switch-active border-switch-border-active border-1 font-semibold' : 'bg-transparent'} rounded-md py-1 px-2 m-[-1px] cursor-pointer`}
                >
                  Stars
                </button>
              </div>
              <div>
                {!isDownloadChart ? (
                  <p>{repository?.stargazers_count} stars</p>
                ) : (
                  <>
                    {releases && releases.pages[0].length > 0 ? (
                      <p>
                        {formatLargeNumber(getReleasesDownloadsCount(pagesToReleaseArray()))}{' '}
                        downloads overall
                      </p>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
            </div>
            <hr className="h-[1px] border-t-0 rounded-full bg-border" />

            <div className="mt-2">
              {isDownloadChart ? (
                <>
                  {releases && releases.pages[0].length > 0 ? (
                    <MyChart releases={pagesToReleaseArray()} />
                  ) : isReleasesPending ? (
                    <LoadingIndicator />
                  ) : (
                    <>No Releases exist for this repository</>
                  )}
                </>
              ) : (
                <MyStargazersChart user={user} repository={repositoryName} />
              )}
            </div>
          </div>
          <div className="flex-1/3">
            {repository ? (
              <div className="ml-8 gap-1 flex flex-col">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-xl">About</h3>
                  {repository.description && <p>{repository.description}</p>}

                  {repository.homepage && (
                    <div className="flex flex-row gap-3 mt-1 text-sm">
                      <LinkIcon size={16} weight="bold" />
                      <Link
                        href={repository.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link hover:underline font-semibold"
                      >
                        {repository.homepage}
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  className="flex flex-row mt-4 gap-3 hover:text-link text-secondary-text"
                  href={`${repository.html_url}#readme-ov-file`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpenIcon size={18} weight="bold" />
                  <div className="flex flex-row gap-1 text-sm">
                    <p>Readme</p>
                  </div>
                </Link>
                {repository.license ? (
                  <Link
                    className="flex flex-row gap-3 hover:text-link text-secondary-text"
                    href={`${repository.html_url}#${repository.license.spdx_id}-1-ov-file`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ScalesIcon size={18} weight="bold" />
                    <div className="flex flex-row gap-1 text-sm">
                      <p>{repository.license.spdx_id}</p>
                      <p>licence</p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    className="flex flex-row gap-3 hover:text-link text-secondary-text"
                    href={`${repository.html_url}#security-ov-file`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ScalesIcon size={18} weight="bold" />
                    <div className="flex flex-row gap-1 text-sm">
                      <p>Security policy</p>
                    </div>
                  </Link>
                )}
                <Link
                  className="flex flex-row gap-3 hover:text-link text-secondary-text"
                  href={`${repository.html_url}/activity`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PulseIcon size={18} weight="bold" />
                  <div className="flex flex-row gap-1 text-sm">
                    <p>Activity</p>
                  </div>
                </Link>
                <Link
                  className="flex flex-row gap-3 hover:text-link text-secondary-text"
                  href={repository.stargazers_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <StarIcon size={18} weight="bold" />
                  <div className="flex flex-row gap-1 text-sm">
                    <p className="font-semibold">
                      {formatLargeNumber(repository.stargazers_count)}
                    </p>
                    <p>stars</p>
                  </div>
                </Link>
                <Link
                  className="flex flex-row gap-3 hover:text-link text-secondary-text"
                  href={repository.subscribers_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <EyeIcon size={18} weight="bold" />
                  <div className="flex flex-row gap-1 text-sm">
                    <p className="font-semibold">
                      {formatLargeNumber(repository.subscribers_count)}
                    </p>
                    <p>watchers</p>
                  </div>
                </Link>
                <Link
                  className="flex flex-row gap-3 hover:text-link text-secondary-text"
                  href={repository.forks_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitForkIcon size={18} weight="bold" />
                  <div className="flex flex-row gap-1 text-sm">
                    <p className="font-semibold">{formatLargeNumber(repository.forks)}</p>
                    <p>forks</p>
                  </div>
                </Link>
              </div>
            ) : isRepositoryPending ? (
              <LoadingIndicator />
            ) : (
              <>an error occured</>
            )}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">Releases:</h2>
          {releases ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {releases.pages.map((page: Release[], i: number) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <React.Fragment key={i}>
                  {page.map((release: Release) => {
                    let latestAlreadyUsed = false;
                    let latest = false;
                    releases.pages.map((page: Release[]) => {
                      page.map((releaseComparison: Release) => {
                        if (
                          releaseComparison.draft ||
                          releaseComparison.prerelease ||
                          latestAlreadyUsed
                        )
                          return;
                        if (releaseComparison.id === release.id) {
                          latest = true;
                        }
                        latestAlreadyUsed = true;
                      });
                    });
                    return <ReleaseCard release={release} key={release.url} latest={latest} />;
                  })}
                </React.Fragment>
              ))}
            </div>
          ) : isReleasesPending ? (
            <LoadingIndicator />
          ) : (
            <>error</>
          )}
          <div className="w-full pt-4">
            {isFetchingNextPage && hasNextPage ? (
              <p className="text-center">Loading more...</p>
            ) : (
              <p className="text-center">No more releases found</p>
            )}

            <div ref={ref} />
          </div>
        </div>
      </div>
    </div>
  );
}
