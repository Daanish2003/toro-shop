"use server"

import getSession from "@/helpers/query/getSession";
import db from "@/lib/primsa-client";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/zod/profileSchema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

type SignedURLResponse = {
    error?: undefined;
    success: {url: string};
} | {
    error: string;
    success?: undefined;
}

type GetSignedURLArgs = {
    fileType: string;
    fileSize: number;
    checksum: string;
}

export async function getSignedURL({fileType, fileSize, checksum}: GetSignedURLArgs): Promise<SignedURLResponse> {
   const session = await getSession()
   const bucketRegion = process.env.AWS_BUCKET_REGION;
   const bucketName = process.env.AWS_BUCKET_NAME;
   const accessKeyId = process.env.AWS_ACCESS_KEY;
   const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

   if(!session) {
    return {
        error: "Not Authenticated"
    }
   }

   if (!bucketRegion) {
    throw new Error("Missing required environment variable bucket region");
  }
  if (!accessKeyId) {
    throw new Error("Missing required environment variable access key id");
  }
  if (!secretAccessKey) {
    throw new Error("Missing required environment variable secret access Key");
  }
  if (!bucketName) {
    throw new Error("Missing required environment variable bucket name");
  }

   const s3 = new S3Client({
       region: bucketRegion,
       credentials: {
          accessKeyId,
          secretAccessKey
       }
   });

   const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
  

   if(MAX_FILE_SIZE < fileSize) {
      return {
        error: "File size too large"
   }
  }

  if(!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
    return {
        error: "Invalid file type"
    }
  }

  const putObjectCommand = new PutObjectCommand({
         Bucket: bucketName,
         Key: generateFileName(), 
         ContentType: fileType,
         ContentLength: fileSize,
         ChecksumSHA256: checksum,
         Metadata: {
          userId: session.userId
         }
  })

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 180
  })

  await db.user.update({
    where: { id: session.userId },
    data: {
      image: signedURL,
    }
  })

  console.log(signedURL)

   return {
    success: {url: signedURL}
   }
}