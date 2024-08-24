"use client"

import React from 'react'
import AuthCard from './authCard'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RegisterSchema } from '@/lib/zod/registerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AuthSeparator from './authSeparator'
import Social from './social'
import register from '@/actions/register'
import { useRouter } from 'next/navigation'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'

const RegisterForm = () => {
    const [ error, setError ] = React.useState<string | undefined>("");
    const [ success, setSuccess ] = React.useState<string | undefined>("");
    const [ loading, setLoading ] = React.useState<boolean>(false);
    const router = useRouter();


    const form = useForm<z.infer<typeof RegisterSchema>>({
        mode: 'onBlur',
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        try {
            setError("");
            setSuccess("");
            setLoading(true);

        const response = await register(values);

        if (response.success) {
            setSuccess(response.success);
            form.reset();
        }

        if (response.error) {
            setError(response.error);
            setLoading(false);
        }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
  return (
    <AuthCard
        cardTitle={"Create Account"}
        cardDescription={"Create an account to get started."}
        cardFooter={"Already have an account? Login"}
        cardFooterLink={"/auth/login"}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className='flex gap-x-4'>
                <FormField 
                   control={form.control}
                   name="firstName"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input
                               disabled={loading} 
                               placeholder='Enter your first name' 
                               type="text" 
                               {...field} 
                               />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                <FormField 
                   control={form.control}
                   name="lastName"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input 
                                disabled={loading}
                                placeholder='Enter your last name' 
                                type="text" 
                                {...field} 
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                </div>
                <FormField 
                   control={form.control}
                   name="email"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading} 
                                placeholder='Enter your email' 
                                type="email" 
                                {...field} 
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                <FormField 
                   control={form.control}
                   name="password"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                 disabled={loading} 
                                 placeholder='******' 
                                 type="password" 
                                 {...field} 
                                 />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )}
                />
                <FormField 
                   control={form.control}
                   name="confirmPassword"
                   render={({field}) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input
                                disabled={loading} 
                                placeholder='******' 
                                type="password" 
                                {...field} 
                                />
                        </FormControl>
                        <FormMessage />
                    </FormItem> 
                   )}
                />
                 <FormError message={error} />
                 <FormSuccess message={success} />
                <Button type='submit' disabled={loading} className='w-full'>Submit</Button>
                <AuthSeparator />
                <Social />
            </form>
        </Form>
    </AuthCard>
  )
}

export default RegisterForm