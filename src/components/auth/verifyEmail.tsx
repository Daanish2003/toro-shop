"use client"
import React, { useCallback, useEffect } from 'react'
import AuthCard from './authCard'
import { useSearchParams } from 'next/navigation';
import { BeatLoader } from "react-spinners"
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import newVerification from '@/actions/newVerification';

const VerfyEmail = () => {
    const [error, setError] = React.useState<string | undefined>();
    const [success, setSuccess] = React.useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if(success || error) return null;

        if (!token) {
            setError("Missing token");
            return;
        }

        newVerification(token).then((data) => {
            setSuccess(data.success);
            setError(data.error)
        }).catch(() => {
            setError("Something went wrong")
        })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])


  return (
    <AuthCard
       cardTitle={"Confirming your verification"}
       cardFooter={"Back to Login"}
       cardFooterLink={"/login"}
    >
       {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
    </AuthCard> 
  )
}

export default VerfyEmail