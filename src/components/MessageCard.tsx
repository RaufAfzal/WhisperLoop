'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message as ImportedMessage } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { apiResponse } from "@/types/ApiResponse"
import { z } from 'zod'
import { messageSchema } from "@/schemas/messageSchema"

type localMessage = z.infer<typeof messageSchema> & {
    _id: string // Manually add the _id field
}

type MessageCardProps = {
    message: localMessage,
    onMessageDelete: (messageId: string) => void
}



const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast()

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)

            if (response.data.success) {
                // Call the onMessageDelete prop to notify parent component
                onMessageDelete(message._id)

                // Show success toast
                toast({
                    title: "Message deleted",
                    description: "The message was successfully deleted.",
                })
            } else {
                // Show error toast if deletion failed
                toast({
                    title: "Error",
                    description: "Failed to delete the message.",
                })
            }
        } catch (error) {
            // Error handling for the API request
            toast({
                title: "Error",
                description: "An error occurred while deleting the message.",
            })
            console.error("Delete message error: ", error)
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger>Open</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>

    )
}

export default MessageCard
function aysnc() {
    throw new Error("Function not implemented.")
}

