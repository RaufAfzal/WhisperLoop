import { z } from 'zod'

export const signInSchema = z.object({
    identifier: z.string(),     //Identifier here is the username or email which we are putting while sign In
    password: z.string()
})