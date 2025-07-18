import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Task from "../../src/assets/Task.jpeg"

const Welcome = () => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: 'easeOut', 
        staggerChildren: 0.3,
        when: "beforeChildren"
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.2, 0.65, 0.3, 0.9] 
      } 
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
    tap: { 
      scale: 0.98,
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 }, 
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.4 }
    }
  };

  const testAccountVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Section: Text and Buttons */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            variants={childVariants}
          >
            Welcome to TaskMaster
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-blue-50 mb-6 font-medium"
            variants={childVariants}
          >
            Streamline your workflow, assign tasks, and track progress with ease.
            <br className="hidden md:block" /> Your future of productivity starts here.
          </motion.p>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            variants={testAccountVariants}
          >
            <p className="text-sm md:text-base text-blue-100 font-medium">
              <span className="font-bold text-white">For testing:</span>
              <br />
              <span className="inline-block mt-1">
                Admin: <span className="font-mono">hashir@gmail.com</span> | <span className="font-mono">12345678</span>
              </span>
              <br />
              <span className="inline-block">
                User: <span className="font-mono">mirha@gmail.com</span> | <span className="font-mono">12345678</span>
              </span>
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
            variants={childVariants}
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <motion.button
                className="w-full px-5 py-2 bg-indigo-600  cursor-pointer hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Get Started
              </motion.button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <motion.button
                className="w-full px-5 py-2 bg-white/10 cursor-pointer backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Log In
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right Section: Image */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          variants={imageVariants}
          whileHover="hover"
        >
          <img
            src={Task}
            alt="Task Management Illustration"
            className="w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/20"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;