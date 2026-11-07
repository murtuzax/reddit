import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div>
            <LoaderCircle size={20} className="animate-spin text-bg"/>
        </div>
    )
}