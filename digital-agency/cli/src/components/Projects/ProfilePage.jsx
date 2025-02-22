import React, {useContext} from 'react';
import {useParams} from "react-router-dom";
import {Divider, Spin, Typography} from "antd";
import {fetchOneUser} from "../../services/UserService";
import {useQuery} from "react-query";
import {AuthContext} from "../../contexts/authContext";
import {observer} from "mobx-react-lite";
import {UserOutlined} from "@ant-design/icons";
import {Avatar} from 'antd';
const { Title, Text } = Typography;

const ProfilePage = () => {
    const {id} = useParams()
    const {data: userData, isLoading, isError, } = useQuery(`profile/${id}`, () => fetchOneUser(id),{refetchOnWindowFocus: false});

    if (isLoading) {
        return <Spin/>;
    }

    if (isError) {
        return <Text>Error: </Text>;
    }

    return (
        <div className="p-4">
            <Avatar size={64} icon={<UserOutlined/>}/>
            <Title level={3}>
                {userData.name} {userData.surname}
            </Title>
            <Divider/>

            <div>
                <Text strong>Email:</Text>
                <Text>{userData.email}</Text>
            </div>
            <div>
                <Text strong>Phone:</Text>
                <Text>{userData.phone}</Text>
            </div>
            <div>
                <Text strong>Birthday:</Text>
                <Text>{userData.happyBirthday}</Text>
            </div>
            <div>
                <Text strong>Banned:</Text>
                <Text>{userData.banned ? 'Yes' : 'No'}</Text>
            </div>
            {userData.banned && (
                <div>
                    <Text strong>Ban Reason:</Text>
                    <Text>{userData.banReason}</Text>
                </div>
            )}

            {userData.employee && (
                <>
                    <Divider/>
                    <Title level={4}>Employee Details</Title>
                    <Text>Description: {userData.employee.description}</Text>
                </>
            )}

            {userData.client && (
                <>
                    <Divider/>
                    <Title level={4}>Client Details</Title>
                    <Text>Company Name: {userData.client.nameCompany}</Text>
                </>
            )}
        </div>
    );
};

export default observer(ProfilePage);

