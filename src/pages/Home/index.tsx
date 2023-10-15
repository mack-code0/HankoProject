import styled from "styled-components"
import { Skeleton } from "antd"
import { TbSquareRoundedPlusFilled } from "react-icons/tb"
import NoteRow from "../../components/NoteRow/NoteRow"
import AddNote from "./subComponents/AddNote"
import { useState, useEffect } from "react"
import NoNote from "../../components/NoNote"
import toast from "react-hot-toast"
import ToastText from "../../components/ToastText"
import supabaseClient from "../../utils/supabaseClient"
import { useUserStore } from "../../utils/Store"
import SearchComponent from "./subComponents/SearchComponent"
import { note } from "../../utils/types"

export default function Home() {
    const user = useUserStore((state) => state.user)

    const [homeState, setHomeState] = useState({
        data: [] as any,
        initialData: [],
        isLoading: true
    })

    const [addNote, setAddNote] = useState(false)
    const toggleAddNote = () => setAddNote(!addNote)

    const afterDelete = () => {
        getNotes()
    }

    const afterUpdate = (updatedValue: any) => setHomeState(prev => {
        let tempArr: any = [...prev.data]
        const idx = tempArr.findIndex((val: any) => updatedValue.id === val.id)
        tempArr[idx] = updatedValue
        return { ...prev, data: [...tempArr] }
    })

    const getNotes = async () => {
        setHomeState((prev) => ({ ...prev, isLoading: true }))

        try {
            let { data: notes, error } = await supabaseClient
                .from('notes')
                .select('*')
                .eq("user", user?.hankoId)
                .order("createdAt", { ascending: true })

            if (error) {
                throw error
            }

            setHomeState(prev => ({ ...prev, data: notes, tempData: notes }))
            // toast(<ToastText>Welcome to your Notes!. Please add a new note to get started.</ToastText>, { duration: 10000 });
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "Error getting array field"}</ToastText>);
        } finally {
            setHomeState((prev) => ({ ...prev, isLoading: false }))
        }
    };

    useEffect(() => {
        getNotes()
    }, [])

    return <Container className="p-8 h-screen">
        <SearchComponent afterDelete={afterDelete} afterUpdate={afterUpdate} />
        <TbSquareRoundedPlusFilled onClick={toggleAddNote} className="text-6xl cursor-pointer transition-all hover:text-opacity-70 text-white fixed bottom-10 right-10" />
        <AddNote getNotes={getNotes} open={addNote} toggle={toggleAddNote} />

        <div className="mt-20 space-y-10 pb-20">
            {homeState.isLoading
                ? <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
                : homeState.data.length < 1
                    ? <NoNote />
                    : homeState.data.map((note: note, idx: number) =>
                        <NoteRow
                            afterDelete={() => afterDelete()}
                            key={idx}
                            note={note}
                            afterUpdate={afterUpdate}
                        />
                    )}
        </div>
    </Container>
}

const Container = styled.div`
`