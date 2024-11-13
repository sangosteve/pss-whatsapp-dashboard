import React from "react";
import { Search as SearchIcon } from "lucide-react";
const Search = () => {
    return (
        <div className="w-full bg-inherit relative rounded-md">
            <input
                className="bg-gray-800 h-8 mt-8 text-xs rounded-sm px-6 placeholder:px-4"
                placeholder="Search for item..."
            />
            <SearchIcon size={14} className="absolute top-10 left-2 text-gray-500 " />
        </div>
    );
};

export default Search;