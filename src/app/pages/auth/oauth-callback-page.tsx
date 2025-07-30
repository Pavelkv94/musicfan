import { useEffect } from 'react';

const OauthCallbackPage = () => {
    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code && window.opener) {
            window.opener.postMessage({ code }, window.location.origin);
        }
        window.close();
    }, []);

    return <div>OauthCallbackPage</div>;
};

export default OauthCallbackPage;
