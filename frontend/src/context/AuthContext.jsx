import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null)

export function AuthProvider({children}) {

    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
      const d = async() => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/refresh", {
            method:"GET",
            credentials:"include"
        })
        const data = await response.json()

        if(!response.ok) return console.log("not ok while fetching response refresh")

        setAccessToken(data.accessToken)

        const userResponse = await fetch("http://localhost:3000/api/auth/me", {
            method:"GET",
            headers: {
    Authorization: `Bearer ${data.accessToken}`
}
        })

        const userData = await userResponse.json()

        if(!userResponse.ok) return console.log("not ok while fetching user response")

        setUser(userData.data)
        console.log(userData.data)

        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
      }
      d()
    }, [])
    

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}