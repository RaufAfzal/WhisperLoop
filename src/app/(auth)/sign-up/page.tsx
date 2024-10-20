'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { apiResponse } from "@/types/ApiResponse"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const debounced = useDebounceCallback(setUsername, 500)

    //zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check_username_unique?username=${username}`)
                    console.log('Response is ', response?.data.message)
                    setUsernameMessage(response?.data.message)

                } catch (err) {
                    const axiosError = err as AxiosError<apiResponse>
                    setUsernameMessage(
                        axiosError?.response?.data.message ?? "Error checking username"
                    )
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUserNameUnique()

    }, [username])


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response?.data.message
            })
            router.replace(`/verify/${username}`)

        } catch (err) {
            console.error("Error in signup of user", err)
            const axiosError = err as unknown as AxiosError<apiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: 'Sign up failed',
                description: errorMessage,
                variant: "destructive"
            })

        }
        finally {
            setIsSubmitting(false)
        }
        console.log(data)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Whisper Loop
                    </h1>
                    <p className="mb-4">
                        Sign up to start your whisper
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Please enter username"
                                            {...field}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                field.onChange(value);
                                                debounced(value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    <p className={`tezt-sm ${usernameMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'}`}>
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Please enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Please enter password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="block mx-auto">{isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
                            </>) : ('SignUp')}</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign In
                        </Link>
                    </p>
                </div>



            </div>

        </div>
    )
}

export default SignUpPage
