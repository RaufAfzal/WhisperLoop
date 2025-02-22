import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingUserByName = await UserModel.findOne({
            username,
            isVerified: true
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByName) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({
            email,
            isVerified: true
        })

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exist with this email'
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {

            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: true,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse) {
            return Response.json({
                success: false,
                message: emailResponse || "Error sending email",
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registered Successfully"
        }, { status: 201 })

    }
    catch (err) {
        console.error('Error while regestring user', err)
        return Response.json(
            {
                succeess: false,
                message: "Error regestring user"
            },
            {
                status: 500
            }
        )
    }
}