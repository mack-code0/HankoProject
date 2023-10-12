import * as Yup from "yup"
import { useFormik, FormikProvider, ErrorMessage } from "formik"
import { useUserStore } from "../../../utils/Store";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import ToastSucccessText from "../../../components/ToastText";
import Spinner from "../../../components/Spinner";

interface FormikValues {
    noteCreationRequests: {
        title: string
        note: string
    }[]
}

const validationSchema = Yup.object().shape({
    noteCreationRequests: Yup.array().of(Yup.object({
        title: Yup.string().required("Title cannot be blank"),
        note: Yup.string().required("Note cannot be blank")
    }))
})

const AddForm: React.FC<{ toggleModal: () => void, getNotes: () => void }> = ({ toggleModal, getNotes }) => {
    const user = useUserStore((state) => state.user)

    const formik = useFormik<FormikValues>({
        initialValues: { noteCreationRequests: [{ title: "", note: "" }] },
        validateOnBlur: false,
        onSubmit: async (val, formikProps) => {
            try {
                // const collectionRef = collection(db, "notes")
                // const userRef = doc(collectionRef, user.email)
                // const data = {
                //     title: val.noteCreationRequests[0].title,
                //     note: val.noteCreationRequests[0].note,
                //     favorite: false,
                //     id: uuidv4()
                // }
                // await setDoc(userRef, {
                //     arrayField: arrayUnion(...[data])
                // }, { merge: true })
                // toast.success(<ToastSucccessText>Added Note Successfully</ToastSucccessText>, { position: "top-right" })
                // formikProps.resetForm()
                // getNotes()
            } catch (error) {
                toast.error(`Error saving note`);
            }
        },
        validationSchema
    })

    return <form className="mt-20" aria-disabled={true} onSubmit={formik.handleSubmit}>
        <FormikProvider value={formik}>
            {formik.values.noteCreationRequests.map((val, idx) =>
                <div key={idx}>
                    <div>
                        <label
                            htmlFor="title"
                            className="text-white font-semibold font-figtree text-base">📌 Title</label>
                        <input
                            type="text"
                            id="title"
                            value={val.title}
                            name={`noteCreationRequests.${idx}.title`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mt-3 rounded-sm bg-black200 border w-full h-[2.5rem] outline-0 px-3 text-white text-opacity-70 font-inter border-textGrey100 border-opacity-20`}
                        />
                    </div>
                    <ErrorMessage name={`noteCreationRequests.${idx}.title`} render={(msg) => <small className="text-red-500 font-inter">{msg}</small>} />

                    <div className="mt-10">
                        <label className="text-white font-semibold font-figtree text-base" htmlFor="note">📝 Note</label>
                        <textarea
                            id="note"
                            rows={10}
                            name={`noteCreationRequests.${idx}.note`}
                            value={val.note}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-3 rounded-sm bg-black200 border w-full outline-0 px-3 text-white text-opacity-70 font-inter border-textGrey100 border-opacity-20"
                        />
                    </div>
                    <ErrorMessage name={`noteCreationRequests.${idx}.note`} render={(msg) => <small className="text-red-500 font-inter">{msg}</small>} />
                </div>)}

            <div className="mt-20 flex flex-row justify-end">
                <button
                    onClick={toggleModal}
                    type="button"
                    className=" px-5 py-2 font-figtree font-bold border border-white rounded-lg text-white mr-5 flex flex-row items-center">Cancel</button>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className=" px-5 py-2 font-figtree font-bold bg-white rounded-lg text-black200 flex flex-row items-center">
                    Add
                    {formik.isSubmitting && <Spinner />}
                </button>
            </div>
        </FormikProvider>
    </form>
}


export default AddForm