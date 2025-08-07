import { useQueryClient } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import client from "../../../shared/api/client";

export const callbackUrl = 'http://localhost:5173/oauth/callback/';

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            const response = await client.POST('/auth/login', {
                body: {
                    code,
                    redirectUri: callbackUrl,
                    accessTokenTTL: '1h',
                    rememberMe: true
                }
            });
            if (response.error) {
                throw new Error(response.error.message);
            }
            return response.data;
        },
        onSuccess: data => {
            localStorage.setItem('musicfan-accessToken', data.accessToken);
            localStorage.setItem('musicfan-refreshToken', data.refreshToken);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: error => {
            console.error('login error', error);
        }
    });

    return mutation;
}