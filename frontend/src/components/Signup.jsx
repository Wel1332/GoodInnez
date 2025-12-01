import { useState, useEffect } from 'react'
import { api } from '../services/api'
import './Login.css' 

export default function Signup({ onClose, onSwitchToLogin, isPartnerFlow }) {
    const maxDate = new Date().toISOString().split("T")[0];
    
    // Initialize toggle based on flow
    const [isPartner, setIsPartner] = useState(isPartnerFlow);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '', address: '',
        dateOfBirth: '', email: '', password: '', agreedToTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)

    // Sync state if prop changes
    useEffect(() => {
        setIsPartner(isPartnerFlow);
    }, [isPartnerFlow]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name === 'dateOfBirth' && value.length > 10) return;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.agreedToTerms) {
            alert('You must agree to the Terms of Service.')
            return
        }
        
        // Choose correct API call
        const registerCall = isPartner 
            ? api.registerEmployee(formData) 
            : api.registerGuest(formData);

        registerCall
            .then(() => {
                alert(isPartner ? 'Partner account created! Please log in.' : 'Account created! Please log in.')
                onSwitchToLogin() 
            })
            .catch((error) => {
                alert(error.message || 'Failed to create account.')
            })
    }

    return (
        <div className="login-overlay">
            <div className="login-glass-card">
                <button className="close-btn" onClick={onClose}>×</button>
                
                <div className="login-header">
                    {/* Dynamic Header */}
                    <h2>{isPartner ? "Become a Partner" : "Create Account"}</h2>
                    <p>{isPartner ? "Start hosting with Good Innez" : "Join Good Innez today!"}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    
                    <div className="name-row">
                        <div className="input-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" placeholder="John"
                                value={formData.firstName} onChange={handleChange} required 
                            />
                        </div>
                        <div className="input-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" placeholder="Doe"
                                value={formData.lastName} onChange={handleChange} required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" placeholder="+1 234 567 890"
                            value={formData.phone} onChange={handleChange} required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Address</label>
                        <input type="text" name="address" placeholder="123 Main St, City"
                            value={formData.address} onChange={handleChange} required 
                        />
                    </div>

                    <div className="input-group">
                            <label>Date of Birth</label>
                            <input 
                                type="date" 
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                max={maxDate} 
                                required 
                            />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="email@example.com"
                            value={formData.email} onChange={handleChange} required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                minLength="8"
                                required 
                            />
                            <button 
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="form-actions-full">
                        <label className="checkbox-container">
                            <input type="checkbox" name="agreedToTerms"
                                checked={formData.agreedToTerms} onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            I agree to the Terms & Policy
                        </label>

                        {/* Only show this checkbox if user came from 'Sign Up', not 'Become a Partner' */}
                        {!isPartnerFlow && (
                            <div style={{marginTop: '10px'}}>
                                <label className="checkbox-container" style={{color: '#CCA43B'}}>
                                    <input 
                                        type="checkbox" 
                                        checked={isPartner} 
                                        onChange={(e) => setIsPartner(e.target.checked)} 
                                    />
                                    <span className="checkmark"></span>
                                    Sign up as a Host/Partner
                                </label>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="login-btn">
                        {isPartner ? "Register as Partner" : "Sign Up"}
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