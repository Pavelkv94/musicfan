import { useForm } from 'react-hook-form';
import type { SchemaCreatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useAddPlaylistMutation } from '../api/add-playlist-mutation';

function AddPlaylistForm() {
    const form = useForm<SchemaCreatePlaylistRequestPayload>({
        defaultValues: {
            title: '',
            description: ''
        }
    });

    const { mutate: addPlaylist, isPending } = useAddPlaylistMutation({ form });

    const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
        addPlaylist(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2>Add new playlist</h2>
            <input type="text" placeholder="Playlist name" {...form.register('title')} />
            <textarea placeholder="Playlist description" {...form.register('description')} />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add'}
            </button>
        </form>
    );
}

export default AddPlaylistForm;
