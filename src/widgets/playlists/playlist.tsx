import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import client from '../../shared/api/client';
import { Pagination } from '../../shared/ui/pagination/pagination';
import { useMeQuery } from '../../features/auth/api/use-me-query';
import DeletePlaylist from '../../features/playlists/delete-playlist/ui/delete-playlist';

type Props = {
    userId?: string;
    onPlaylistClick?: (playlistId: string) => void;
    isSearch?: boolean;
};

const Playlist = ({ userId, onPlaylistClick, isSearch = false }: Props) => {
    const { data: me } = useMeQuery();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const key = userId ? ['playlists', 'my', userId] : ['playlists', page, search];
    const queryparams = userId ? { userId: userId } : { pageNumber: page, search: search };

    const { data: playlists, isFetching } = useQuery({
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

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <div>
            {isSearch && <input type="text" value={search} onChange={e => setSearch(e.target.value)} />}
            <hr />
            <Pagination current={page} pagesCount={playlists?.meta.pagesCount || 0} changePageNumber={handlePageChange} isFetching={isFetching} />
            <div>
                <ul>
                    {isFetching ? (
                        <div>Loading...</div>
                    ) : (
                        playlists?.data.map(playlist => (
                            <li key={playlist.id}>
                                <button onClick={() => onPlaylistClick?.(playlist.id)}>{playlist.attributes.title}</button>
                                {me?.userId === userId && <DeletePlaylist playlistId={playlist.id} />}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Playlist;
