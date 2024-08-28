"use client"
import React from 'react'
import AuthCard from './authCard'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { newPasswordSchema } from '@/zod/newPasswordSchema'
import newPassword from '@/actions/new-password'

const PasswordResetForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError ] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");
    const [loading, setLoading] = React.useState<boolean>(false)


    const form = useForm<z.infer<typeof newPasswordSchema>>({
         mode: "onBlur",
         resolver: zodResolver(newPasswordSchema),
         defaultValues: {
            password: "",
            confirmPassword: ""
         }
    })

    const onSubmit = async(values: z.infer<typeof newPasswordSchema>) => {
        try{

        setError("");
        setSuccess("");
        setLoading(true);

        const response = await newPassword(values, token)

       
        if(response.success){
            setSuccess(response.success)
            setTimeout(() => {
                 router.push("/auth/login")
            }, 1000)
        }

        if(response.error) {
            setError(response.error)
        }
       } catch (error) {
          console.log(error);
          setError("Failed to submit the request")
       } finally {
        setLoading(false)
       }
    }

  return (
    <AuthCard
      cardTitle={"Reset Password"}
      cardDescription={"Create new password"}
      cardFooter={"Back to Login"}
      cardFooterLink={"/auth/login"}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField 
                  control={form.control}
                  name="password"
                  render = {({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input 
                               type="password" 
                               placeholder='******' 
                               disabled={loading}
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
                  render = {({field}) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input 
                               type="password" 
                               placeholder='******' 
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
                <Button type="submit" className='w-full' disabled={loading}>Submit</Button>
            </form>
        </Form>
    </AuthCard>
  )
}

export default PasswordResetForm