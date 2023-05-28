import styled from "styled-components"
import { BiHome } from "react-icons/bi"
import { FaEllipsisV } from "react-icons/fa"
import { CgHeart, CgLogOut, CgNotes, CgTrash } from "react-icons/cg"
import { Link } from "react-router-dom"
import { Avatar } from "antd"
import { useUserStore } from "../../utils/Store"
import { handleLogout } from "../../utils/HandleLogout"
import SIZES from "../../assets/SIZES"

export default function Sidebar() {
    const activeTab = window.location.pathname
    const user = useUserStore((state) => state.user)

    return <Styles className="bg-black100 ml-0 p-6">
        <div className="flex flex-row items-center justify-end">
            <Avatar size={40} src={user?.photoURL} className="mr-auto" />
            <BiHome className="text-textGrey100 cursor-pointer text-2xl mr-3" />
            <FaEllipsisV className="text-textGrey100 cursor-pointer text-xl" />
        </div>

        <h4 className="font-figtree font-bold text-center text-textGrey100 text-base mt-10">Quick Links</h4>
        <div className="mt-7 space-y-7 text-white flex flex-col items-center justify-center">
            <Button
                to={"/home"}
                className={`${activeTab === "/home" ? "bg-blue100" : "hover:bg-white hover:bg-opacity-5"} hover:text-white transition-all rounded-full py-3 px-6 w-[10rem] flex flex-row items-center font-inter text-sm font-bold`}>
                <CgNotes className="mr-4 text-xl" />Home
            </Button>
            <Button
                to={"/favourites"}
                className={`${activeTab === "/favourites" ? "bg-blue100" : "hover:bg-white hover:bg-opacity-5"} hover:text-white transition-all rounded-full py-3 px-6 w-[10rem] flex flex-row items-center font-inter text-sm font-bold`}>
                <CgHeart className="mr-4 text-xl" />Favourites
            </Button>
            <Button
                to={"/deleted"}
                className={`${activeTab === "/deleted" ? "bg-blue100" : "hover:bg-white hover:bg-opacity-5"} hover:text-white transition-all rounded-full py-3 px-6 w-[10rem] flex flex-row items-center font-inter text-sm font-bold`}>
                <CgTrash className="mr-4 text-xl" />Deleted
            </Button>
            <button
                onClick={() => handleLogout()}
                className={`${activeTab === "" ? "bg-blue100" : "hover:bg-white hover:bg-opacity-5"} hover:text-white transition-all rounded-full py-3 px-6 w-[10rem] flex flex-row items-center font-inter text-sm font-bold`}>
                <CgLogOut className="mr-4 text-xl" />Logout
            </button>
        </div>
    </Styles>
}

const Button = styled(Link)`
`

const Styles = styled.div`
    width: ${SIZES.sidebarWidth}px;
    height: 100vh;
    position: fixed;
    z-index: 1;
    transition: all 0.2s;
    box-shadow: none;
`