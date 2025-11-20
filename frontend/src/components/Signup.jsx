import { useState } from 'react'
import { api } from '../services/api' // Import the API service we created
import './Login.css' // Uses the same styling as Login

export default function Signup({ onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agreedToTerms: false
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
        
        // 1. Validation
        if (!formData.agreedToTerms) {
            alert('You must agree to the Terms of Service and Privacy Policy.')
            return
        }

        // 2. Send data to Backend via API Service
        api.registerGuest(formData)
            .then((response) => {
                console.log('Guest created:', response)
                alert('Account created successfully! Please log in.')
                onSwitchToLogin() // Switch to the Login view
            })
            .catch((error) => {
                console.error('Signup Error:', error)
                alert('Failed to create account. The email might already be in use.')
            })
    }

    return (
        <div className="login-overlay">
            <div className="login-glass-card">
                <button className="close-btn" onClick={onClose}>×</button>
                
                <div className="login-header">
                    <h2>Create Account</h2>
                    <p>Join Good Innez today!</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Full Name Input */}
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {/* Email Input */}
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

                    {/* Password Input */}
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Minimum 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            minLength="8"
                            required 
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="form-actions-full">
                        <label className="checkbox-container">
                            <input 
                                type="checkbox" 
                                name="agreedToTerms"
                                checked={formData.agreedToTerms}
                                onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            I agree to the <a href="#terms" className="forgot-link">Terms & Policy</a>
                        </label>
                    </div>

                    <button type="submit" className="login-btn">
                        Sign Up
                    </button>
                </form>

                <div className="divider">
                    <span>Or continue with</span>
                </div>

                <button className="google-btn">
                    <span className="google-icon">G</span> Google
                </button>

                <p className="signup-prompt">
                    Already have an account? 
                    <button className="link-btn" onClick={onSwitchToLogin}> Log in</button>
                </p>
            </div>
        </div>
    )
}