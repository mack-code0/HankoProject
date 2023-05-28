import { signOut } from "firebase/auth"
import { auth } from "./Firebase"

export const handleLogout = async () => {
    await signOut(auth)
    window.location.href = '/'
}
