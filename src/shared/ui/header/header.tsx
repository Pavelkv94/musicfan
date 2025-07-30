import { Link } from '@tanstack/react-router';
import styles from './header.module.css';

type Props = {
    renderAccountBar: () => React.ReactNode;
};

const Header = ({ renderAccountBar }: Props) => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.linksBlock}>
                    <Link to="/">Main</Link>
                    <Link to="/my-playlists">My Playlists</Link>
                    <Link to="/oauth/callback">Login</Link>
                </div>

                <div>{renderAccountBar()}</div>
            </div>
        </header>
    );
};

export default Header;
