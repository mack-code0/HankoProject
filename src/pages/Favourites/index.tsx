import { Input, Skeleton } from "antd"
import NoteRow from "../../components/NoteRow/NoteRow"
import { useState, useEffect } from "react"
import { useUserStore } from "../../utils/Store"
import NoNote from "../../components/NoNote"
import toast from "react-hot-toast"
import ToastText from "../../components/ToastText"
import supabaseClient from "../../utils/supabaseClient"
import styled from "styled-components"
import SearchComponent from "../Home/subComponents/SearchComponent"

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
        <SearchComponent
            afterDelete={() => getFavoriteNotes()}
            afterUpdate={() => getFavoriteNotes()}
            afterFavoriteUpdate={() => getFavoriteNotes()} />

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
