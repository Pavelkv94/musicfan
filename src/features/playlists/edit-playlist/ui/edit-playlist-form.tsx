import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../../../../shared/api/client';
import type { SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useMeQuery } from '../../../auth/api/use-me-query';
import { useEffect } from 'react';
import { useEditPlaylistMutation } from '../api/edit-playlist-mutation';

function EditPlaylistForm({ playlistId }: { playlistId: string | null }) {
    const { data: me } = useMeQuery();

    const { data: playlist, isPending: isPlaylistPending } = useQuery({
        queryKey: ['playlists', 'details', playlistId],
        queryFn: async () => {
            const response = await client.GET('/playlists/{playlistId}', {
                params: {
                    path: { playlistId: playlistId! }
                }
            });
            return response.data;
        },
        enabled: !!playlistId && !!me
    });

    const form = useForm<SchemaUpdatePlaylistRequestPayload>({
        defaultValues: {
            title: '',
            description: ''
        }
    });

    useEffect(() => {
        if (playlist) {
            form.reset({
                title: playlist.data.attributes.title,
                description: playlist.data.attributes.description
            });
        }
    }, [playlistId]);

    const { mutate: editPlaylist, isPending } = useEditPlaylistMutation({ form, playlistId: playlistId! });

    const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
        editPlaylist(data);
    };

    if (isPlaylistPending) {
        return <div>Loading...</div>;
    }

    if (!playlistId) {
        return <div>No playlist selected</div>;
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2>Edit playlist</h2>
            <input type="text" placeholder="Playlist name" {...form.register('title')} />
            <textarea placeholder="Playlist description" {...form.register('description')} />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Editing...' : 'Edit'}
            </button>
        </form>
    );
}

export default EditPlaylistForm;
