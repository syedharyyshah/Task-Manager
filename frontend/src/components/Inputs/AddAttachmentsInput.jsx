import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({ attachments = [], setAttachments }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()]);
            setOption("");
        }
    };

    const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddOption();
        }
    };

    return (
        <div className="space-y-3">
            {/* Existing Attachments List */}
            {attachments.map((item, index) => (
                <div 
                    key={`${item}-${index}`}
                    className="flex justify-between  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200  items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-md"
                > 
                    <div className="flex-1 flex items-center gap-3 ">
                        <LuPaperclip className="text-gray-400" />
                        <p className="text-xs dark:text-gray-50 text-black truncate">{item}</p>
                    </div>

                    <button
                        className="cursor-pointer hover:bg-gray-100 p-1  rounded"
                        onClick={() => handleDeleteOption(index)}
                        aria-label="Delete attachment"
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            {/* Add New Attachment Input */}
            <div className="flex items-center gap-2  mt-2">
                <div className="flex items-center border  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200  border-gray-100 rounded-l-md px-3 py-2 bg-gray-50">
                    <LuPaperclip className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Add File Link"
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-sm text-black  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400;
                } outline-none bg-white border-t border-b border-gray-100 px-3 py-2"
                />
                <button 
                    className="card-btn text-nowrap"
                    onClick={handleAddOption}
                >
                    <HiMiniPlus className="text-lg" />
                    <span>Add</span>
                </button>
            </div>
        </div>
    );
};

export default AddAttachmentsInput;