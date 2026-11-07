import { HeartIcon, ThumbsDown, ThumbsUp, Vote } from "lucide-react";

export default function PostCard({ title, body }) {

    const handleVote = async() => {

        try {
            
        } catch (error) {
            
        }
    }

    return (
        <div className="mb-1 border-b border-border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:bg-surface">
            <div className="flex gap-2 mb-1">
                <div className="size-7 rounded-full overflow-clip animate-pulse">
                    <img src="/images.png" alt="Logo Icon" />
                </div>
                <span className="text-sm font-semibold text-text-secondary">r/community</span>
            </div>
            <p className="font-semibold text-base mb-2">{title}</p>
            <p className="text-text-secondary text-sm mb-2">{body.slice(0, 401) + "..."}</p>
            <div className="flex items-center gap-2 bg-elevated w-fit rounded-xl py-1 px-4">
                <button onClick={() => handleVote()} className="flex items-center gap-1 rounded-full hover:scale-95 transition-all duration-200 cursor-pointer text-danger text-sm"><ThumbsUp size={18} /></button>
                <span>3</span>
                <button onClick={() => handleVote()} className="flex items-center gap-1 rounded-full hover:scale-95 transition-all duration-200 cursor-pointer text-info text-sm"><ThumbsDown size={18} /></button>
            </div>
        </div>
    )
}
