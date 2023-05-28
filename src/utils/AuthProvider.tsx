import React, { useEffect, useState } from "react";
import { auth } from "../utils/Firebase";
import { handleLogout } from "./HandleLogout";
import { useUserStore } from "./Store";


export default function AuthProvider({ children }: any) {
    const setUser = useUserStore((state: any) => state.setUser);
    const user = useUserStore((state: any) => state.user);
    const [isTokenValidating, setTokenValidating] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((userVal: any) => {
            if (userVal) {
                if (!user) {
                    setUser(userVal);
                    setTokenValidating(true);
                }
                userVal.getIdTokenResult()
                    .then((idTokenResult: any) => {
                        // Token validation complete
                        setTokenValidating(false);

                        // Access idTokenResult properties if needed
                        // console.log('Token expires at:', idTokenResult.expirationTime);
                    })
                    .catch((error: any) => {
                        // Error occurred during token validation
                        setTokenValidating(false);
                        console.error('Error validating token:', error);
                    });
            } else {
                setTokenValidating(false);
            }
        });

        return () => unsubscribe(); // Clean up the listener on component unmount
    }, []);

    if (isTokenValidating) {
        return <div className="flex items-center justify-center w-screen h-screen text-slate-400 bg-black100">

        </div>
    }

    if (!user) {
        handleLogout()
        return ""
    }

    return React.Children.map(children, (child) => {
        return React.cloneElement(child, { user: user })
    })
}