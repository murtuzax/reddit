import { useEffect, useState } from "react";
import CommunityCard from "../components/CommunityCard";
import useAuth from "../hooks/useAuth";

export default function ExplorePage() {

    const [communities, setCommunities] = useState(null)
    const [loading, setLoading] = useState(false)

    const {accessToken} = useAuth()

    useEffect(() => {
        if (!accessToken) return;
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
        fetchCommunities()
    }, [accessToken])


    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Explore Communities</h1>
            <div className="grid grid-cols-3 gap-2">
                {communities && communities.map((c) => {
                    return <CommunityCard key={c.id} name={c.name} description={c.description} slug={c.slug} />
                })}
            </div>
        </div>
    )
}