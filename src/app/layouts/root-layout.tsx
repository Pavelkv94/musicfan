import { Outlet } from '@tanstack/react-router';
import Header from '../../shared/ui/header/header';
import styles from './root-layout.module.css';
import { AccountBar } from '../../features/auth/ui/account-bar';

export const RootLayout = () => (
    <div>
        <Header
            renderAccountBar={() => (
                <div>
                    <AccountBar />
                </div>
            )}
        />
        <div className={styles.container}>
            <Outlet />
        </div>
    </div>
);
