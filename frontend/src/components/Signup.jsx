import { useState } from 'react'
import { api } from '../services/api'
import './Login.css' 

export default function Signup({ onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agreedToTerms: false
    })

    // NEW STATE
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!formData.agreedToTerms) {
            alert('You must agree to the Terms of Service and Privacy Policy.')
            return
        }

        api.registerGuest(formData)
            .then((response) => {
                console.log('Guest created:', response)
                alert('Account created successfully! Please log in.')
                onSwitchToLogin() 
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
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                            
                            <button 
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    // --- EYE OPEN ICON (SVG) ---
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ) : (
                                    // --- EYE CLOSED/SLASH ICON (SVG) ---
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

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