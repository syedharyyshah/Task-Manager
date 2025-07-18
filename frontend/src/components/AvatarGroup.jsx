import React from 'react'

const AvatarGroup = ({ avatars, maxVisible =3}) => {
    return (
      <div className="flex items-center">
        {avatars.slice(0, maxVisible).map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index}`}
            className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
          />
        ))}
        {avatars.length > maxVisible && (
          <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 -ml-3 flex  font-medium">
            +{avatars.length - maxVisible}
          </div>
        )}
      </div>
    );
  };

export default AvatarGroup
