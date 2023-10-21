import { useEffect } from "react";
import { register } from "@teamhanko/hanko-elements";
import { HANKO_API_URL } from "../../../utils/keys";


export default function Security() {
    useEffect(() => {
        register(HANKO_API_URL).catch(() => {
            // handle error
        });
    }, []);

    return <div className="flex flex-col items-center justify-center py-5">
        <div className=" w-full lg:w-2/4 p-2">
            <hanko-profile />
        </div>
    </div>;
}