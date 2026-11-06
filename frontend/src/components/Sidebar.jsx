import { HomeIcon, Lens, PlusIcon, TrendingUp, ZoomIn } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-[220px] px-5 py-4 border-r border-r-border h-screen overflow-y-scroll">
            <div className="flex flex-col gap-2">
                <NavLink to={"/"} className={({ isActive }) => `flex items-center gap-2 text-md p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                    <HomeIcon size={20} /> Home
                </NavLink>
                <NavLink to={"/popular"} className={({ isActive }) => `flex items-center gap-2 text-md p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                    <TrendingUp size={20} /> Popular
                </NavLink>
                <NavLink to={"/explore"} className={({ isActive }) => `flex items-center gap-2 text-md p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                    <Lens size={20} /> Explore
                </NavLink>
                <NavLink to={"/n"} className={({ isActive }) => `flex items-center gap-2 text-md p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                    <PlusIcon size={20} /> Stat a community
                </NavLink>
            </div>
        </div>
    )
}