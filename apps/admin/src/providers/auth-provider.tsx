import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useConfirm } from '#/providers/confirm-dialog-provider';
import * as api from '#/services/api';
import { clearToken, getToken, setToken } from '#/shared/token';
import type { UserProfile } from '#/types';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  status: AuthStatus;
  user: UserProfile | null;
  login: (payload: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { confirm } = useConfirm();
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      const token = getToken();
      if (!token) {
        if (active) setStatus('unauthenticated');
        return;
      }

      try {
        const tokenResp = await api.checkToken();
        if (tokenResp.data.isValid !== 1) {
          clearToken();
          if (active) {
            setUser(null);
            setStatus('unauthenticated');
          }
          return;
        }

        const userResp = await api.getUserInfo();
        if (active) {
          setUser(userResp.data);
          setStatus('authenticated');
        }
      } catch {
        clearToken();
        if (active) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  const login: AuthContextValue['login'] = useCallback(async (payload) => {
    const resp = await api.login(payload);
    const { accessToken, userid, account, name } = resp.data;
    setToken(accessToken);
    setUser({ userid, account, name });
    setStatus('authenticated');
  }, []);

  const logout: AuthContextValue['logout'] = useCallback(async () => {
    const confirmed = await confirm({
      title: '退出登录',
      description: '确认退出当前账号？',
      confirmBtnText: '退出',
      danger: true,
    });
    if (!confirmed) return;

    await api.loginOut();
    clearToken();
    setUser(null);
    setStatus('unauthenticated');
  }, [confirm]);

  const value = useMemo<AuthContextValue>(() => ({ status, user, login, logout }), [status, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
