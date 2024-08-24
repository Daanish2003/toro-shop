import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const session = useSession();

    if (!session.data) {
        throw new Error("No user session found");
    }

    return session.data.user;
}