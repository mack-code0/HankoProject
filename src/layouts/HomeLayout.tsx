import styled from "styled-components"
import SIZES from "../assets/SIZES"
import Sidebar from "../components/Sidebar/Sidebar"
import AuthGuard from "../routes/AuthGuard"

export default function HomeLayout({ children }: any) {
    return <AuthGuard>
        <Styles className="d-flex overflow-x-hidden">
            <Sidebar />
            <div className="homeLayout bg-black200">
                {children}
            </div>
        </Styles>
    </AuthGuard>
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