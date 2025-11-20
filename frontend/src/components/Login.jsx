import { useState } from 'react'
import { api } from '../services/api'
import './Login.css'

export default function Login({ onClose, onSwitchToSignup, onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Login attempt:', formData)
        
        // Call the API
        api.login({ email: formData.email, password: formData.password })
            .then((user) => {
                // If successful, tell App.jsx
                onLoginSuccess(user) 
            })
            .catch((err) => {
                console.error(err)
                alert("Login failed. Please check your email and password.")
            })
    }

    return (
        <div className="login-overlay">
        <div className="login-glass-card">
            <button className="close-btn" onClick={onClose}>×</button>
            
            <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to access your bookings</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
                <label>Email Address</label>
                <input 
                type="email" 
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required 
                />
            </div>

            <div className="input-group">
                <label>Password</label>
                <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required 
                />
            </div>

            <div className="form-actions">
                <label className="checkbox-container">
                <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
                </label>
                <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
                Sign In
            </button>
            </form>

            <div className="divider">
            <span>Or continue with</span>
            </div>

            <button className="google-btn">
            <span className="google-icon">G</span> Google
            </button>

            <p className="signup-prompt">
            Don't have an account? 
            <button className="link-btn" onClick={onSwitchToSignup}> Sign up</button>
            </p>
        </div>
        </div>
    )
}