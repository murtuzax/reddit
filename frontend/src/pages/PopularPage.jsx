import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import useAuth from "../hooks/useAuth";

export default function PopularPage() {

    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(false)

    const {accessToken} = useAuth()

    useEffect(() => {
            const fetchPosts = async () => {
                try {
                    setLoading(true)
                    const response = await fetch("http://localhost:3000/api/posts/", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    })
                    if (!response.ok) return console.log("not ok in fetching posts")
    
                    const data = await response.json()
    
                    setPosts(data.data)
    
                    console.log(data)
    
                } catch (error) {
                    console.log(error)
                }
                finally {
                    setLoading(false)
                }
            }
                fetchPosts()
        }, [])

    return (
        <div>
            <h1 className="font-bold text-xl mb-4">Popular</h1>
            <div>
                {posts && posts.map((post) => (
                    <PostCard key={post.id} title={post.title} body={post.body}/>
                ))}
            </div>
        </div>
    )
}