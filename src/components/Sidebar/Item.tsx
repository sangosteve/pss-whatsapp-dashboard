import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SubMenu from "./SubMenu";

interface ItemProps {
    item: {
        id: string;
        title: string;
        href?: string;
        icon?: JSX.Element;
        subItems?: { id: string; title: string; href: string }[];
    };
}

const Item: React.FC<ItemProps> = ({ item }) => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            <li
                className={`flex items-center justify-between px-4 py-2 rounded-md text-md text-zinc-700 capitalize cursor-pointer 
        ${item.href === location.pathname ? "bg-green-50 text-green-900" : "hover:bg-green-50"} 
        ${item.href === location.pathname ? "" : "hover:text-green-900"}`}
                onClick={() => setOpen(!open)}
            >
                {item.href ? (
                    <Link to={item.href} className="flex items-center w-full">
                        {item.icon && <span className={`flex-shrink-0 ${item.href === location.pathname ? "text-green-900" : ""}`}>{item.icon}</span>}
                        <p className={`ml-2 text-md ${item.href === location.pathname ? "text-green-900" : ""}`}>{item.title}</p>
                    </Link>
                ) : (
                    <div className="flex items-center">
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <p className="ml-2 text-md">{item.title}</p>
                    </div>
                )}

                {item.subItems && (
                    <ChevronDownIcon
                        className={`transition-transform duration-300 ease-in-out transform ${open ? "rotate-180" : ""
                            } w-5 h-5 text-zinc-500`}
                    />
                )}
            </li>

            {item.subItems && <SubMenu items={item.subItems} open={open} />}
        </>
    );
};

export default Item;
