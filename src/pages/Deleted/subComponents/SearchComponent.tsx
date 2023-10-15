import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "antd"
import { CgSearch } from "react-icons/cg"
import { useFormik } from "formik";
import { useEffect } from "react";
import NoteRow from "../../../components/NoteRow/NoteRow";
import Spinner from "../../../components/Spinner";
import supabaseClient from "../../../utils/supabaseClient";
import { useUserStore } from "../../../utils/Store";
import toast from "react-hot-toast";
import ToastText from "../../../components/ToastText";
import NoNote from "../../../components/NoNote";
import { note } from "../../../utils/types";
import { AiFillCloseCircle } from "react-icons/ai";

const SearchComponent: React.FC<{
    afterNoteRestored: (id: string) => void
}> = ({ afterNoteRestored }) => {
    const user = useUserStore((state) => state.user)
    const { handleChange, values } = useFormik({
        initialValues: { searchText: "" },
        onSubmit: () => { fetchData() }
    })

    const [dataState, setDataState] = useState({
        isLoading: false,
        data: [] as any
    })

    const updateSearchedValues = (id: string) => setDataState(prev => {
        const tempNoteArr = prev.data.filter((val: any) => val.id !== id)
        return { ...prev, data: [...tempNoteArr] }
    })

    const fetchData = async () => {
        setDataState((prev) => ({ ...prev, isLoading: true }))

        try {
            let { data: notes, error } = await supabaseClient
                .from('temporaryNotes')
                .select('*')
                .eq("user", user?.hankoId)
                .ilike('note', `%${values.searchText}%`)
                .ilike('title', `%${values.searchText}%`)
                .order("createdAt", { ascending: true })

            if (error) {
                throw error
            }

            setDataState(prev => ({ ...prev, data: notes, tempData: notes }))
        } catch (error: any) {
            toast.error(<ToastText>{error?.message || "Error getting array field"}</ToastText>);
        } finally {
            setDataState((prev) => ({ ...prev, isLoading: false }))
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (values.searchText.length > 0) {
                fetchData()
            }
        }, 800)

        return () => clearTimeout(timer)
    }, [values.searchText])


    const [showBox, setShowBox] = React.useState(false)

    // useEffect(()=>{},[])

    return (<div className="relative">
        <CustomInput
            onChange={() => { }}
            onClick={() => setShowBox(!showBox)}
            value={""}
            autoComplete="off"
            name="searchText"
            size="large"
            placeholder="Search Deleted Notes"
            prefix={<CgSearch className="mr-3 text-2xl text-white" />} />

        {showBox
            && <div
                onClick={(e: any) => {
                    if (e.target.id === "wrapper") {
                        setShowBox(!showBox)
                    }
                }}
                id="wrapper"
                className="flex justify-center backdrop-blur-sm p-4 z-[100] rounded-lg bg-[#393939]/[0.7] w-[100vw] h-[100vh] fixed left-0 top-[0] cursor-pointer">
                <div className="relative bg-[#1D1D1D] border border-textGrey100/[0.3] rounded-lg w-full md:w-1/2 cursor-auto">
                    <AiFillCloseCircle
                        onClick={() => setShowBox(!showBox)}
                        className="z-[100] absolute -top-4 -right-4 text-textGrey100 text-5xl !cursor-pointer" />
                    <InnerInput
                        onChange={handleChange}
                        value={values.searchText}
                        autoFocus
                        allowClear
                        name="searchText"
                        size="large"
                        placeholder="Search Deleted Notes"
                        prefix={<CgSearch className="mr-3 text-2xl text-white" />} />
                    <div className="p-5">
                        {dataState.isLoading
                            ? <div className="flex items-center justify-center">
                                <Spinner color="#a5a5a5" size={10} />
                            </div>
                            : dataState.data.length < 1
                                ? <NoNote />
                                : <div className="space-y-10 transform">
                                    {dataState.data.map((note: note, idx: number) =>
                                        <NoteRow
                                            afterNoteRestored={() => {
                                                updateSearchedValues(note.id)
                                                afterNoteRestored(note.id)
                                            }}
                                            key={idx}
                                            note={note}
                                            fromDeletePage={true}
                                        />
                                    )}
                                </div>}
                    </div>
                </div>
            </div>}
    </div>);
}

export const InnerInput = styled(Input)`
    background: none !important;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #a5a5a542 !important;
    box-shadow: none;
    padding-left: 17px !important;
    padding-right: 17px !important;
    input{
        background: none !important;
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        color: white;
        font-family: inter;

        &::placeholder{
            color: #A5A5A5 !important;
        }
    }
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

        &::placeholder{
            color: #A5A5A5 !important;
        }
    }
`

export default SearchComponent;