import { useState } from 'react';
import { api } from '../services/api';
import { Eye, EyeOff, X, User, Briefcase } from 'lucide-react';

export default function Signup({ onClose, onSwitchToLogin }) {
    const maxDate = new Date().toISOString().split("T")[0];
    
    // Toggle States
    const [isPartner, setIsPartner] = useState(false); // Guest vs Partner
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'dateOfBirth' && value.length > 10) return;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!formData.agreedToTerms) {
            alert('You must agree to the Terms of Service.');
            return;
        }

        // 2. Select API based on Role
        const registerCall = isPartner ? api.registerEmployee : api.registerGuest;

        // 3. Submit
        registerCall(formData)
            .then(() => {
                alert('Account created! Please log in.');
                onSwitchToLogin(); 
            })
            .catch((error) => {
                alert(error.message || 'Failed to create account.');
            });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                
                <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" onClick={onClose}>
                    <X size={24} />
                </button>
                
                {/* --- ROLE TOGGLE --- */}
                <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                    <button 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!isPartner ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setIsPartner(false)}
                    >
                        <User size={16} /> Guest
                    </button>
                    <button 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${isPartner ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setIsPartner(true)}
                    >
                        <Briefcase size={16} /> Partner
                    </button>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">{isPartner ? "Become a Host Partner" : "Join Good Innez today!"}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Row 1: Names */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">First Name</label>
                            <input type="text" name="firstName" placeholder="John" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Last Name</label>
                            <input type="text" name="lastName" placeholder="Doe" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-1">Phone Number</label>
                        <input type="tel" name="phone" placeholder="+63 234 567 890" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-1">Address</label>
                        <input type="text" name="address" placeholder="123 Main St, City" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors" value={formData.address} onChange={handleChange} required />
                    </div>

                    {/* Date & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Date of Birth</label>
                            <input type="date" name="dateOfBirth" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors" value={formData.dateOfBirth} onChange={handleChange} max={maxDate} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Email Address</label>
                            <input type="email" name="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                placeholder="Minimum 8 characters" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors pr-10" 
                                value={formData.password} 
                                onChange={handleChange} 
                                minLength="8" 
                                required 
                            />
                            <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword" 
                                placeholder="Re-enter password" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-colors pr-10" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                minLength="8" 
                                required 
                            />
                            <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-white" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            name="agreedToTerms" 
                            id="terms"
                            checked={formData.agreedToTerms} 
                            onChange={handleChange}
                            className="w-4 h-4 accent-gold cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer select-none">
                            I agree to the <span className="text-gold hover:underline">Terms & Policy</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors mt-2">
                        {isPartner ? "Register as Partner" : "Sign Up"}
                    </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-sm">Or continue with</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <span className="font-bold text-lg">G</span> Google
                </button>

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Already have an account? 
                    <button className="text-gold font-bold hover:underline ml-1" onClick={onSwitchToLogin}>Log in</button>
                </p>
            </div>
        </div>
    );
}