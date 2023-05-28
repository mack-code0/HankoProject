import AddForm from "./AddForm"
import SideModal from "../../../components/SideModal"


interface Props {
    open: boolean
    toggle: () => void
    getArrayField: () => void
}
const AddNote: React.FC<Props> = ({ open, toggle, getArrayField }) => {

    return <>
        <SideModal open={open} header="Add Note" toggle={toggle}>
            <AddForm getArrayField={getArrayField} toggleModal={toggle} />
        </SideModal>
    </>
}

export default AddNote