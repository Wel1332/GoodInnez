import { create } from 'zustand';
import { tokenService, api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: tokenService.getUser(),
  token: tokenService.getToken(),
  isLoading: false,
  error: null,

  login: async (credentials, isPartner = false) => {
    set({ isLoading: true, error: null });
    try {
      const loginFn = isPartner ? api.loginEmployee : api.login;
      const response = await loginFn(credentials);
      const userData = { ...response, userType: isPartner ? 'employee' : 'guest' };
      tokenService.setToken(response.token);
      tokenService.setUser(userData);
      set({ user: userData, token: response.token, isLoading: false });
      return userData;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signup: async (userData, isPartner = false) => {
    set({ isLoading: true, error: null });
    try {
      const signupFn = isPartner ? api.registerEmployee : api.registerGuest;
      const response = await signupFn(userData);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await api.logout();
    tokenService.removeToken();
    tokenService.removeUser();
    set({ user: null, token: null, error: null });
  },

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
