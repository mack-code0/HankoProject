import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/Firebase";
import { useNavigate } from "react-router";

const provider = new GoogleAuthProvider();
function Login() {
    const navigate = useNavigate()
    const signInFunction = () => {
        signInWithPopup(auth, provider)
            .then(async () => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential?.accessToken;
                // const user = result.user;
                navigate("/home")
            }).catch(() => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // const email = error.customData.email;
                // const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }
    return (<div className="flex items-center justify-center w-screen h-screen bg-black100">
        <button
            onClick={signInFunction}
            className="px-4 py-2 border flex items-center gap-2 bg-white rounded-lg">
            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
            <span className="font-figtree text-black text-opacity-70 font-semibold mx-10">Login with Google</span>
        </button>
    </div>);
}

export default Login;