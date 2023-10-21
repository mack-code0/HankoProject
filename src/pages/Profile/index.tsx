import { ConfigProvider, Tabs } from "antd";
import { useState } from "react";
import { HiUser } from "react-icons/hi"
import { GiPadlock } from "react-icons/gi"
import Account from "./subComponents/Account";
import Security from "./subComponents/Security";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("1")
    return (<div className="p-5">
        <ConfigProvider
            theme={{
                token: {
                    colorBorderSecondary: "#363636",
                },
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={[
                    {
                        label: (
                            <span className={`flex items-center ${activeTab === "1" ? 'text-blue100 font-semibold' : 'text-textGrey100'}`}>
                                <HiUser className="text-xl mr-1" />
                                Account
                            </span>
                        ),
                        key: "1",
                        children: <Account />,
                    },
                    {
                        label: (
                            <span className={`flex items-center ${activeTab === "2" ? 'text-blue100 font-semibold' : 'text-textGrey100'}`}>
                                <GiPadlock className="text-xl mr-1" />
                                Security
                            </span>
                        ),
                        key: "2",
                        children: <Security />,
                    }
                ]}
            />
        </ConfigProvider>
    </div>);
}

export default Profile;