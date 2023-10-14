import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { register, Hanko } from "@teamhanko/hanko-elements";
import { HANKO_API_URL } from "../../utils/keys";
import supabaseClient from "../../utils/supabaseClient";
import { User } from "../../utils/types";
import toast from "react-hot-toast";
import ToastText from "../../components/ToastText";


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

    useEffect(() => {
        register(HANKO_API_URL).catch(() => {
            toast.error(<ToastText>An Error occured</ToastText>)
        })
    }, [])

    return (<div className="flex h-screen items-center justify-center">
        <hanko-auth />
    </div>);
}

export default Login;