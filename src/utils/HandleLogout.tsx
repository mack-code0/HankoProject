import { Hanko } from "@teamhanko/hanko-elements"
import { HANKO_API_URL } from "./keys";
import ToastText from "../components/ToastText";

export const handleLogout = async () => {
    const hanko = new Hanko(HANKO_API_URL)

    try {
        await hanko?.user.logout();
        window.location.href = "/";
    } catch (error) {
        console.error(<ToastText>Error occured during logout</ToastText>);
    }
}

