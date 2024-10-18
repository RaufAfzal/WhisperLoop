import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found "
                },
                { status: 401 }
            )
        }

        //is user accepting the messages

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages "
                },
                { status: 403 }   //forbidden status
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message send successfully "
            },
            { status: 401 }
        )

    } catch (err) {
        return Response.json(
            {
                success: false,
                message: "Interval server error "
            },
            { status: 500 }
        )
    }
}
