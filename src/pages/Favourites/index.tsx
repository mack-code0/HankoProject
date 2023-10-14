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

export default function Home() {
    const user = useUserStore((state) => state.user)
    const [state, setState] = useState({
        data: [] as any,
        isLoading: true
    })

    const afterDelete = (id: string) => {
        setState(prev => {
            const tempNoteArr = prev.data.filter((val: any) => val.id !== id)
            return { ...prev, data: [...tempNoteArr] }
        })
    }

    const getFavoriteNotes = async () => {
        setState((prev) => ({ ...prev, isLoading: true }))

        try {
            let { data: notes, error } = await supabaseClient
                .from('notes')
                .select('*')
                .eq("user", user?.hankoId)
                .is("favorite", true)
                .order("createdAt", { ascending: true })

            if (error) {
                throw error
            }
            setState(prev => ({ ...prev, data: notes }))
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "Error getting array field"}</ToastText>);
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }))
        }
    };


    useEffect(() => {
        getFavoriteNotes()
    }, [])

    return <div className="p-8 h-screen">
        <CustomInput size="large" placeholder="Search notes" prefix={<CgSearch className="mr-3 text-2xl text-white" />} />

        <div className="mt-20 space-y-10 pb-20">
            {state.isLoading
                ? <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
                : state.data.length < 1
                    ? <NoNote />
                    : state.data.map((note: any, idx: number) =>
                        <NoteRow
                            afterDelete={() => afterDelete(note.id)}
                            key={idx}
                            note={note}
                            afterFavoriteUpdate={() => setState(prev => {
                                let tempArr: any = prev.data.filter((val: any) => val.id !== note.id)
                                return { ...prev, data: [...tempArr] }
                            })}
                            afterUpdate={(updatedValue: any) => setState(prev => {
                                let tempArr: any = [...prev.data]
                                const idx = tempArr.findIndex((val: any) => updatedValue.id === val.id)
                                tempArr[idx] = updatedValue
                                return { ...prev, data: [...tempArr] }
                            })}
                        />
                    )}
        </div>
    </div>
}
