import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, X, Briefcase, User, Loader } from 'lucide-react';
import { loginSchema } from '../lib/validations';
import { useAuthStore } from '../store/authStore';
import { toastService } from '../lib/toast';

export default function Login({ onClose, onSwitchToSignup, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const { login, isLoading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data, isPartner);
      toastService.success(`Welcome back, ${user.firstName}!`);
      onLoginSuccess(user);
    } catch (err) {
      toastService.error(err.message || 'Login failed');
    }
  };

    return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}><X size={24}/></button>
        
        {/* Toggle Switch */}
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
          <h2 className="text-3xl font-bold text-white mb-2">{isPartner ? "Partner Portal" : "Welcome Back"}</h2>
          <p className="text-gray-400">{isPartner ? "Manage your properties" : "Login to access your bookings"}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="email@example.com"
              className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors`}
              {...register('email')}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-white outline-none focus:border-gold transition-colors pr-10`}
                {...register('password')}
              />
              <button 
                type="button" 
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader size={20} className="animate-spin" />}
            {isPartner ? "Login to Dashboard" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">Don't have an account? <button className="text-gold font-bold hover:underline" onClick={onSwitchToSignup}>Sign up</button></p>
        </div>
    </div>
    );
}