import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileAvatar = () => {
    const [user, setUser] = useState<any>(null); // State to store user details
    const [isMobile, setIsMobile] = useState(false); // Adjust dropdown for mobile view
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user details from your API or localStorage
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token"); // Get token from localStorage
            if (token) {
                try {
                    const response = await fetch("http://localhost:4000/api/user", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`, // Attach token for authenticated request
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data); // Set the user data in state
                    } else {
                        // Handle error or redirect to login if token is invalid
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            } else {
                navigate("/login"); // Redirect to login if no token found
            }
        };

        fetchUserDetails();
    }, [navigate]);

    if (!user) {
        return null; // Or a loading state (e.g., <LoadingSpinner />)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    {/* <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                    </div> */}

                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="start"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    localStorage.removeItem("token"); // Clear token from localStorage
                    navigate("/login"); // Redirect to login page
                }}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileAvatar;
