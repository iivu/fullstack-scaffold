const tokenName = import.meta.env.VITE_APP_TOKEN_KEY;
let token: string | null = null;

export function setToken(newToken: string) {
  token = newToken;
  window?.localStorage.setItem(tokenName, newToken);
  return token;
}

export function getToken() {
  if (token === null) {
    token = window?.localStorage.getItem(tokenName) || null;
  }
  return token;
}

export function clearToken() {
  token = null;
  window?.localStorage.removeItem(tokenName);
}
