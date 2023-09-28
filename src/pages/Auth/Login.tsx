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
    return (<div className="flex items-center justify-center w-screen h-screen bg-black100 bg-shatteredIsland">
        <button
            onClick={signInFunction}
            className="h-[42px] w-[184px] min-w-fit flex items-center bg-[#4285f4] active:bg-[#1669F2] hover:shadow hover:shadow-googleBtn rounded-sm">
            <div className="border border-[#4285f4]  bg-white h-full flex items-center justify-center px-3">
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
            </div>
            <span className="font-roboto text-white mx-10 whitespace-nowrap">Login with Google</span>
        </button>
    </div>);
}

export default Login;