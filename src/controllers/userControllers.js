import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const generateToken = async function (user) {
    try {
        const accessToken = user.generateAccessToken()
        return { accessToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong on our end")
    }

}

const cookieOptions = {
    httpOnly: false,
    secure: true
}

export const RegisterUser = asyncHandler(async function (req, res, next) {
    const { username, password } = req.body

    if (!username || !password) {
        throw new ApiError(400, "Please fill the essential fields")
    }
    const existingUser = await User.findOne({
        username: username
    })

    if (existingUser) {
        throw new ApiError(400, "User already exists")
    }

    const user = await User.create({
        username,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )
    if (!createdUser) {
        throw new ApiError(500, "Unable to create the user")
    }

    return res.status(201).json(
        new ApiResponse(200, "User created successfully", createdUser)
    )
})

export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username) {
        throw new ApiError(401, "Email is required")
    }

    let user = await User.findOne({
        username: username,
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const checkPass = await user.checkPassword(password)

    if (!checkPass) {
        throw new ApiError(401, "Re-check the credentials")
    }

    const { accessToken } = await generateToken(user)

    const loggedInUser = await User.findById(user._id).select("-password")
    console.log("logged in")

    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                "Logged in successfully",
                {
                    user: loggedInUser, accessToken
                }
            )
        )

})

export const logoutUser = asyncHandler(async (req, res) => {

    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiResponse(
            200, "Logged out successfully", req.user
        ))
})

export const getUser = asyncHandler(async (req, res) => {
    if (!req.user) {                                         //This check isnt necessary
        throw new ApiError(400, "Unable to find user")
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            "User found",
            req.user
        ))
})