import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../../../shared/api/client';
import type { SchemaGetPlaylistOutput } from '../../../../shared/api/schema';

export const useDeletePlaylistMutation = () => {
    const queryClient = useQueryClient();
    const { mutate: deletePlaylist } = useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.DELETE(`/playlists/{playlistId}`, {
                params: {
                    path: {
                        playlistId
                    }
                }
            });
            return response.data;
        },
        onSuccess: (_, playlistId) => {
            queryClient.setQueryData(['playlists'], (old: SchemaGetPlaylistOutput) => {
                return {
                    ...old,
                    //@ts-expect-error TODO: fix this
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data: old.data.filter((p: any) => p.id !== playlistId)
                };
            });
        }
    });

    return { deletePlaylist };
};
