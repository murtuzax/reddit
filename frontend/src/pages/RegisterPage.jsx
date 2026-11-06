import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Loading from "../components/Loading"
import useAuth from "../hooks/useAuth"

export default function RegisterPage() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const {setAccessToken, user, setUser} = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!username || !email || !password) {
            return window.alert("Inputs can't be empty")
        }

        if (username.length < 3) {
            return window.alert("Username can't be smaller than 3 characters")
        }

        if (password.length < 8) {
            return window.alert("Password can't be smaller than 8 characters")
        }

        try {
            setLoading(true)
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            })
            const data = await response.json()

            if(!response.ok) {
                return console.log("not ok while registering")
            }

            setAccessToken(data.accessToken)
            setUser(data.data)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-elevated min-h-screen flex items-center justify-center">
            <div className="w-[340px] bg-surface p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Get Started!</h2>
                <div className="mt-6 flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="text-md font-extralight">Username</label>
                        <input onChange={(e) => setUsername(e.target.value)} value={username} className="border-b outline-none border-border py-1.5 w-full font-medium text-md" type="text" id="username" />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-md font-extralight">Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className="border-b outline-none border-border py-1.5 w-full font-medium text-md" type="email" id="email" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-md font-extralight">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className="border-b outline-none border-border py-1.5 w-full font-medium text-md" type="text" id="password" />
                    </div>
                    <button disabled={loading} onClick={handleSubmit} className="px-3 py-3 flex items-center justify-center bg-brand rounded-sm text-bg mt-2 hover:bg-brand-hover active:scale-95 transition-all duration-200">{loading ? (<Loading/>) : ("Register")}</button>
                    <p className="text-center text-sm my-2">Already have an account? <Link className="text-brand" to={"/login"}>Login</Link></p>
                </div>
            </div>
        </div>
    )
}