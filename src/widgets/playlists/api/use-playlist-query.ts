import { keepPreviousData, useQuery } from '@tanstack/react-query';
import client from '../../../shared/api/client';

export const usePlaylistQuery = ({ userId, page, search }: { userId?: string; page: number; search: string }) => {
    const key = userId ? ['playlists', 'my', userId] : ['playlists', page, search];
    const queryparams = userId ? { userId: userId } : { pageNumber: page, search: search };

    const query = useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: key,
        queryFn: async ({ signal }) => {
            const res = await client.GET('/playlists', {
                params: {
                    query: queryparams
                },
                signal // cancel request when user change page
            });
            return res.data;
        },
        placeholderData: keepPreviousData
    });

    return query;
};
