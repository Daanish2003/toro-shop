"use client"

import React from 'react'
import AuthCard from './authCard'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { ResetSchema } from '@/lib/zod/resetSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import forgotPassword from '@/actions/forgotPassword'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'

const ForgotPasswordForm = () => {
    const [error, setError] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof ResetSchema>>({
        mode: 'onBlur',
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        try {
        setError("");
        setSuccess("");
        setLoading(true)
        const response = await forgotPassword(values);

        if(response.success) {
            setSuccess(response.success)
        }
    
        if(response.error) {
            setError(response.error)
        }
        } catch (error) {
            setError("Failed to submit request")
        } finally {
            setLoading(false)
        }
    }
  return (
    <AuthCard
       cardTitle = {"Forgot Password"}
       cardDescription={"Enter your email address and we will send you a link to reset your password"}
       cardFooter={"Remember your password? Login"}
       cardFooterLink={"/auth/login"}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField 
                   control={form.control}
                   name="email"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input 
                               type="email" 
                               placeholder="Enter your Email" 
                               disabled={loading}
                               {...field}
                               />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button type="submit" disabled={loading} className='w-full'>Submit</Button>
            </form>
        </Form>
    </AuthCard>
  )
}

export default ForgotPasswordForm