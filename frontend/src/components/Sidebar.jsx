import { HomeIcon, Lens, PlusIcon, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading"

export default function Sidebar({isSidebarOpen}) {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false)

    const {accessToken} = useAuth()

    const handleCommunitySubmit = async () => {
        if (!name || !description || !slug) {
            return window.alert("Inputs are empty")
        }

        try {
            setLoading(true)
            const response = await fetch("http://localhost:3000/api/communities/", {
                method: "POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name, description, slug })
            })
            if(!response.ok) return console.log("not ok in handlecummunitysubmit")

            const data = await response.json()

            console.log(data)

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div style={{display:isSidebarOpen ? "block" : "none" }} className="w-200 md:w-[260px] fixed md:block md:static bg-white z-10 md:z-1 px-5 py-4 border-r border-r-border h-screen overflow-auto">
                <div className="flex flex-col gap-2">
                    <NavLink to={"/"} className={({ isActive }) => `flex items-center gap-2 text-sm p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                        <HomeIcon size={20} /> Home
                    </NavLink>
                    <NavLink to={"/popular"} className={({ isActive }) => `flex items-center gap-2 text-sm p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                        <TrendingUp size={20} /> Popular
                    </NavLink>
                    <NavLink to={"/explore"} className={({ isActive }) => `flex items-center gap-2 text-sm p-2 rounded-sm ${isActive ? `bg-elevated` : ``}`}>
                        <Lens size={20} /> Explore
                    </NavLink>
                    <button onClick={() => setIsModalOpen(true)} className={`flex items-center gap-2 text-sm p-2 rounded-sm cursor-pointer`}>
                        <PlusIcon size={20} /> Start a community
                    </button>
                </div>
            </div>
            {isModalOpen && <div className="fixed inset-0 z-10 bg-black/10 backdrop-blur-xs flex items-center justify-center">
                <div className="bg-white w-[560px] p-4 rounded-sm relative">
                    <h2 className="text-xl font-semibold mb-2">
                        Tell us about your community</h2>
                    <div className="font-light text-sm">A name and description help people understand what your community is all about.</div>
                    <div className="mt-8">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-4 flex-2">
                                <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Community name" className="bg-elevated p-4 rounded-xl text-sm" />
                                <input onChange={(e) => setSlug(e.target.value)} value={slug} type="text" placeholder="Community slug (can be same as name)" className="bg-elevated p-4 rounded-xl text-sm" />
                                <textarea onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder="Community description" className="bg-elevated p-4 rounded-xl text-sm" rows={6} />
                            </div>
                            <div className="flex-2 shadow-sm border border-border rounded-sm h-fit">
                                <div className="bg-elevated h-23"></div>
                                <div className="p-4">
                                    <div className="flex flex-row">
                                        <div>
                                            <svg
                                                className="text-brand"
                                                fill="currentColor"
                                                height="48"
                                                width="48"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.633 8.086c-.27 0-.536.066-.799.199a1.665 1.665 0 00-.652.596c-.173.265-.258.581-.258.948v3.961H5.999V6.321h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.547 2.547 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.091l-.774 1.848a.766.766 0 00-.244-.073 1.873 1.873 0 00-.349-.032l.001.001ZM19 10a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9Zm-1.8 0a7.17 7.17 0 00-1.661-4.594L11.98 13.79h-1.955l4.108-9.677A7.152 7.152 0 0010 2.8c-3.97 0-7.2 3.23-7.2 7.2s3.23 7.2 7.2 7.2 7.2-3.23 7.2-7.2Z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col gap-0">
                                            <p className="text-md">{!name ? "r/communityname" : `r/${name}`}</p>
                                            <span className="text-sm">1 weekly visitor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button disabled={loading} onClick={handleCommunitySubmit} className="hover:bg-brand-hover cursor-pointer transition-colors bg-brand mt-4 self-end text-sm text-bg py-2 px-4 rounded-sm text-md">{loading ? <Loading/> : "Create a community"}</button>
                        </div>
                    </div>
                    <div onClick={() => setIsModalOpen(false)} className="p-2 cursor-pointer bg-elevated w-fit rounded-full absolute top-4 right-4"><X size={20} /></div>
                </div>
            </div>}
        </>
    )
}