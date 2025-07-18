import React from 'react';
import { motion } from 'framer-motion';
import UI_IMG from "../../assets/images/auth-img.png";

const AuthLayouts = ({ children }) => {
  return (
    <motion.div 
      className='flex'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Panel (Form Content) */}
      <motion.div 
        className='w-full h-screen md:w-[60vw] px-6 md:px-12 pt-8 pb-12'
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.h2 
          className='text-lg font-medium text-black'
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          Task Manager
        </motion.h2>
        {children}
      </motion.div>

      {/* Right Panel (Image) */}
      <motion.div 
        className='hidden md:flex w-[40vw] h-screen bg-blue-200 bg-cover bg-no-repeat bg-center overflow-hidden p-8'
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <motion.img 
          src={UI_IMG} 
          alt="Task Manager UI" 
          className="w-64 lg:w-[90%] object-contain mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AuthLayouts;