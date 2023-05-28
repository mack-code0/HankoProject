import styled from "styled-components"
import SIZES from "../assets/SIZES"
import AuthProvider from "../utils/AuthProvider"
import Sidebar from "../components/Sidebar/Sidebar"

export default function HomeLayout({ children }: any) {
    return <AuthProvider>
        <Styles className="d-flex">
            <Sidebar />
            <div className="homeLayout bg-black200">
                {children}
            </div>
        </Styles>
    </AuthProvider>
}

const Styles = styled.div`
    overflow-x: hidden;
    .homeLayout{
        height: 100vh;
        overflow-y: scroll;
        margin-left: ${SIZES.sidebarWidth}px;
        @media only screen and (max-width: 992px) {
            margin-left: 0 !important;
        }
    }
`