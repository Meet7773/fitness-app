import React from 'react';
import { UserCircle, Zap } from 'lucide-react';
import { auth } from '../api/firebase';

const GoogleIcon = () => (
    <svg className="w-5 h-5" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.8 110.1 20 244 20c69.1 0 125.3 27.6 172.4 72.4l-66 66C314.6 118.5 282.5 102 244 102c-83.2 0-151.2 67.5-151.2 150.9s68 150.9 151.2 150.9c97.1 0 134.4-65.1 140.1-101.6H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);

export default function LoginScreen({ onGoogleSignIn }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans p-4">
            <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full">
                 <div className="flex items-center gap-3 justify-center mb-4">
                    <Zap className="w-10 h-10 text-cyan-400" />
                    <h1 className="text-3xl font-bold text-white tracking-tight">FitQuest</h1>
                </div>
                <UserCircle className="w-20 h-20 text-gray-600 mx-auto my-6" />
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-gray-400 mb-8">Sign in to continue your fitness journey.</p>
                <button 
                    onClick={onGoogleSignIn}
                    className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:bg-gray-200"
                >
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}
