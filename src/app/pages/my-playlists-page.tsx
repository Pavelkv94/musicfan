import { Navigate } from '@tanstack/react-router';
import { useMeQuery } from '../../features/auth/api/use-me-query';
import Playlist from '../../features/playlist';

function MyPlaylistsPage() {
    const { data: me, isPending } = useMeQuery();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!me) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <Playlist userId={me.userId} />
        </div>
    );
}

export default MyPlaylistsPage;
