import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

export async function loginWithCookie(email: string, password: string) {
  await api.post("login?useCookies=true", { email, password });
}

export async function register(email: string, password: string) {
  await api.post("register", { email, password });
}

export async function logout() {
  await api.post("logout", {});
}

export async function checkAuthentication() {
  try {
    // Asks the backend "who am I?" using the auth cookie; 200 = logged in, 401 = not logged in
    await api.get("manage/info");
    return true;
  } catch {
    return false;
  }
}

export async function deleteAccount(password: string): Promise<void> {
  await api.delete("api/user/delete-account", { data: { password } });
}