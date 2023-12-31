import * as Yup from "yup"
import { useFormik, FormikProvider, ErrorMessage } from "formik"
import toast from "react-hot-toast";
import ToastSucccessText from "../../../components/ToastText";
import Spinner from "../../../components/Spinner";
import supabaseClient from "../../../utils/supabaseClient";

interface FormikValues {
    title: string
    note: string
    id: string
    favorite: boolean
}

const validationSchema = Yup.object().shape({
    noteCreationRequests: Yup.array().of(Yup.object({
        title: Yup.string().required("Title cannot be blank"),
        note: Yup.string().required("Note cannot be blank"),
        id: Yup.string().required("ID cannot be blank")
    }))
})

const UpdateRow: React.FC<{
    toggleModal: () => void,
    afterUpdate?: ((val: any) => void) | null,
    note: any
}> = ({ toggleModal, afterUpdate, note }) => {
    const formik = useFormik<FormikValues>({
        validationSchema,
        initialValues: { ...note, title: note.title, note: note.note },
        validateOnBlur: false,
        onSubmit: async (formValues) => {
            try {
                const response = await supabaseClient
                    .from('notes')
                    .update({ note: formValues.note, title: formValues.title })
                    .eq('id', formValues.id)
                    .select()

                if (response.error) {
                    throw response.error
                }

                toast.success(<ToastSucccessText>Item updated successfully!</ToastSucccessText>, { position: "top-right" });

                if (afterUpdate) {
                    afterUpdate(formValues)
                }
            } catch (error: any) {
                toast.error(<ToastSucccessText>{error?.message || "Error updating item"}</ToastSucccessText>, { position: "top-right" });
            }
        }
    })

    const { values: formikValues } = formik

    return <form className="mt-20" aria-disabled={true} onSubmit={formik.handleSubmit}>
        <FormikProvider value={formik}>
            <div>
                <div>
                    <label
                        htmlFor="title"
                        className="text-white font-semibold font-figtree text-base">📌 Title</label>
                    <input
                        type="text"
                        id="title"
                        value={formikValues.title}
                        name={`title`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-3 rounded-sm bg-black200 border w-full h-[2.5rem] outline-0 px-3 text-white text-opacity-70 font-inter border-textGrey100 border-opacity-20`}
                    />
                </div>
                <ErrorMessage name={`title`} render={(msg) => <small className="text-red-500 font-inter">{msg}</small>} />

                <div className="mt-10">
                    <label className="text-white font-semibold font-figtree text-base" htmlFor="note">📝 Note</label>
                    <textarea
                        id="note"
                        rows={10}
                        name={`note`}
                        value={formikValues.note}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-3 rounded-sm bg-black200 border w-full outline-0 px-3 text-white text-opacity-70 font-inter border-textGrey100 border-opacity-20"
                    />
                </div>
                <ErrorMessage name={`note`} render={(msg) => <small className="text-red-500 font-inter">{msg}</small>} />
            </div>

            <div className="mt-20 flex flex-row justify-end">
                <button
                    onClick={toggleModal}
                    type="button"
                    className=" px-5 py-2 font-figtree font-bold border border-white rounded-lg text-white mr-5 flex flex-row items-center">Cancel</button>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className=" px-5 py-2 font-figtree font-bold bg-white rounded-lg text-black200 flex flex-row items-center">
                    Update
                    {formik.isSubmitting && <Spinner />}
                </button>
            </div>
        </FormikProvider>
    </form>
}


export default UpdateRow