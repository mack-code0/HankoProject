import { Avatar } from "antd";
import avatarImg from "../../../assets/images/shattered-island.gif"
import { useUserStore } from "../../../utils/Store";
import { Form, Formik } from "formik";
import * as Yup from "yup"
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import supabaseClient from "../../../utils/supabaseClient";
import toast from "react-hot-toast";
import ToastText from "../../../components/ToastText";
import { TbPhotoPlus } from "react-icons/tb"

const Account = () => {
    const user = useUserStore((state) => state.user)
    const updateUserStore = useUserStore((state) => state.setUser);

    return (<div className="py-5">
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <TbPhotoPlus
                    onClick={() => toast("📌 Feature coming soon!...", { className: "bg-blue100 text-white" })}
                    className="absolute right-0 text-4xl z-[2000] cursor-pointer text-blue100" />

                <Avatar style={{ background: `url(${avatarImg})` }} size={100}>
                    <span className="text-2xl font-semibold">
                        {user?.email.charAt(0).toUpperCase()}
                    </span>
                </Avatar>
            </div>

            <div className="mt-5">
                <Formik
                    validationSchema={Yup.object({
                        name: Yup.string().required("Name cannot be blank")
                    })}
                    initialValues={{ name: user?.name }}
                    onSubmit={async (formValues) => {
                        try {
                            const { data: users, error } = await supabaseClient
                                .from('users')
                                .update({ name: formValues.name })
                                .eq('hankoId', user?.hankoId)
                                .select()

                            if (error) {
                                throw error
                            }

                            updateUserStore(users[0])

                            toast.success(<ToastText>Name updated successfully!</ToastText>, { position: "top-right" });
                        } catch (error: any) {
                            toast.error(<ToastText>{error?.message || "Error updating Name"}</ToastText>, { position: "top-right" });
                        }
                    }}
                >
                    {({ errors, handleChange, handleBlur, isSubmitting, values }) =>
                        <Form>
                            <div className="w-full md:w-[300px]">
                                <Input
                                    autoComplete="false"
                                    error={errors.name ? true : false}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    placeholder="Enter Your Name"
                                    className="bg-black29" />
                            </div>

                            <Button
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                className="mt-3 ml-auto rounded-md">Update</Button>
                        </Form>}
                </Formik>
            </div>
        </div>
    </div>);
}

export default Account;