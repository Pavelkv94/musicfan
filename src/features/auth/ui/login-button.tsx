import { useLoginMutation } from '../api/use-login-mutation';

import { callbackUrl } from '../api/use-login-mutation';
export const LoginButton = () => {
    const { mutate: login } = useLoginMutation();

    const handleOauthMessage = (event: MessageEvent) => {
        window.removeEventListener('message', handleOauthMessage);
        if (event.origin !== document.location.origin) {
            console.warn('Oauth message from unauthorized origin', event.origin);
            return;
        }
        if (event.data.code) {
            login({ code: event.data.code });
        } else {
            console.warn('Oauth message without code', event.data);
            return;
        }
    };

    const handleLoginClick = () => {
        window.addEventListener('message', handleOauthMessage);
        window.open(`https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${callbackUrl}`, 'apihub-oauth2', 'width=500,height=600');
    };

    return <button onClick={handleLoginClick}>Login</button>;
};
