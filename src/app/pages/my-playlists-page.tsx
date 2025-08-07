import { Navigate } from '@tanstack/react-router';
import { useMeQuery } from '../../features/auth/api/use-me-query';
import AddPlaylistForm from '../../features/playlists/add-playlist/ui/add-playlist-form';
import Playlist from '../../widgets/playlists/playlist';
import EditPlaylistForm from '../../features/playlists/edit-playlist/ui/edit-playlist-form';
import { useState } from 'react';

function MyPlaylistsPage() {
    const { data: me, isPending } = useMeQuery();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!me) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h2>My Playlists</h2>
            <hr />
            <div>
                <AddPlaylistForm />
            </div>
            <hr />
            <div style={{ display: 'flex' }}>
                <Playlist userId={me.userId} onPlaylistClick={setSelectedPlaylistId} />
                <EditPlaylistForm playlistId={selectedPlaylistId} />
            </div>
        </div>
    );
}

export default MyPlaylistsPage;
