import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../../../shared/api/client';
import type { SchemaCreatePlaylistRequestPayload } from '../../../../shared/api/schema';
import type { UseFormReturn } from 'react-hook-form';

export const useAddPlaylistMutation = ({ form }: { form: UseFormReturn<SchemaCreatePlaylistRequestPayload> }) => {
    const queryClient = useQueryClient();

    const query = useMutation({
        mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
            const response = await client.POST('/playlists', { body: data });
            return response.data;
        },
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['playlists'], refetchType: 'active' });
        }
    });

    return query;
};
