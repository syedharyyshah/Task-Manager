import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Update the image state
            setImage(file);

            // Generate preview URL from the file
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        // Revoke the object URL to avoid memory leaks
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-6'>
            <input
                type='file'
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />
            {!image ? (
                <div className='relative'>
                    <div className='w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full cursor-pointer'>
                        <LuUser className='text-4xl text-primary' />
                    </div>
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        onClick={onChooseFile}
                    >
                        <LuUpload size={16} />
                    </button>
                </div>
            ) : (
                <div className='relative group'>
                    <img
                        src={previewUrl}
                        alt='profile preview'
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-red-600 transition-colors'
                        onClick={handleRemoveImage}
                    >
                        <LuTrash size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;