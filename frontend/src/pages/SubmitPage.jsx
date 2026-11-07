import { X } from "lucide-react"
import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import CommunityCard from "../components/CommunityCard"
import Loading from "../components/Loading"

export default function SubmitPage() {

    const [communityModalOpen, setCommunityModalOpen] = useState(false)
    const [communities, setCommunities] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const [community, setCommunity] = useState("")
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    const { accessToken } = useAuth()

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                setLoading(true)
                const response = await fetch("http://localhost:3000/api/communities/", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                if (!response.ok) return console.log("not ok in fetching commoni")

                const data = await response.json()

                setCommunities(data.data)

                console.log(data)

            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        if (communityModalOpen && communities === null) {
            fetchCommunities()
        }
    }, [communityModalOpen])


    const handlePostSubmit = async () => {
        if (!title || !body || !community.id) {
            return window.alert("Inputs are empty")
        }

        try {
            setLoading(true)
            const response = await fetch("http://localhost:3000/api/posts/", {
                method: "POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ title, body, community_id:community.id })
            })
            if(!response.ok) return console.log("not ok in handle post submit")

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
        <div>
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-xl font-bold mb-2">Create a post</h1>
                <div onClick={() => setCommunityModalOpen(true)} className="py-2 px-4 rounded-full border border-border w-fit cursor-pointer hover:bg-brand hover:text-white transition-colors duration-200">{community.name ? community.name : "Select A Community"}</div>
                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Title" className="w-[70%] border border-border px-4 py-2 rounded-sm" />
                <textarea onChange={(e) => setBody(e.target.value)} value={body} rows={8} type="text" placeholder="Body" className="w-[70%] border border-border px-4 py-2 rounded-sm resize-none" />
                <div className="flex justify-end w-[70%]">
                    <button onClick={handlePostSubmit} disabled={loading} className="hover:bg-brand-hover cursor-pointer transition-colors bg-brand mt-4 self-end text-sm text-bg py-2 px-4 rounded-sm text-md">{loading ? <Loading /> : "Post"}</button>
                </div>
            </div>
            {communityModalOpen && <div className="fixed inset-0 z-10 bg-black/10 backdrop-blur-xs flex items-center justify-center">
                <div className="bg-white w-[560px] p-4 rounded-sm relative">
                    <h2 className="text-xl font-semibold">
                        Chose Community</h2>

                    <div className="flex flex-col gap-4 mt-4">
                        {communities && communities.map((c) => {
                            return <div onClick={() => {
                                setCommunity(c)
                                setCommunityModalOpen(false)
                            }} key={c.id} className="shadow-sm border border-border rounded-sm h-fit cursor-pointer">
                                <div className="p-4">
                                    <div className="flex flex-row gap-2">
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
                                            <p className="text-md">{c.name}</p>
                                            <span className="text-sm text-text-secondary font-light">{c.description.slice(0, 101) + "..."}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>

                    <div onClick={() => setCommunityModalOpen(false)} className="p-2 cursor-pointer bg-elevated w-fit rounded-full absolute top-4 right-4"><X size={20} /></div>
                </div>
            </div>}
        </div>
    )
}