import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUser } from 'react-icons/lu';
import Modal from '../Modal';
import AvatarGroup from '../AvatarGroup';

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      
      // Debug the response structure
      console.log('API Response:', response);
      
      // Handle different response structures
      const users = response.data?.data || response.data || [];
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users when modal opens
  useEffect(() => {
    if (isModalOpen) {
      getAllUsers();
    }
  }, [isModalOpen]);

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // Standardize to use _id everywhere
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id || user.id))
    .map((user) => user.profileImageUrl);

  // Initialize tempSelectedUsers with current selections
  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers, isModalOpen]);

  return (
    <div className='space-y-4 mt-2'>
      {selectedUserAvatars.length === 0 && (
        <button 
          className='card-btn' 
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <LuUser className='text-sm' /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        {isLoading ? (
          <div className="p-4 text-center">Loading users...</div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">{error}</div>
        ) : allUsers.length === 0 ? (
          <div className="p-4 text-center">No users found</div>
        ) : (
          <>
            {allUsers.map((user) => (
              <div key={user._id || user.id} className="flex items-center gap-4 p-3 border-b border-gray-200">
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className='text-[13px] text-gray-500'>{user.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id || user.id)}
                  onChange={() => toggleUserSelection(user._id || user.id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                />
              </div>
            ))}

            <div className="flex justify-end gap-4 pt-4">
              <button 
                className="card-btn" 
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                CANCEL
              </button>
              <button 
                className="card-btn-fill" 
                onClick={handleAssign}
                type="button"
              >
                DONE
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SelectUsers;