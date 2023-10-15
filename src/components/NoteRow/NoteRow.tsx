import { CgEreader, CgTrash } from "react-icons/cg"
import { FaRegEdit } from "react-icons/fa"
import { useUserStore } from "../../utils/Store"
import toast from "react-hot-toast"
import ToastText from "../ToastText"
import { useState } from "react"
import Spinner from "../Spinner"
import SideModal from "../SideModal"
import UpdateRow from "./subComponents/UpdateRow"
import { Dropdown, Menu } from "antd"
import { IoIosUndo } from "react-icons/io"
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import { useNavigate } from "react-router-dom"
import supabaseClient from "../../utils/supabaseClient"

interface Props {
    note: {
        title: string
        note: string
        id: string
        favorite: boolean
    }
    afterDelete?: () => void
    afterUpdate?: (val: any) => void
    afterFavoriteUpdate?: () => void
    afterNoteRestored?: () => void
    fromDeletePage?: boolean
}

const NoteRow: React.FC<Props> = ({ note, afterDelete, afterUpdate, fromDeletePage, afterFavoriteUpdate, afterNoteRestored }) => {
    const navigate = useNavigate()
    const user = useUserStore((state) => state.user)
    const [noteState, setNoteState] = useState(note)

    const [viewNote, setViewNote] = useState(false)
    const toggleViewNote = () => setViewNote(!viewNote)

    const [editNote, setEditNote] = useState(false)
    const toggleEditNote = () => setEditNote(!editNote)

    const [isRestoringNote, setIsRestoringNote] = useState(false)
    const restoreTemporarilyDeletedNotes = async () => {
        setIsRestoringNote(true)
        try {
            const restoreNoteResponse = await supabaseClient
                .from('notes')
                .insert([{ ...note }])
                .eq("user", user?.hankoId)

            if (restoreNoteResponse.error) {
                throw restoreNoteResponse.error
            }

            const deleteNoteFromTempResponse = await supabaseClient
                .from('temporaryNotes')
                .delete()
                .eq("user", user?.hankoId)
                .eq('id', note.id)

            if (deleteNoteFromTempResponse.error) {
                throw deleteNoteFromTempResponse.error
            }

            if (afterNoteRestored) afterNoteRestored()
            toast.success(<ToastText>Note Successfully Restored</ToastText>)
        } catch (error) {
            toast.error(`Error restoring note`);
        } finally {
            setIsRestoringNote(false)
        }
    };

    const [isDeleting, setIsDeleting] = useState(false)


    const deleteTemporarily = async () => {
        setIsDeleting(true)

        try {
            const temporaryNoteResponse = await supabaseClient
                .from('temporaryNotes')
                .insert([{ ...note, favorite: false }])
                .eq("user", user?.hankoId)

            if (temporaryNoteResponse.error) {
                throw temporaryNoteResponse.error
            }

            const deleteNoteResponse = await supabaseClient
                .from('notes')
                .delete()
                .eq("user", user?.hankoId)
                .eq('id', note.id)

            if (deleteNoteResponse.error) {
                throw deleteNoteResponse.error
            }

            toast.success(<ToastText>Item temporarily deleted!</ToastText>);
            if (afterDelete) afterDelete()
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "Error deleting item"}</ToastText>);
        } finally {
            setIsDeleting(false)
        }
    };

    const deletePermanently = async () => {
        setIsDeleting(true)

        try {
            const { error } = await supabaseClient
                .from('notes')
                .delete()
                .eq("user", user?.hankoId)
                .eq('id', note.id)

            if (error) {
                throw error
            }

            toast.success(<ToastText>Item deleted successfully!</ToastText>);
            if (afterDelete) afterDelete()
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "Error deleting item"}</ToastText>);
        } finally {
            setIsDeleting(false)
        }
    };

    const updateFavorite = async (bool: boolean) => {
        setNoteState(prev => ({ ...prev, favorite: bool }))

        try {
            const response = await supabaseClient
                .from('notes')
                .update({ favorite: !note.favorite })
                .eq("user", user?.hankoId)
                .eq('id', note.id)
                .select()

            if (response.error) {
                throw response.error
            }

            if (afterFavoriteUpdate) {
                afterFavoriteUpdate()
            }

            if (bool) return toast.success(<small>Note added to favorites. <a className="underline cursor-pointer" onClick={() => navigate("/favourites")}>View All</a></small>)
            toast.error(<small>Note removed favorites</small>)
        } catch (error: any) {
            setNoteState(prev => ({ ...prev, favorite: !note.favorite }))
            toast.error(<ToastText>{error?.message || "Error updating item"}</ToastText>, { position: "top-right" });
        }
    }


    return <div className={`flex flex-row items-start`}>
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
            <div className="flex flex-row items-start">
                {!fromDeletePage
                    && <Rate
                        tooltips={[noteState.favorite ? "Remove from favorite" : "Add to favorite"]}
                        value={noteState.favorite ? 1 : 0}
                        className="mt-[-0.2rem] mr-3 text-rose-600"
                        count={1}
                        character={noteState.favorite ? <HeartFilled /> : <HeartOutlined className="!text-white" />}
                        onChange={() => updateFavorite(!noteState.favorite)}
                    />}
                <h4 className="text-white font-inter font-bold text-2xl">{note.title}</h4>
            </div>
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
                                <Menu.Item onClick={() => deleteTemporarily()} className="font-inter hover:bg-[#242424] py-2" key={1}>Delete</Menu.Item>
                                <Menu.Item onClick={() => deletePermanently()} className="!text-white !bg-red-700 font-inter py-2" key={2}>Delete Permanently</Menu.Item>
                            </Menu>}>
                            <button
                                disabled={isDeleting}
                                // onClick={() => deleteNoteFromNotes(note.id)}
                                className="transition-all duration-75 flex flex-row items-center hover:text-red-400 focus:text-red-400 text-white text-opacity-80 font-figtree text-base">
                                <CgTrash className="mr-2 text-xl" /> | Delete {isDeleting && <Spinner />}
                            </button>
                        </Dropdown>
                    </>}
            </div>
        </div>
    </div>
}

export default NoteRow