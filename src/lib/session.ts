"use server"
import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// Import redirect from 'next/navigation' if needed (optional)

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  expires?: Date;
  role:   string;
  isProfile?: boolean;
};


type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
};

const cookie: {
  name: string;
  options: CookieOptions;
  duration: number;
} = {
  name: "session",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "lax",
    path: "/",
  },
  duration: 60 * 60 * 1000, // 1 hour in milliseconds
};

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr") // Consider using payload.expires for custom expiration
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
      });
      return payload as SessionPayload;
    } catch (error) {
      return null;
    }
  }

export async function createSession(userId: string, role: string): Promise<void> {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({
    userId,
    expires,
    role,
    isProfile: false
  });
  cookies().set(cookie.name, session, { ...cookie.options, expires });
}

export async function verifySession() {
    const cookie = cookies().get('session')?.value;
    if (!cookie) {
      console.error("Session cookie not found");
      return null;
  }
    const session = await decrypt(cookie);
  
    if (!session || !session.userId) {
      console.error("Invalid session or userId not found in session");
      return null;
  }
    
  
    return { userId: String(session.userId) };
  }

export async function updateSession(): Promise<void | null> {
  const sessionCookie = cookies().get(cookie.name)?.value;
  const payload = await decrypt(sessionCookie);

  if (!payload) {
    console.error("Invalid session, cannot update");
    return null;
  }

  const expires = new Date(Date.now() + cookie.duration);
  const newSession = await encrypt({
    userId: String(payload.userId),
    role: payload.role,
    isProfile: payload.isProfile,
    expires,
  });

  cookies().set(cookie.name, newSession, { ...cookie.options, expires });
}

export async function deleteSession(): Promise<void> {
    cookies().delete('session')
}
