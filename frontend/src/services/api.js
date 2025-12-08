const API_BASE_URL = "http://localhost:8080/api";

export const api = {
    // --- HOTELS ---
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
    getHotelById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
        if (!response.ok) throw new Error("Hotel not found");
        return await response.json();
    },
    createHotel: async (formData) => { // 1. Argument is 'formData'
        const response = await fetch(`${API_BASE_URL}/hotels`, {
            method: "POST",
            body: formData, // 2. So we must send 'formData' here
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to list property");
        }
        return await response.json();
    },
    deleteHotel: async (id) => {
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete hotel");
    },

    // --- ROOMS (NEW) ---
    getRoomsByHotel: async (hotelId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/hotel/${hotelId}`);
            if (!response.ok) throw new Error("Failed to fetch rooms");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    getRoomTypes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/roomtypes`);
            if (!response.ok) throw new Error("Failed to fetch room types");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // --- GUESTS ---
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
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/guests/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error("Invalid credentials");
        return await response.json(); 
    },
    updateGuest: async (id, userData) => {
        const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Failed to update profile");
        return await response.json();
    },
    deleteGuest: async (id) => {
        await fetch(`${API_BASE_URL}/guests/${id}`, { method: "DELETE" });
    },

    // --- EMPLOYEES / PARTNERS ---
    registerEmployee: async (userData) => {
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            position: "Partner",
            hireDate: new Date().toISOString().split('T')[0],
            salary: 0 
        };
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Partner registration failed");
        return await response.json();
    },
    loginEmployee: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/employees/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error("Invalid partner credentials");
        return await response.json();
    },

    // --- BOOKINGS ---
    getBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        return await response.json();
    },
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
    cancelBooking: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to cancel booking");
    },
    rejectBooking: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to reject booking");
    },
    approveBooking: async (id) => {
        return new Promise((resolve) => setTimeout(resolve, 500)); 
    }
};