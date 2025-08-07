import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../../../shared/api/client';
import type { SchemaGetPlaylistOutput, SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema';
import type { UseFormReturn } from 'react-hook-form';
import { useMeQuery } from '../../../auth/api/use-me-query';

export const useEditPlaylistMutation = ({ form, playlistId }: { form: UseFormReturn<SchemaUpdatePlaylistRequestPayload>; playlistId: string }) => {
    const { data: me } = useMeQuery();
    const queryClient = useQueryClient();
    const query = useMutation({
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

    return query;
};
