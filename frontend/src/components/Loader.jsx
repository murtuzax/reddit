import { LoaderCircle } from "lucide-react";

export default function Loader() {
    return (
        <div>
            <LoaderCircle size={20} className="animate-spin text-brand"/>
        </div>
    )
}