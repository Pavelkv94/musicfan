import { LoginButton } from './login-button';
import { CurrentUser } from './current-user/current-user';
import { useMeQuery } from '../api/use-me-query';

export const AccountBar = () => {
    const { data: currentUser, isPending } = useMeQuery();

    if (isPending) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!currentUser && <LoginButton />}
            {currentUser && <CurrentUser />}
        </div>
    );
};
