"use client"

import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AuthSeparator from './authSeparator'
import Social from './social'
import { useRouter } from 'next/navigation'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { signupSchema } from '@/zod/signupSchema'
import { signup } from '@/actions/signup'
import CardWrapper from '../cardWrapper'

const SignupForm = () => {
    const [ error, setError ] = React.useState<string | undefined>("");
    const [ success, setSuccess ] = React.useState<string | undefined>("");
    const [ loading, setLoading ] = React.useState<boolean>(false);
    const router = useRouter()


    const form = useForm<z.infer<typeof signupSchema>>({
        mode: 'onBlur',
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
        setError('')
        setSuccess('')
        setLoading(true)
        
        await signup(values).then((data) => {
            if(data?.error) {
                setError(data.error)
                setLoading(false)
            }
            if(data?.success) {
                setSuccess(data.success)
            }
        }) 
    }
  return (
    <CardWrapper
        cardTitle={"Create Account"}
        cardDescription={"Create an account to get started."}
        cardFooter={"Already have an account? Login"}
        cardFooterLink={"/auth/login"}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
    </CardWrapper>
  )
}

export default SignupForm