import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const Navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "admin123") {
            alert("Login Successful 🚀");

            Navigate('/dashboard')
            
            setError("");
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                // Increased max-width and internal padding
                className="bg-white/10 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white/20"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    // Larger title
                    className="text-4xl font-extrabold text-white text-center mb-10"
                >
                    Welcome Back 👋
                </motion.h2>

                <form onSubmit={handleLogin} className="space-y-8">
                    {/* Username */}
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-gray-300" size={24} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            // Increased height and text size
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-300" size={24} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Increased height and text size
                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/15 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                        />
                        <div
                            className="absolute right-4 top-4 text-gray-300 cursor-pointer hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-md text-center font-medium"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        // Larger button with more padding and bigger font
                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold"
                    >
                        Login
                    </motion.button>
                </form>

                {/* Footer */}
                <p className="text-gray-400 text-sm text-center mt-10">
                    Use <span className="text-emerald-400 font-mono">admin</span> / <span className="text-emerald-400 font-mono">admin123</span>
                </p>
            </motion.div>
        </div>
    );
}