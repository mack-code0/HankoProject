import { Hanko } from "@teamhanko/hanko-elements"
import { HANKO_API_URL } from "./keys";
import ToastText from "../components/ToastText";
import toast from "react-hot-toast";

export const handleLogout = async () => {
    const hanko = new Hanko(HANKO_API_URL)

    try {
        await hanko?.user.logout();
    } catch (error) {
        toast.error(<ToastText>Error occured during logout</ToastText>);
    } finally {
        window.location.href = "/";
    }
}

