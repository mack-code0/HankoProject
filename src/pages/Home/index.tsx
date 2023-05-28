import styled from "styled-components"
import { Input, Skeleton } from "antd"
import { CgSearch } from "react-icons/cg"
import { TbSquareRoundedPlusFilled } from "react-icons/tb"
import NoteRow from "../../components/NoteRow/NoteRow"
import AddNote from "./subComponents/AddNote"
import { useState, useEffect } from "react"
import { useUserStore } from "../../utils/Store"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../utils/Firebase"
import NoNote from "../../components/NoNote"
import toast from "react-hot-toast"
import ToastText from "../../components/ToastText"

export default function Home() {
    const user = useUserStore((state) => state.user)
    const [homeState, setHomeState] = useState({
        data: [] as any,
        isLoading: true
    })

    const [addNote, setAddNote] = useState(false)
    const toggleAddNote = () => setAddNote(!addNote)

    const afterDelete = (id: string) => {
        setHomeState(prev => {
            const tempNoteArr = prev.data.filter((val: any) => val.id !== id)
            return { ...prev, data: [...tempNoteArr] }
        })
    }

    const getNotes = async () => {
        setHomeState((prev) => ({ ...prev, isLoading: true }))
        const docRef = doc(db, 'notes', user.email);

        try {
            const documentSnapshot = await getDoc(docRef);
            if (documentSnapshot.exists()) {
                const documentData = documentSnapshot.data();
                const arrayField = documentData.arrayField || [];
                setHomeState(prev => ({ ...prev, data: arrayField }))
            } else {
                toast(<ToastText>Document does not exist!</ToastText>);
            }
        } catch (error) {
            toast.error(<ToastText>Error getting array field</ToastText>);
        } finally {
            setHomeState((prev) => ({ ...prev, isLoading: false }))
        }
    };

    useEffect(() => {
        getNotes()
    }, [])

    return <Container className="p-8 h-screen">
        <CustomInput size="large" placeholder="Search notes" prefix={<CgSearch className="mr-3 text-2xl text-white" />} />

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
                    : homeState.data.map((note: any, idx: number) =>
                        <NoteRow
                            afterDelete={() => afterDelete(note.id)}
                            key={idx}
                            note={note}
                            afterUpdate={(updatedValue: any) => setHomeState(prev => {
                                let tempArr: any = [...prev.data]
                                const idx = tempArr.findIndex((val: any) => updatedValue.id === val.id)
                                tempArr[idx] = updatedValue
                                return { ...prev, data: [...tempArr] }
                            })}
                        />
                    )}
        </div>
    </Container>
}

const Container = styled.div`
`
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