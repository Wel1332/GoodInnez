const API_BASE_URL = "http://localhost:8080/api";

// Token management
const TOKEN_KEY = 'goodinnez_token';
const USER_KEY = 'goodinnez_user';

export const tokenService = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),
    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    removeUser: () => localStorage.removeItem(USER_KEY),
    isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};

// Request/Response interceptor
const httpClient = async (url, options = {}) => {
    const token = tokenService.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            tokenService.removeToken();
            tokenService.removeUser();
            window.location.href = '/';
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = 'An error occurred';
            
            if (contentType?.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || 'An error occurred';
            } else {
                errorMessage = await response.text() || response.statusText;
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }
        return await response.text();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const api = {
    // --- HOTELS ---
    getHotels: async () => {
        try {
            return await httpClient(`${API_BASE_URL}/hotels`);
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    
    getMyHotels: async (employeeId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/hotels/partner/${employeeId}`);
            if (!response.ok) throw new Error("Failed to fetch my hotels");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    
    getHotelById: async (id) => {
        return await httpClient(`${API_BASE_URL}/hotels/${id}`);
    },
    
    createHotel: async (formData) => {
        const token = tokenService.getToken();
        return await fetch(`${API_BASE_URL}/hotels`, {
            method: "POST",
            body: formData,
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        }).then(res => {
            if (!res.ok) throw new Error("Failed to list property");
            return res.json();
        });
    },
    
    deleteHotel: async (id) => {
        return await httpClient(`${API_BASE_URL}/hotels/${id}`, { method: "DELETE" });
    },

    // --- ROOMS ---
    getRoomsByHotel: async (hotelId) => {
        try {
            return await httpClient(`${API_BASE_URL}/rooms/hotel/${hotelId}`);
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    
    getRoomTypes: async () => {
        try {
            return await httpClient(`${API_BASE_URL}/roomtypes`);
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
        return await httpClient(`${API_BASE_URL}/guests`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
    
    login: async (credentials) => {
        const response = await httpClient(`${API_BASE_URL}/guests/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        if (response.token) {
            tokenService.setToken(response.token);
            tokenService.setUser({ ...response, userType: 'guest' });
        }
        return response;
    },
    
    updateGuest: async (id, userData) => {
        return await httpClient(`${API_BASE_URL}/guests/${id}`, {
            method: "PUT",
            body: JSON.stringify(userData),
        });
    },
    
    deleteGuest: async (id) => {
        return await httpClient(`${API_BASE_URL}/guests/${id}`, { method: "DELETE" });
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
        return await httpClient(`${API_BASE_URL}/employees`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
    
    loginEmployee: async (credentials) => {
        const response = await httpClient(`${API_BASE_URL}/employees/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        if (response.token) {
            tokenService.setToken(response.token);
            tokenService.setUser({ ...response, userType: 'employee' });
        }
        return response;
    },

    // --- BOOKINGS ---
    getBookings: async () => {
        return await httpClient(`${API_BASE_URL}/bookings`);
    },
    
    createBooking: async (bookingData) => {
        return await httpClient(`${API_BASE_URL}/bookings`, {
            method: "POST",
            body: JSON.stringify(bookingData),
        });
    },
    
    cancelBooking: async (id) => {
        return await httpClient(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
    },
    
    rejectBooking: async (id) => {
        return await httpClient(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
    },
    
    approveBooking: async (id) => {
        return await httpClient(`${API_BASE_URL}/bookings/${id}/approve`, {
            method: "PUT",
        });
    },

    // --- PAYMENTS ---
    createPayment: async (paymentData) => {
        return await httpClient(`${API_BASE_URL}/payments`, {
            method: "POST",
            body: JSON.stringify(paymentData),
        });
    },

    // --- LOGOUT ---
    logout: async () => {
        tokenService.removeToken();
        tokenService.removeUser();
    },
};