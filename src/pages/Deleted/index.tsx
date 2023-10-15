import { Input, Skeleton } from "antd"
import NoteRow from "../../components/NoteRow/NoteRow"
import { useState, useEffect } from "react"
import { useUserStore } from "../../utils/Store"
import NoNote from "../../components/NoNote"
import toast from "react-hot-toast"
import ToastText from "../../components/ToastText"
import supabaseClient from "../../utils/supabaseClient"
import styled from "styled-components"
import SearchComponent from "./subComponents/SearchComponent"

export default function Deleted() {
    const user = useUserStore((state) => state.user)
    const [homeState, setHomeState] = useState({
        data: [] as any,
        isLoading: true
    })

    const afterNoteRestored = (id: string) => {
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
        <SearchComponent afterNoteRestored={afterNoteRestored} />

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
                            afterNoteRestored={() => afterNoteRestored(note.id)}
                            key={idx}
                            note={note}
                        />
                    )}
        </div>
    </div>
}

export const CustomInput = styled(Input)`
    background-color: #393939 !important;
    border: none;
    border-radius: 25px;
    box-shadow: none;
    padding-left: 17px !important;
    padding-right: 17px !important;
    input{
        background-color: #393939 !important;
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        color: white;
        font-family: inter;
    }
`