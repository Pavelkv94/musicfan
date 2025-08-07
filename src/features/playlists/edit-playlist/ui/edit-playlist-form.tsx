import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../../../../shared/api/client';
import type { SchemaGetPlaylistOutput, SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema';
import { useMeQuery } from '../../../auth/api/use-me-query';
import { useEffect } from 'react';

function EditPlaylistForm({ playlistId }: { playlistId: string | null }) {
    const { data: me } = useMeQuery();
    const queryClient = useQueryClient();

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

    const { mutate: editPlaylist, isPending } = useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
            const response = await client.PUT('/playlists/{playlistId}', {
                body: { ...data, tagIds: [] },
                params: {
                    path: {
                        playlistId: playlistId!
                    }
                }
            });
            return response.data;
        },
        onMutate: async (data: SchemaUpdatePlaylistRequestPayload) => {
            await queryClient.cancelQueries({ queryKey: ['playlists'] });
            const key = ['playlists', 'my', me?.userId];
            const previousMyPlaylists = queryClient.getQueryData(key);
            queryClient.setQueryData(key, (oldData: SchemaGetPlaylistOutput) => {
                return {
                    ...oldData,
                    // @ts-expect-error TODO: fix this
                    data: oldData.data.map((playlist: SchemaGetPlaylistOutput['data']) =>
                        playlist.id === playlistId
                            ? { ...playlist, attributes: { ...playlist.attributes, description: data.description, title: data.title } }
                            : playlist
                    )
                };
            });
            return { previousMyPlaylists };
        },
        onSettled: () => {
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['playlists'], refetchType: 'active' });
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['playlists', 'my', me?.userId], context?.previousMyPlaylists);
        }
    });

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
