"use client"

import React, { useState } from 'react'
import CardWrapper from '../cardWrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { ACCEPTED_IMAGE_TYPES, ProfileSchema, profileType } from '@/zod/profileSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { Select, SelectItem, SelectTrigger } from '../ui/select'
import { SelectContent, SelectValue } from '@radix-ui/react-select'
import { Button } from '../ui/button'
import { PhoneInput } from '../ui/phone-input'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import handleFileUpload from '@/lib/handleFileUpload'
import { FormError } from '../auth/form-error'
import { FormSuccess } from '../auth/form-success'
import profile from '@/actions/profile'
import { z } from 'zod'

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | ArrayBuffer |null>(null)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false)
  const router = useRouter();

  const handleChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
  setUploading(true)
   const file = e.target.files?.[0]
   if(file) {
    const reader = new FileReader()
    const response = await handleFileUpload(file)

    if(response.error) {
      setError(response.error)
      setUploading(false)
      return
    }

     if(response.success) {
      setUploading(false)
      setSuccess(response.success.message)
      const { url } = response.success
      reader.onload = () => {
        setPreviewProfile(reader.result)
      }
      reader.readAsDataURL(file)
      form.setValue("image", url)
      form.clearErrors("image")
      setTimeout(() => {
        setSuccess("")
      }, 2000)
     }
   }
  }


   const form = useForm<profileType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
        image: '',
        name: '',
        phone: '',
    }
   })


   const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
     try {
      setLoading(true)
      setError("")
      setSuccess("")
      const response = await profile(values)
      if(response.error) {
        setError(response.error)
      }

      if(response.success) {
        setSuccess(response.success)
        setTimeout(() => {
          router.push('/home')
        })
      }
     } catch (error) {
      console.log(error)
       setError("Something went wrong")
     } finally {
        setLoading(false)
     }
   }

  return (
    <CardWrapper
     cardTitle='Create Your Profile'
     cardDescription='Please fill the form to create your profile'
     cardFooter='Go back to Login'
     cardFooterLink={'/auth/login'}
    >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField 
               control={form.control}
               name='image'
               render={() => (
                <FormItem className='flex justify-center'>
                  <FormLabel htmlFor='avatar-input'>
                  <Avatar className="w-40 h-40 cursor-pointer border-2 border-gray-200">
                    <AvatarImage src={previewProfile as string} />
                    <AvatarFallback className='bg-white'>{
                       uploading ? "Uploading..." : "Upload Image"
                      }</AvatarFallback>
                  </Avatar>
                  </FormLabel>
                  <FormControl>
                    <Input 
                    disabled={loading} 
                    id="avatar-input"
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    onChange={handleChange}
                    />
                  </FormControl>
                </FormItem>
               )}
              />
              <FormField 
                control = {form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                       <Input 
                          type="text"
                          placeholder="Enter your full name"
                          disabled={loading}  
                          {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control = {form.control}
                name="role"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                         <SelectTrigger>
                             <SelectValue placeholder="Select your role"/>
                         </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-background w-[400px] shadow-md rounded-md p-2'>
                        <SelectItem value="OWNER">Shop owner</SelectItem>
                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control = {form.control}
                name="phone"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                       <PhoneInput 
                        placeholder={"+91 030342564"}
                        disabled={loading}
                       {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success}/>
              <Button type="submit" className='w-full' disabled={loading || uploading}>Submit</Button>
            </form>
          </Form>
    </CardWrapper>
  )
}

export default ProfileForm