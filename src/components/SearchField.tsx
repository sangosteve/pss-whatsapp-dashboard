// src/components/SearchField.tsx

import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { X, Search } from 'lucide-react';

interface SearchFieldProps {
    placeholder?: string;
    onChange: (value: string) => void;
    value?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
    placeholder = "Search...",
    onChange,
    value = "",
}) => {
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    const handleClear = () => {
        setInputValue("");
        onChange("");
    };

    return (
        <div className="relative flex items-center w-full">
            <Search className="absolute left-3 text-zinc-400" />
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="pl-10 pr-10"
            />
            {inputValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X />
                </button>
            )}
        </div>
    );
};

export default SearchField;
