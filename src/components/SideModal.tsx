import { Drawer } from "antd"
import { useEffect, useState } from "react"
import { RiCloseCircleFill } from "react-icons/ri"

const SideModal: React.FC<{
    open: boolean,
    width?: string | number,
    toggle: () => void,
    children?: React.ReactNode,
    header?: string
}>
    = ({ open, width, toggle, children, header }) => {
        const [screenWidth, setScreenWidth] = useState(window.innerWidth)

        const handleScreenResize = () => {
            setScreenWidth(window.innerWidth);
        }

        useEffect(() => {
            window.addEventListener("resize", handleScreenResize)
            return () => window.removeEventListener("resize", handleScreenResize)
        }, [])


        return <Drawer
            title={null}
            width={screenWidth < 850 ? "100%" : (width || "40%")}
            placement={"right"}
            closable={false}
            onClose={toggle}
            visible={open}
            destroyOnClose
            bodyStyle={{ background: "#111111" }}
        >
            <div className="flex flex-row w-full items-center justify-between">
                {header && <h6 className="text-white text-xl font-inter font-bold">{header}</h6>}
                <RiCloseCircleFill onClick={toggle} className="text-white text-opacity-80 text-4xl ml-auto cursor-pointer" />
            </div>
            {children}
        </Drawer>
    }

export default SideModal