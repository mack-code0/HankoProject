import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { register, Hanko } from "@teamhanko/hanko-elements";
import { HANKO_API_URL } from "../../utils/keys";
import supabaseClient from "../../utils/supabaseClient";
import { User } from "../../utils/types";
import toast from "react-hot-toast";
import ToastText from "../../components/ToastText";
import logo from "../../../favicon.ico"


function Login() {
    const navigate = useNavigate()
    const hanko = useMemo(() => new Hanko(HANKO_API_URL), [])

    const saveUserIfUserIsNew = async (email: string, hankoId: string) => {
        try {
            const { data: users, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('email', email)

            if (error) {
                throw error
            }

            const user = users as User[]

            if (user.length === 0) {
                const userResponse = await supabaseClient
                    .from('users')
                    .insert([{ email, hankoId }])
                    .select()

                if (userResponse.error) {
                    throw error
                }

                toast.success(<ToastText>Your account has been created! 🚀</ToastText>)
            }
        } catch (error: any) {
            toast.error(<ToastText>An error occured</ToastText>);
        }
    }

    const redirectAfterLogin = async () => {
        const user = await hanko.user.getCurrent()
        await saveUserIfUserIsNew(user.email, user.id)
        navigate("/home")
    }

    useEffect(() => {
        hanko.onAuthFlowCompleted(() => {
            redirectAfterLogin()
        })
    }, [])

    const [showLogo, setShowLogo] = useState(false)
    useEffect(() => {
        register(HANKO_API_URL).then(() => setShowLogo(true)).catch(() => {
            toast.error(<ToastText>An Error occured</ToastText>)
        })
    }, [])

    return (<div className="flex flex-col h-screen items-center justify-center">
        <div className="w-full lg:w-[400px] p-5 md:p-2">
            {showLogo && <img src={logo} alt="Logo" className="mb-4" />}
            <div>
                <hanko-auth />
            </div>
        </div>
    </div>);
}

export default Login;