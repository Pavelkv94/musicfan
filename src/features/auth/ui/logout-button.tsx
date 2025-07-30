import { useLogoutMutation } from '../api/use-logout-mutation';

export const LogoutButton = () => {
    const { mutate: logout } = useLogoutMutation();

    const handleLogoutClick = () => {
        logout();
    };

    return <button onClick={handleLogoutClick}>Logout</button>;
};
