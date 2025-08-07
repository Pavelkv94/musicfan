import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import client from "../../../shared/api/client";
import { accessTokenKey } from '../../../shared/config/localstorage-keys';
import { refreshTokenKey } from '../../../shared/config/localstorage-keys';


export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await client.POST('/auth/logout', {
                body: {
                    refreshToken: localStorage.getItem(refreshTokenKey) || ''
                }
            });

            return response.data;
        },
        onSuccess: () => {
            localStorage.removeItem(accessTokenKey);
            localStorage.removeItem(refreshTokenKey);
            queryClient.resetQueries({ queryKey: ['currentUser'] });
        }
    });

    return mutation;
}