import { useDeletePlaylistMutation } from '../api/use-delete-mutation';

function DeletePlaylist({ playlistId }: { playlistId: string }) {
    const { deletePlaylist } = useDeletePlaylistMutation();

    return <button onClick={() => deletePlaylist(playlistId)}>Delete</button>;
}

export default DeletePlaylist;
