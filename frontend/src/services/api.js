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

    // --- GET SINGLE HOTEL ---
    getHotelById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
        if (!response.ok) throw new Error("Hotel not found");
        return await response.json();
    },

    // --- REGISTER ---
    registerGuest: async (userData) => {
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
    },

    // --- GET ALL BOOKINGS (New) ---
    getBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        return await response.json();
    },

    // --- CREATE BOOKING ---
    createBooking: async (bookingData) => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Booking failed");
        }
        return await response.json();
    },

    // --- CANCEL BOOKING (New - Required for Reservations Page) ---
    cancelBooking: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to cancel booking");
    }
};