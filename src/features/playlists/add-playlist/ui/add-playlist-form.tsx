import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../../../../shared/api/client';
import type { SchemaCreatePlaylistRequestPayload } from '../../../../shared/api/schema';

function AddPlaylistForm() {
    const queryClient = useQueryClient();
    const form = useForm<SchemaCreatePlaylistRequestPayload>({
        defaultValues: {
            title: '',
            description: ''
        }
    });

    const { mutate: addPlaylist, isPending } = useMutation({
        mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
            const response = await client.POST('/playlists', { body: data });
            return response.data;
        },
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['playlists'], refetchType: 'active' });
        }
    });

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
