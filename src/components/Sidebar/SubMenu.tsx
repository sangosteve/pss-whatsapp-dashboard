import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SubMenuProps {
    items: { id: string; title: string; href: string }[];
    open: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, open }) => {
    const location = useLocation();

    return (
        <ul
            className={`${open ? "max-h-[500px]" : "max-h-0"
                } bg-zinc-50 rounded-md px-2 my-1 overflow-hidden transition-[max-height] duration-500 ease-in-out`}
        >
            {items.map((item) => (
                <li key={item.id} className="my-2 px-8 py-2 hover:bg-zinc-200 hover:cursor-pointer rounded-md">
                    <Link
                        to={item.href}
                        className={`w-full h-full ${item.href === location.pathname ? "text-emerald-600" : ""}`}
                    >
                        {item.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default SubMenu;
