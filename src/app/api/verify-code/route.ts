import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 500 }
            )
        }

        const isCodeValid = user?.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                { status: 200 }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "user verification code has expired please sign up again to get new code "
                },
                { status: 400 }
            )
        }
        else {
            return Response.json(
                {
                    success: false,
                    message: "Inccoret verification code"
                },
                { status: 500 }
            )
        }

    } catch (err) {
        console.error("Error verifying user", err)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            { status: 500 }
        )
    }
}