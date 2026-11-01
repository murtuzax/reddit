import jwt from "jsonwebtoken"

export const verifyUser = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1]

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            })
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)

        req.user = {
            id:decoded.id
        }

        next()
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }
}