import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './BookingPage.css'; // Reusing existing form styles

export default function AddHotel({ user }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    stars: '3',
    checkinTime: '14:00',
    checkoutTime: '11:00'
    });

    useEffect(() => {
    // Redirect if not an employee
    if (!user || user.type !== 'employee') {
        alert("Access restricted to employees.");
        navigate('/');
    }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    // Append seconds to time to match LocalTime format (HH:mm:ss) expected by backend
    const payload = {
        ...formData,
        checkinTime: formData.checkinTime + ":00",
        checkoutTime: formData.checkoutTime + ":00"
    };

    try {
        await api.createHotel(payload);
        alert("Hotel posted successfully!");
        navigate('/search');
    } catch (error) {
        console.error(error);
        alert("Failed to post hotel.");
    }
    };

    return (
    <div className="booking-page">
        <div className="booking-container">
        <h1>Post a New Hotel</h1>
        <form className="reservation-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Hotel Name</label>
                <input className="input-field" type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input className="input-field" type="text" required
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="form-group">
                <label>Phone</label>
                <input className="input-field" type="text" required
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input className="input-field" type="email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
                <label>Stars (1-5)</label>
                <input className="input-field" type="number" min="1" max="5" required
                    value={formData.stars} onChange={e => setFormData({...formData, stars: e.target.value})} />
            </div>
            <button type="submit" className="confirm-btn">Create Hotel</button>
        </form>
        </div>
    </div>
    );
}