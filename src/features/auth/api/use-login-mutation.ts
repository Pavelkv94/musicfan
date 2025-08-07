import { useQueryClient } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import client from "../../../shared/api/client";
import { accessTokenKey } from '../../../shared/config/localstorage-keys';
import { refreshTokenKey } from '../../../shared/config/localstorage-keys';

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
            localStorage.setItem(accessTokenKey, data.accessToken);
            localStorage.setItem(refreshTokenKey, data.refreshToken);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: error => {
            console.error('login error', error);
        }
    });

    return mutation;
}