import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import client from "../../../shared/api/client";


export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await client.POST('/auth/logout', {
                body: {
                    refreshToken: localStorage.getItem('musicfan-refreshToken') || ''
                }
            });

            return response.data;
        },
        onSuccess: () => {
            localStorage.removeItem('musicfan-accessToken');
            localStorage.removeItem('musicfan-refreshToken');
            queryClient.resetQueries({ queryKey: ['currentUser'] });
        }
    });

    return mutation;
}