import { Link } from '@tanstack/react-router';
import styles from '../account-bar.module.css';
import { useMeQuery } from '../../api/use-me-query';
import { LogoutButton } from '../logout-button';

export const CurrentUser = () => {
    const { data: currentUser } = useMeQuery();

    if (!currentUser) {
        return null;
    }

    return (
        <div className={styles.meInfoContainer}>
            <Link to="/my-playlists" activeOptions={{ exact: true }}>
                {currentUser?.login}
            </Link>

            <LogoutButton />
        </div>
    );
};
