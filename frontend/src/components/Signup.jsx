import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, X, User, Briefcase, Loader } from 'lucide-react';
import { guestSignupSchema, partnerSignupSchema } from '../lib/validations';
import { useAuthStore } from '../store/authStore';
import { toastService } from '../lib/toast';

export default function Signup({ onClose, onSwitchToLogin }) {
  const maxDate = new Date().toISOString().split("T")[0];
  const [isPartner, setIsPartner] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isLoading } = useAuthStore();

  const validationSchema = isPartner ? partnerSignupSchema : guestSignupSchema;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data, isPartner);
      toastService.success('Account created! Please log in.');
      reset();
      onSwitchToLogin();
    } catch (err) {
      toastService.error(err.message || 'Failed to create account');
    }
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
            type="button"
          >
            <User size={16} /> Guest
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${isPartner ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setIsPartner(true)}
            type="button"
          >
            <Briefcase size={16} /> Partner
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">{isPartner ? "Become a Host Partner" : "Join Good Innez today!"}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Row 1: Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">First Name</label>
              <input 
                type="text" 
                placeholder="John" 
                className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
                {...register('firstName')}
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Last Name</label>
              <input 
                type="text" 
                placeholder="Doe" 
                className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
                {...register('lastName')}
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+63 234 567 890" 
              className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
              {...register('phone')}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {!isPartner && (
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Address</label>
              <input 
                type="text" 
                placeholder="123 Main St, City" 
                className={`w-full bg-white/5 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
                {...register('address')}
              />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
            </div>
          )}

          {/* Date & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Date of Birth</label>
              <input 
                type="date" 
                className={`w-full bg-white/5 border ${errors.dateOfBirth ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
                max={maxDate}
                {...register('dateOfBirth')}
              />
              {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
                {...register('email')}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Min 8 chars, 1 uppercase, 1 number" 
                className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors pr-10`}
                {...register('password')}
              />
              <button 
                type="button" 
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Re-enter password" 
                className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors pr-10`}
                {...register('confirmPassword')}
              />
              <button 
                type="button" 
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader size={20} className="animate-spin" />}
            {isPartner ? "Register as Partner" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? 
          <button className="text-gold font-bold hover:underline ml-1" onClick={onSwitchToLogin}>Log in</button>
        </p>
      </div>
    </div>
  );
}