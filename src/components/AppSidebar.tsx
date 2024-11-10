import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { ArchiveX, Calendar, Command, Home, Inbox, MessageCircle, Search, Send, Settings, Trash2 } from "lucide-react"
import React from "react"
import { Label } from "./ui/label"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            {
                title: "Inbox",
                url: "/",
                icon: Inbox,
                isActive: true,
            },
            {
                title: "Drafts",
                url: "#",
                icon: Settings,
                isActive: false,
            },
            {
                title: "Sent",
                url: "#",
                icon: Send,
                isActive: false,
            },
            {
                title: "Junk",
                url: "#",
                icon: ArchiveX,
                isActive: false,
            },
            {
                title: "Trash",
                url: "#",
                icon: Trash2,
                isActive: false,
            },
        ],
        mails: [
            {
                name: "William Smith",
                email: "williamsmith@example.com",
                subject: "Meeting Tomorrow",
                date: "09:34 AM",
                teaser:
                    "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
            },
            {
                name: "Alice Smith",
                email: "alicesmith@example.com",
                subject: "Re: Project Update",
                date: "Yesterday",
                teaser:
                    "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
            },
            {
                name: "Bob Johnson",
                email: "bobjohnson@example.com",
                subject: "Weekend Plans",
                date: "2 days ago",
                teaser:
                    "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
            },
            {
                name: "Emily Davis",
                email: "emilydavis@example.com",
                subject: "Re: Question about Budget",
                date: "2 days ago",
                teaser:
                    "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
            },
            {
                name: "Michael Wilson",
                email: "michaelwilson@example.com",
                subject: "Important Announcement",
                date: "1 week ago",
                teaser:
                    "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
            },
            {
                name: "Sarah Brown",
                email: "sarahbrown@example.com",
                subject: "Re: Feedback on Proposal",
                date: "1 week ago",
                teaser:
                    "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
            },
            {
                name: "David Lee",
                email: "davidlee@example.com",
                subject: "New Project Idea",
                date: "1 week ago",
                teaser:
                    "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
            },
            {
                name: "Olivia Wilson",
                email: "oliviawilson@example.com",
                subject: "Vacation Plans",
                date: "1 week ago",
                teaser:
                    "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
            },
            {
                name: "James Martin",
                email: "jamesmartin@example.com",
                subject: "Re: Conference Registration",
                date: "1 week ago",
                teaser:
                    "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
            },
            {
                name: "Sophia White",
                email: "sophiawhite@example.com",
                subject: "Team Dinner",
                date: "1 week ago",
                teaser:
                    "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
            },
        ],
    }
    const [activeItem, setActiveItem] = React.useState(data.navMain[0])
    const [mails, setMails] = React.useState(data.mails)
    const { setOpen } = useSidebar()
    return (


        <Sidebar
            collapsible="none"
            className="w-[56px] border-r flex items-center shadow-md"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>

                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="px-1.5 md:px-0">
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {/* <SidebarMenuButton
                                            tooltip={{
                                                children: item.title,
                                                hidden: false,
                                            }}
                                            onClick={() => {
                                                setActiveItem(item)
                                                const mail = data.mails.sort(() => Math.random() - 0.5)
                                                setMails(
                                                    mail.slice(
                                                        0,
                                                        Math.max(5, Math.floor(Math.random() * 10) + 1)
                                                    )
                                                )
                                                setOpen(true)
                                            }}
                                            isActive={activeItem.title === item.title}
                                            className="px-2.5 md:px-2"
                                        > */}
                                    <a href={item?.url}>
                                        <item.icon className="w-5 h-5" />
                                        {/* <span>{item.title}</span> */}
                                    </a>
                                    {/* </SidebarMenuButton> */}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* <NavUser user={data.user} /> */}
            </SidebarFooter>
        </Sidebar>



    )
}