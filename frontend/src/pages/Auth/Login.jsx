import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import AuthLayouts from '../../components/layouts/AuthLayouts';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {updateUser}=useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }
  
    // API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      
      const { token, role, profileImageUrl } = response.data;
      updateUser(response.data);
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        if (profileImageUrl) {
          localStorage.setItem("profileImage", profileImageUrl);
        }

        // Redirect based on role
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || 
          "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayouts>
      <motion.div 
        className='lg:w-[70%] h-full flex flex-col justify-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h3 
          className='text-xl font-semibold text-black'
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Welcome Back
        </motion.h3>
        
        <motion.p 
          className='text-sm text-slate-700 mt-1 mb-6'
          initial={{ y: -5 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Please enter your details to log in.
        </motion.p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <motion.div 
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Email"
              type="email"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </motion.button>

          <motion.p 
            className='text-[13px] text-slate-800 mt-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Don't have an account?{" "}
            <Link className='font-medium cursor-pointer text-primary underline' to="/signup">
              Sign Up
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayouts>
  );
};

export default Login;