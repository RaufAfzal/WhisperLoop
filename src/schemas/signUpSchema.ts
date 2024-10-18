import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast of 4 characters")
    .max(10, "Username must be no more than 20 characters")
// .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Username must contain the special characters")



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid Email Address' }),
    password: z.string().min(6, { message: "password must be atleast 6 characters" })
})
