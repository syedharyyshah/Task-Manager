import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === 'logout') {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
    return () => {};
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white dark:bg-gray-800 border-r border-gray-200/50 dark:border-gray-700/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl || ''}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 dark:bg-gray-600 rounded-full"
          />
        </div>

        {user?.role === 'admin' && (
          <div className="text-[10px] font-medium text-white bg-primary dark:bg-primary-dark px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 dark:text-white font-medium leading-6 mt-3">{user?.name || ''}</h5>
        <p className="text-[12px] text-gray-500 dark:text-gray-400">{user?.email || ''}</p>

        {/* Theme Toggle Icon */}
        <button
          onClick={toggleTheme}
          className="mt-2 rounded-full cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <FiMoon className="text-3xl text-yellow-300" />
          ) : (
            <FiSun className="text-3xl text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? 'text-primary dark:text-primary-dark bg-linear-to-r from-blue-50/40 to-blue-100/50 dark:from-gray-700 dark:to-gray-600 border-r-3'
              : 'text-gray-700 dark:text-gray-300'
          } py-3 px-6 mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;