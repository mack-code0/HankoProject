import { Drawer } from "antd"
import { RiCloseCircleFill } from "react-icons/ri"

const SideModal: React.FC<{
    open: boolean,
    width?: string | number,
    toggle: () => void,
    children?: React.ReactNode,
    header?: string
}>
    = ({ open, width, toggle, children, header }) => {
        return <Drawer
            title={null}
            width={width || "40%"}
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