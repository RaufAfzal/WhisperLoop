'use client'

import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { verifySchema } from "@/schemas/verifySchema"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()


    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })
            toast({
                title: 'Success',
                description: response?.data.message
            })
            router.replace('sign-in')

        } catch (err) {
            const axiosError = err as unknown as AxiosError<apiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: 'Incorrect code',
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code send to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Please enter code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                    <Button type="submit" className="block mx-auto">Submit</Button>
                </Form>

            </div>
        </div>
    )
}

export default VerifyAccount
