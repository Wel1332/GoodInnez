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

    // --- REGISTER ---
    registerGuest: async (userData) => {
        const nameParts = userData.name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        const payload = {
        firstName: firstName,
        lastName: lastName,
        email: userData.email,
        password: userData.password,
        phone: "000-000-0000",
        address: "Not Provided",
        dateOfBirth: "2000-01-01"
        };

        const response = await fetch(`${API_BASE_URL}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Registration failed");
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
        return await response.json(); // Returns the user object
    }
};