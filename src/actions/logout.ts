"use server"

import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function logout() {
   deleteSession()
   redirect('/auth/login')
}