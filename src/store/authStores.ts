// src/stores/authStore.ts
import { create } from "zustand";

interface AuthState {
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
	checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
	// Initialize with `isAuthenticated` based on `localStorage`
	isAuthenticated: Boolean(localStorage.getItem("token")),

	// Login function - sets the token in localStorage and updates isAuthenticated
	login: (token: string) => {
		localStorage.setItem("token", token); // Store token in localStorage
		set({ isAuthenticated: true }); // Update auth state
	},

	// Logout function - removes the token and updates isAuthenticated
	logout: () => {
		localStorage.removeItem("token"); // Clear token from localStorage
		set({ isAuthenticated: false }); // Update auth state
	},

	// Check auth status - called on app initialization
	checkAuth: () => {
		const isAuth = Boolean(localStorage.getItem("token"));
		set({ isAuthenticated: isAuth });
	},
}));

export default useAuthStore;
