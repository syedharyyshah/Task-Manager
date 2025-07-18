import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option.value);  // Changed to pass just the value
        setIsOpen(false);
    };

    // More robust selected option finding
    const selectedOption = options.find(opt => 
        String(opt.value) === String(value)
    );
    const selectedOptionLabel = selectedOption?.label || '';

    return (
        <div className='relative w-full'>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className='w-full text-sm text-black outline-none bg-white border border-slate-200 px-3 py-2.5 rounded-md mt-1 flex dark:hover:bg-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 justify-between items-center hover:border-slate-300 transition-colors'
            >
                {selectedOption ? selectedOption.label : placeholder}
                <LuChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg z-10  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 overflow-hidden">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className={`px-3 py-2 text-sm cursor-pointer  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-500 dark:text-gray-200 hover:bg-slate-50 ${
                                String(option.value) === String(value) ? 'bg-slate-100' : ''
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;