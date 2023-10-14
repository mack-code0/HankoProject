import { Skeleton } from "antd"
import { CgSearch } from "react-icons/cg"
import NoteRow from "../../components/NoteRow/NoteRow"
import { useState, useEffect } from "react"
import { useUserStore } from "../../utils/Store"
import NoNote from "../../components/NoNote"
import toast from "react-hot-toast"
import ToastText from "../../components/ToastText"
import { CustomInput } from "../Home"
import supabaseClient from "../../utils/supabaseClient"

export default function Deleted() {
    const user = useUserStore((state) => state.user)
    const [homeState, setHomeState] = useState({
        data: [] as any,
        isLoading: true
    })

    const afterDelete = (id: string) => {
        setHomeState(prev => {
            const tempNoteArr = prev.data.filter((val: any) => val.id !== id)
            return { ...prev, data: [...tempNoteArr] }
        })
    }

    const getNotes = async () => {
        setHomeState((prev) => ({ ...prev, isLoading: true }))

        try {
            let { data: notes, error } = await supabaseClient
                .from('temporaryNotes')
                .select('*')
                .eq("user", user?.hankoId)
                .order("createdAt", { ascending: true })

            if (error) {
                throw error
            }

            setHomeState(prev => ({ ...prev, data: notes }))
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "An Error Occured"}</ToastText>);
        } finally {
            setHomeState((prev) => ({ ...prev, isLoading: false }))
        }
    };

    useEffect(() => {
        getNotes()
    }, [])

    return <div className="p-8 h-screen">
        <CustomInput size="large" placeholder="Search notes" prefix={<CgSearch className="mr-3 text-2xl text-white" />} />

        <div className="mt-20 space-y-10 pb-20">
            {homeState.isLoading
                ? <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
                : homeState.data.length < 1
                    ? <NoNote />
                    : homeState.data.map((note: any, idx: number) =>
                        <NoteRow
                            fromDeletePage={true}
                            afterDelete={() => afterDelete(note.id)}
                            key={idx}
                            note={note}
                        />
                    )}
        </div>
    </div>
}