// src/services/api.js

const API_BASE_URL = "http://localhost:8080/api";

export const api = {
    // --- GET HOTELS ---
    getHotels: async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/hotels`);
        if (!response.ok) throw new Error("Failed to fetch hotels");
        return await response.json();
        } catch (error) {
        console.error(error);
        return [];
        }
    },

    // --- REGISTER (UPDATED) ---
    registerGuest: async (userData) => {
        // Now we pass the full object directly, no more hardcoded defaults
        const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        dateOfBirth: userData.dateOfBirth
        };

        const response = await fetch(`${API_BASE_URL}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

    if (!response.ok) {
        // Try to get the error message from the backend (e.g. "Email already exists")
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
    }
    return await response.json();
    },

    // --- LOGIN ---
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/guests/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        });

        if (!response.ok) throw new Error("Invalid credentials");
        return await response.json();
    },
    
    // --- DELETE USER ---
    deleteGuest: async (id) => {
        await fetch(`${API_BASE_URL}/guests/${id}`, {
        method: "DELETE",
        });
    }
};