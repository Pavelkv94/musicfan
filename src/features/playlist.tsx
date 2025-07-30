import client from '../shared/api/client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Pagination } from '../shared/ui/pagination/pagination';
import { useState } from 'react';

const Playlist = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data: playlists, isFetching } = useQuery({
        queryKey: ['playlists', page, search],
        queryFn: async ({ signal }) => {
            const res = await client.GET('/playlists', {
                params: {
                    query: {
                        pageNumber: page,
                        search: search
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
                <ul>{isFetching ? <div>Loading...</div> : playlists?.data.map(playlist => <li key={playlist.id}>{playlist.attributes.title}</li>)}</ul>
            </div>
        </div>
    );
};

export default Playlist;
