import AddForm from "./AddForm"
import SideModal from "../../../components/SideModal"


interface Props {
    open: boolean
    toggle: () => void
    getNotes: () => void
}
const AddNote: React.FC<Props> = ({ open, toggle, getNotes }) => {

    return <>
        <SideModal open={open} header="Add Note" toggle={toggle}>
            <AddForm getNotes={getNotes} toggleModal={toggle} />
        </SideModal>
    </>
}

export default AddNote