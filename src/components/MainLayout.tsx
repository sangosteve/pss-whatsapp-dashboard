// components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Threads from './Threads';
import Sidebar from "./Sidebar"

const MainLayout: React.FC = () => {
    return (
        <div className='w-full min-h-screen flex flex-col lg:flex-row'>

            <Threads />
            <main className='flex flex-grow'>
                <Outlet />
            </main>
            <Sidebar />

        </div>
    );
};

export default MainLayout;
