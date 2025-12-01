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

    // --- REGISTER GUEST ---
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
        const data = await response.json();
        return { ...data, type: 'guest' }; // Explicitly mark as guest
    },

    // --- REGISTER PARTNER (EMPLOYEE) ---
    registerEmployee: async (userData) => {
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            position: "Partner", // Auto-assign position
            hireDate: new Date().toISOString().split('T')[0],
            salary: 0 
        };

        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Partner registration failed");
        }
        const data = await response.json();
        return { ...data, type: 'employee' }; // Mark as employee for AddHotel check
    },

    // --- LOGIN GUEST ---
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/guests/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) throw new Error("Invalid credentials");
        const data = await response.json(); 
        return { ...data, type: 'guest' };
    },

    // --- LOGIN PARTNER (EMPLOYEE) ---
    loginEmployee: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/employees/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) throw new Error("Invalid partner credentials");
        const data = await response.json();
        return { ...data, type: 'employee' };
    },
    
    // --- DELETE USER ---
    deleteGuest: async (id) => {
        await fetch(`${API_BASE_URL}/guests/${id}`, {
            method: "DELETE",
        });
    },

    // --- GET ALL BOOKINGS ---
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

    // --- CANCEL BOOKING ---
    cancelBooking: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to cancel booking");
    },

    updateGuest: async (id, userData) => {
        const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Failed to update profile");
        }
        return await response.json();
    },

    rejectBooking: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to reject booking");
    },

    // --- HOST: APPROVE BOOKING (Mock for now) ---
    approveBooking: async (id) => {
        return new Promise((resolve) => setTimeout(resolve, 500)); 
    },

    // --- HOST: CREATE HOTEL ---
    createHotel: async (hotelData) => {
        const response = await fetch(`${API_BASE_URL}/hotels`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hotelData),
        });
        if (!response.ok) throw new Error("Failed to create hotel");
        return await response.json();
    },

    deleteHotel: async (id) => {
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete hotel");
    }
};