"use client"

import React from 'react'
import AuthCard from './authCard'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { newPasswordSchema } from '@/zod/newPasswordSchema'
import { forgotPasswordSchema } from '@/zod/forgotPasswordSchema'
import forgotPassword from '@/actions/forgot-password'

const ForgotPasswordForm = () => {
    const [error, setError] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        mode: 'onBlur',
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        setLoading(true)
        setError("")
        setSuccess("")
        await forgotPassword(values).then((response) => {
            if(response.success) {
                setSuccess(response.success)
            }
            if(response.error) {
                setError(response.error)
            }
        })
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