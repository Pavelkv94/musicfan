import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import client from '../../shared/api/client';
import { Pagination } from '../../shared/ui/pagination/pagination';
import { useMeQuery } from '../../features/auth/api/use-me-query';
import DeletePlaylist from '../../features/playlists/delete-playlist/ui/delete-playlist';

type Props = {
    userId: string;
    onPlaylistClick?: (playlistId: string) => void;
};

const Playlist = ({ userId, onPlaylistClick }: Props) => {
    const { data: me } = useMeQuery();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data: playlists, isFetching } = useQuery({
        queryKey: ['playlists', page, search, userId],
        queryFn: async ({ signal }) => {
            const res = await client.GET('/playlists', {
                params: {
                    query: {
                        pageNumber: page,
                        search: search,
                        userId: userId
                    }
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
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
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
