// components/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="w-full min-h-screen">
            <div className="w-full min-h-full">
                <Outlet /> {/* Renders child routes like Login, Register */}
            </div>
        </div>
    );
};

export default AuthLayout;
