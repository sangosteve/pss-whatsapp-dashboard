// components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Threads from './Threads';
import Sidebar from "./Sidebar/Sidebar"

const MainLayout: React.FC = () => {
    return (
        <div className='w-full min-h-screen flex flex-col lg:flex-row'>
            <Sidebar />
            {/* <Threads /> */}
            <main className='flex flex-grow'>
                <Outlet />
            </main>


        </div>
    );
};

export default MainLayout;
