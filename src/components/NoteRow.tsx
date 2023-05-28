import { doc, getDoc, updateDoc } from "firebase/firestore"
import { CgEreader, CgTrash } from "react-icons/cg"
import { FaRegEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import { db } from "../utils/Firebase"
import { useUserStore } from "../utils/Store"
import toast from "react-hot-toast"
import ToastText from "./ToastText"
import { useState } from "react"
import Spinner from "./Spinner"
import SideModal from "./SideModal"

interface Props {
    note: {
        title: string
        note: string
        id: string
    }
    afterDelete?: () => void
}

const NoteRow: React.FC<Props> = ({ note, afterDelete }) => {
    const user = useUserStore((state) => state.user)

    const [viewNote, setViewNote] = useState(false)
    const toggleViewNote = () => setViewNote(!viewNote)

    const [isDeleting, setIsDeleting] = useState(false)
    const deleteItemFromArray = async (itemId: string) => {
        setIsDeleting(true)
        const docRef = doc(db, 'notes', user.email);

        try {
            const documentSnapshot = await getDoc(docRef);
            if (documentSnapshot.exists()) {
                const documentData = documentSnapshot.data();
                const arrayField = documentData.arrayField || [];

                const updatedArray = arrayField.filter((item: any) => item.id !== itemId);

                await updateDoc(docRef, {
                    arrayField: updatedArray
                });
                toast.success(<ToastText>Item deleted successfully!</ToastText>);
                if (afterDelete) afterDelete()
            } else {
                toast(<ToastText>Document does not exist!</ToastText>);
            }
        } catch (error) {
            toast.error(<ToastText>Error deleting item</ToastText>);
        } finally {
            setIsDeleting(false)
        }
    };

    return <div className="flex flex-row items-start">
        <SideModal open={viewNote} header="View" toggle={toggleViewNote}>
            <div className="mt-20">
                <p className="text-white font-semibold font-figtree text-base">📌 Title</p>
                <p className="mt-3 font-figtree text-textGrey100 text-[1rem]">
                    {note.title}
                </p>
                <p className="text-white font-semibold font-figtree text-base mt-20">📝 Note</p>
                <p className="mt-3 font-figtree text-textGrey100 text-[1rem]">
                    {note.note}
                </p>
            </div>
        </SideModal>

        <div className="w-3 h-3 rounded-full bg-green100 mt-2" />
        <div className="w-full ml-7 border-b border-b-textGrey100 border-opacity-20 pb-7">
            <h4 className="text-white font-inter font-bold text-2xl">{note.title}</h4>
            <p className="mt-3 font-figtree text-textGrey100 text-[1rem]">
                {note.note}
            </p>
            <div className="flex flex-row mt-4">
                <button
                    onClick={toggleViewNote}
                    className="flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                    <CgEreader className="mr-2 text-xl" /> | Read
                </button>

                <Link className="mx-7 flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base" to="">
                    <FaRegEdit className="mr-2 text-xl" /> | Edit
                </Link>

                <button
                    disabled={isDeleting}
                    onClick={() => deleteItemFromArray(note.id)}
                    className="flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                    <CgTrash className="mr-2 text-xl" /> | Delete {isDeleting && <Spinner />}
                </button>
            </div>
        </div>
    </div>
}

export default NoteRow