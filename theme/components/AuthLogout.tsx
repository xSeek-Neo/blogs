import { useLinkNavigate } from '@rspress/core/theme';
import { useSyncExternalStore } from 'react';

import { clearAuthSession, hasAuthSession, subscribeAuthSession } from '../utils/auth';
import styles from './AuthLogout.module.css';

export function AuthLogout() {
  const navigate = useLinkNavigate();
  const loggedIn = useSyncExternalStore(subscribeAuthSession, hasAuthSession, () => false);

  if (!loggedIn) {
    return null;
  }

  const handleLogout = () => {
    clearAuthSession();
    navigate('/');
  };

  return (
    <button type="button" className={styles.logout} onClick={handleLogout} aria-label="退出登录">
      退出
    </button>
  );
}
