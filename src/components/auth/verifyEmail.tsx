"use client"
import React, { useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { BeatLoader } from "react-spinners"
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { verifyEmail } from '@/actions/verify-email';
import CardWrapper from '../cardWrapper';

const VerfyEmail = () => {
    const [error, setError] = React.useState<string | undefined>();
    const [success, setSuccess] = React.useState<string | undefined>();
    const router = useRouter()

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if(success || error) return null;

        if (!token) {
            setError("Missing token");
            return;
        }

        verifyEmail(token).then((data) => {
            setSuccess(data.success);
            setError(data.error)
            router.push('/auth/set-profile')
        }).catch(() => {
            setError("Something went wrong")
        })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])


  return (
    <CardWrapper
       cardTitle={"Confirming your verification"}
       cardFooter={"Back to Login"}
       cardFooterLink={"/auth/login"}
    >
       {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
    </CardWrapper> 
  )
}

export default VerfyEmail