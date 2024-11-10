import { NavLink } from 'react-router-dom';
import { Calendar, Bot } from 'lucide-react';
import ProfileAvatar from "../components/ProfileAvatar";
import { Button } from "../components/ui/button"; // Assuming you have a custom Button component

const Sidebar = () => {
    return (
        <nav className="relative flex lg:flex-col items-center justify-between p-3 lg:p-2 lg:py-12 bg-sidebar-default text-sidebar-foreground border-r lg:order-first dark:bg-sidebar-dark dark:text-sidebar-dark-foreground">
            {/* LOGO */}
            <a className="w-8 h-8 flex justify-center mb-4">
                <Bot className="w-10 h-10" />
            </a>

            <div className="flex flex-col items-center justify-center lg:my-12 lg:px-3 lg:pb-12 lg:border-b-2 lg:border-sidebar-border lg:border-opacity-10">
                <ul className="flex lg:flex-col items-center justify-center lg:justify-center gap-6 w-2/3 lg:w-auto">
                    <li className="hidden lg:block">
                        <NavLink
                            to="/calendar"
                            className={({ isActive }) =>
                                `w-8 h-8 flex items-center justify-center rounded-xs transition-all duration-200 
                                ${isActive ? 'bg-primary text-buttonText' : 'bg-secondary text-textDark'} 
                                hover:bg-primary hover:text-buttonText`
                            }
                        >
                            <Calendar className="w-5 h-5" />
                        </NavLink>
                    </li>
                </ul>

                <ProfileAvatar />
            </div>
        </nav>
    );
};

export default Sidebar;
