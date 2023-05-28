import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { CgEreader, CgTrash } from "react-icons/cg"
import { FaRegEdit } from "react-icons/fa"
import { db } from "../../utils/Firebase"
import { useUserStore } from "../../utils/Store"
import toast from "react-hot-toast"
import ToastText from "../ToastText"
import { useState } from "react"
import Spinner from "../Spinner"
import SideModal from "../SideModal"
import UpdateRow from "./subComponents/UpdateRow"
import { Dropdown, Menu } from "antd"
import { IoIosUndo } from "react-icons/io"

interface Props {
    note: {
        title: string
        note: string
        id: string
    }
    afterDelete?: () => void
    afterUpdate?: (val: any) => void
    fromDeletePage?: boolean
}

const NoteRow: React.FC<Props> = ({ note, afterDelete, afterUpdate, fromDeletePage }) => {
    const user = useUserStore((state) => state.user)

    const [viewNote, setViewNote] = useState(false)
    const toggleViewNote = () => setViewNote(!viewNote)

    const [editNote, setEditNote] = useState(false)
    const toggleEditNote = () => setEditNote(!editNote)

    const [isRestoringNote, setIsRestoringNote] = useState(false)
    const restoreTemporarilyDeletedNotes = async () => {
        setIsRestoringNote(true)
        try {
            // Delete the notes from the deletedNotes collection
            const noteRef = doc(db, 'deletedNotes', user.email);
            const documentSnapshot = await getDoc(noteRef);
            if (documentSnapshot.exists()) {
                const documentData = documentSnapshot.data();
                const arrayField = documentData.arrayField || [];

                const updatedArray = arrayField.filter((item: any) => item.id !== note.id);

                await updateDoc(noteRef, {
                    arrayField: updatedArray
                });

                // Move the notes to the main notes collection
                const collectionRef = collection(db, "notes")
                const userRef = doc(collectionRef, user.email)
                const data = { ...note }
                await setDoc(userRef, {
                    arrayField: arrayUnion(...[data])
                }, { merge: true })
                
                if (afterDelete) afterDelete()
                toast.success(<ToastText>Note Successfully Restored</ToastText>)
            } else {
                return toast.error(<ToastText>Document does not exist!</ToastText>);
            }
        } catch (error) {
            toast.error(`Error restoring note`);
        } finally {
            setIsRestoringNote(false)
        }
    };

    const [isDeleting, setIsDeleting] = useState(false)
    const deleteNoteFromNotes = async (temporarily: boolean) => {
        setIsDeleting(true)

        if (temporarily) {
            await deleteTemporarily(note)
        }

        const noteRef = doc(db, 'notes', user.email);

        try {
            const documentSnapshot = await getDoc(noteRef);
            if (documentSnapshot.exists()) {
                const documentData = documentSnapshot.data();
                const arrayField = documentData.arrayField || [];

                const updatedArray = arrayField.filter((item: any) => item.id !== note.id);

                await updateDoc(noteRef, {
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

    const deleteTemporarily = async (item: any) => {
        const collectionRef = collection(db, "deletedNotes")
        const userRef = doc(collectionRef, user.email)
        const data = { ...item }
        return await setDoc(userRef, {
            arrayField: arrayUnion(...[data])
        }, { merge: true })
    };

    const deletePermanently = async () => {
        setIsDeleting(true)
        const noteRef = doc(db, 'deletedNotes', user.email);
        try {
            const documentSnapshot = await getDoc(noteRef);
            if (documentSnapshot.exists()) {
                const documentData = documentSnapshot.data();
                const arrayField = documentData.arrayField || [];

                const updatedArray = arrayField.filter((item: any) => item.id !== note.id);

                await updateDoc(noteRef, {
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

        <SideModal open={editNote} header="Update" toggle={toggleEditNote}>
            <UpdateRow
                toggleModal={toggleEditNote}
                note={note}
                afterUpdate={afterUpdate ? afterUpdate : null}
            />
        </SideModal>

        <div className="w-3 h-3 rounded-full bg-green100 mt-2" />
        <div className="w-full ml-7 border-b border-b-textGrey100 border-opacity-20 pb-7">
            <h4 className="text-white font-inter font-bold text-2xl">{note.title}</h4>
            <p className="mt-3 font-figtree text-textGrey100 text-[1rem]">
                {note.note}
            </p>

            <div className="flex flex-row mt-4">
                {fromDeletePage
                    ? <>
                        <button
                            disabled={isDeleting}
                            onClick={() => deletePermanently()}
                            className="mr-7 flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                            <CgTrash className="mr-2 text-xl" /> | Delete {isDeleting && <Spinner />}
                        </button>

                        <button
                            disabled={isRestoringNote}
                            onClick={() => restoreTemporarilyDeletedNotes()}
                            className="flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                            <IoIosUndo className="mr-2 text-xl" /> | Restore {isRestoringNote && <Spinner />}
                        </button>
                    </>
                    : <>
                        <button
                            onClick={toggleViewNote}
                            className="flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                            <CgEreader className="mr-2 text-xl" /> | Read
                        </button>

                        <button
                            onClick={toggleEditNote}
                            className="mx-7 flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                            <FaRegEdit className="mr-2 text-xl" /> | Edit
                        </button>

                        <Dropdown
                            trigger={["click"]}
                            overlay={<Menu className="bg-[#393939] bg-opacity-80 rounded-xl overflow-hidden py-0">
                                <Menu.Item onClick={() => deleteNoteFromNotes(true)} className="text-white font-inter hover:bg-[#242424] py-2" key={1}>Delete</Menu.Item>
                                <Menu.Item onClick={() => deleteNoteFromNotes(false)} className="text-white bg-red-700 bg-opacity-90 font-inter hover:bg-[#242424] py-2" key={2}>Delete Permanently</Menu.Item>
                            </Menu>}>
                            <button
                                disabled={isDeleting}
                                // onClick={() => deleteNoteFromNotes(note.id)}
                                className="flex flex-row items-center hover:text-white text-white text-opacity-80 font-figtree text-base">
                                <CgTrash className="mr-2 text-xl" /> | Delete {isDeleting && <Spinner />}
                            </button>
                        </Dropdown>
                    </>}
            </div>
        </div>
    </div>
}

export default NoteRow