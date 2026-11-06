import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Loading from "../components/Loading"
import useAuth from "../hooks/useAuth"

export default function RegisterPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const {setAccessToken, user, setUser} = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!email || !password) {
            return window.alert("Inputs can't be empty")
        }

        if (password.length < 8) {
            return window.alert("Password can't be smaller than 8 characters")
        }

        try {
            setLoading(true)
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()

            if(!response.ok) {
                return console.log("not ok during login")
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
                        <label htmlFor="email" className="text-md font-extralight">Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className="border-b outline-none border-border py-1.5 w-full font-medium text-md" type="email" id="email" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-md font-extralight">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className="border-b outline-none border-border py-1.5 w-full font-medium text-md" type="text" id="password" />
                    </div>
                    <button disabled={loading} onClick={handleSubmit} className="px-3 py-3 flex items-center justify-center bg-brand rounded-sm text-bg mt-2 hover:bg-brand-hover active:scale-95 transition-all duration-200">{loading ? (<Loading/>) : ("Login")}</button>
                    <p className="text-center text-sm my-2">Dont have an account? <Link className="text-brand" to={"/register"}>Register</Link></p>
                </div>
            </div>
        </div>
    )
}