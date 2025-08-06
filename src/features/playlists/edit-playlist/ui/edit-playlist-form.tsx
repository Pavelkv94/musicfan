import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../../../../shared/api/client';
import type { SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema';

function EditPlaylistForm({ playlistId }: { playlistId: string }) {
    const queryClient = useQueryClient();

    const { data: playlist, isPending: isPlaylistPending } = useQuery({
        queryKey: ['playlists', playlistId],
        queryFn: async () => {
            const response = await client.GET('/playlists/{playlistId}', {
                params: {
                    path: { playlistId }
                }
            });
            return response.data;
        }
    });

    const form = useForm<SchemaUpdatePlaylistRequestPayload>({
        defaultValues: {
            title: playlist?.data.attributes.title ?? '',
            description: playlist?.data.attributes.description ?? ''
        }
    });

    const { mutate: editPlaylist, isPending } = useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
            const response = await client.PUT('/playlists/{playlistId}', {
                body: { ...data, tagIds: [] },
                params: {
                    path: {
                        playlistId: playlistId
                    }
                }
            });
            return response.data;
        },
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['playlists'], refetchType: 'active' });
        }
    });

    const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
        editPlaylist(data);
    };

    if (isPlaylistPending) {
        return <div>Loading...</div>;
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
