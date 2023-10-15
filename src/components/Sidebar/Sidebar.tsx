import styled from "styled-components"
import { BiHome } from "react-icons/bi"
import { CgHeart, CgLogOut, CgNotes, CgTrash, CgUserAdd } from "react-icons/cg"
import { Link } from "react-router-dom"
import { Avatar } from "antd"
import { useUserStore } from "../../utils/Store"
import { handleLogout } from "../../utils/HandleLogout"
import SIZES from "../../assets/SIZES"
import { useState } from "react"
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons"


export default function Sidebar() {
    const activeTab = window.location.pathname
    const user = useUserStore((state) => state.user)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return <Styles className={`${!sidebarOpen && "close-sidebar"} bg-shatteredIsland ml-0`}>
        <div className="bg-black100 bg-opacity-[0.5] h-full p-6">
            <div className="flex flex-row items-center justify-end">
                <Avatar size={40} className="mr-auto" style={{ background: "#015291" }} >{user?.email.charAt(0).toUpperCase()}</Avatar>
                <Link to={"/home"}><BiHome className="text-textGrey100 cursor-pointer text-2xl" /></Link>
                {/* <FaEllipsisV className="text-textGrey100 cursor-pointer text-xl" /> */}
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
                <Button
                    to={"/profile"}
                    className={`${activeTab === "/profile" ? "bg-blue100" : "hover:bg-white hover:bg-opacity-5"} hover:text-white transition-all rounded-full py-3 px-6 w-[10rem] flex flex-row items-center font-inter text-sm font-bold`}>
                    <CgUserAdd className="mr-4 text-xl" />Profile
                </Button>
                <button
                    onClick={() => handleLogout()}
                    className={`${activeTab === "" ? "bg-blue100" : "hover:bg-white hover:bg-opacity-5"} hover:text-white transition-all rounded-full py-3 px-6 w-[10rem] flex flex-row items-center font-inter text-sm font-bold`}>
                    <CgLogOut className="mr-4 text-xl" />Logout
                </button>
            </div>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="control bg-black100">
                {sidebarOpen
                    ? <DoubleLeftOutlined />
                    : <DoubleRightOutlined />}
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

    .control{
        all: unset;
        cursor: pointer;
        padding: 17.4233px 17.4809px;
        background: #111111;
        border-top-right-radius: 13.5963px;
        border-bottom-right-radius: 13.5963px;
        color: #fff;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14.5386px;
        display: none;
        margin-left: ${SIZES.sidebarWidth}px;
        position: absolute;
        top: 0;
        left: 0;
        transition: all 0.2s;
    }

    @media only screen and (max-width: 992px) {
        box-shadow: 42px -84px 83px 20px rgba(0, 0, 0, 0.226);
        .control{
            display: flex;
            align-items: center;
        }
        &.close-sidebar{
            box-shadow: none;
            margin-left: -${SIZES.sidebarWidth}px;
            width: 0;
        }
    }
`