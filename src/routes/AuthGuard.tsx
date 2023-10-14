import { useEffect, useState } from 'react';
import { Hanko } from "@teamhanko/hanko-elements"
import loading from "./../assets/images/loading.gif"
import { HANKO_API_URL } from '../utils/keys';
import { handleLogout } from '../utils/HandleLogout';
import { useUserStore } from '../utils/Store';
import supabaseClient from '../utils/supabaseClient';
import toast from 'react-hot-toast';
import ToastText from '../components/ToastText';

const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const hanko = new Hanko(HANKO_API_URL)
    const [isLoading, setIsLoading] = useState(true)
    const addUserToStore = useUserStore((state) => state.setUser);
    const [localStorageData, setLocalStorageData] = useState({
        localHankoSession: localStorage.getItem('hanko-session') || '',
        localHanko: localStorage.getItem('hanko') || '',
    });

    const checkUserSession = async () => {
        setIsLoading(true)
        const userHankoId = hanko.session._get().userID

        try {
            let { data: users, error } = await supabaseClient
                .from('users')
                .select("*")
                .eq('hankoId', userHankoId)
                .limit(1)


            if (!userHankoId || !users || !users[0] || error) {
                // throw new Error("Session ID is Invalid")
                handleLogout()
            } else {
                setIsLoading(false)
                addUserToStore(users[0])
            }
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "An Error Occured"}</ToastText>)
        }
    }

    useEffect(() => {
        checkUserSession()

        const handleStorageChange = () => {
            // When localStorage changes, update the state with the new value
            setLocalStorageData({
                localHanko: localStorage.getItem('hanko') || '',
                localHankoSession: localStorage.getItem('hanko-session') || '',
            });
        };

        // Attach the event listener to the storage event
        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [localStorageData])

    if (isLoading) {
        return <div className="flex items-center justify-center w-screen h-screen text-slate-400 bg-black100">
            <img src={loading} width={80} alt="" />
        </div>
    }

    return (<>
        {children}
    </>);
}

export default AuthGuard;