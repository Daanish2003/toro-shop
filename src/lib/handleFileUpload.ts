import { getSignedURL } from "@/actions/getSignedURL";
import computeSHA256 from "./computeSHA256";

export default async function handleFileUpload(file: File) {
   const getSignedURLResult = await getSignedURL({
    fileType: file.type,
    fileSize: file.size,
    checksum: await computeSHA256(file),
   })

   if(getSignedURLResult.error !== undefined) {
      return {
        error: getSignedURLResult.error
      }
   }

    const { url } = getSignedURLResult.success;

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })

    return {
      success: { url, message: "File uploaded successfully" }
    }
}