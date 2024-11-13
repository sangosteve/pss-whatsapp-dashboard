import React from "react";
import Item from "./Item";

interface MenuItemProps {
    items: {
        id: string;
        title: string;
        href?: string;
        icon?: JSX.Element;
        subItems?: { id: string; title: string; href: string }[];
    }[];
}

const MenuItem: React.FC<MenuItemProps> = ({ items }) => {
    return (
        <ul className="pt-10 text-md font text-zinc-700 font-medium">
            {items.map((item) => (
                <Item key={item.id} item={item} />
            ))}
        </ul>
    );
};

export default MenuItem;
