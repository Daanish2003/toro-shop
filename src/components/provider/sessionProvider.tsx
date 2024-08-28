"use client"
import { SessionPayload } from "@/lib/session"
import { createContext, useContext } from "react"


const SessionContext = createContext<SessionPayload | null>(
  null
)

export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: SessionPayload | null
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export const useSession = () => {
  const sessionContext = useContext(SessionContext)

  return sessionContext
}