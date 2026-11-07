import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function AppLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = (v) => {
        setIsSidebarOpen(v)
    }

    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <div className="flex">
<Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </>
    )
}