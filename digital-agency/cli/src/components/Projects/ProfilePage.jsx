import React, {useContext} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {Divider, Spin, Typography, Button as AntButton, Tooltip} from "antd";
import {fetchOneUser} from "../../services/UserService";
import {useQuery} from "react-query";
import {AuthContext} from "../../contexts/authContext";
import {observer} from "mobx-react-lite";
import {UserOutlined, MessageOutlined} from "@ant-design/icons";
import {Avatar} from 'antd';
const { Title, Text } = Typography;

const ProfilePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const {data: userData, isLoading, isError} = useQuery(
        `profile/${id}`, 
        () => fetchOneUser(id), 
        {refetchOnWindowFocus: false}
    );

    // Function to open a chat with the profile user
    const handleOpenChat = () => {
        if (!userData) return;
        
        // Navigate to chat page with this user
        const userName = `${userData.name} ${userData.surname}`;
        navigate(`/chats/${id}`, { state: { userName } });
    };

    if (isLoading) {
        return <Spin size="large" className="flex justify-center mt-20" />;
    }

    if (isError) {
        return <div className="p-4 text-red-500">Ошибка при загрузке профиля</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Avatar size={80} icon={<UserOutlined/>} className="mr-4" />
                    <div>
                        <Title level={3} className="mb-0">
                            {userData.name} {userData.surname}
                        </Title>
                        <Text type="secondary">{userData.employee ? 'Сотрудник' : 'Клиент'}</Text>
                    </div>
                </div>
                
                {/* Chat button - only show if not the current user */}
                {user?.user?.id !== parseInt(id) && (
                    <Tooltip title="Начать чат">
                        <AntButton 
                            type="primary" 
                            shape="round" 
                            icon={<MessageOutlined />} 
                            size="large"
                            onClick={handleOpenChat}
                        >
                            Написать
                        </AntButton>
                    </Tooltip>
                )}
            </div>
            
            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <Text strong className="block text-gray-500">Email:</Text>
                    <Text className="text-lg">{userData.email}</Text>
                </div>
                <div className="mb-4">
                    <Text strong className="block text-gray-500">Телефон:</Text>
                    <Text className="text-lg">{userData.phone}</Text>
                </div>
                <div className="mb-4">
                    <Text strong className="block text-gray-500">Дата рождения:</Text>
                    <Text className="text-lg">{userData.happyBirthday || 'Не указана'}</Text>
                </div>
                
                {userData.banned && (
                    <div className="mb-4 col-span-2">
                        <Text strong className="block text-red-500">Заблокирован:</Text>
                        <Text className="text-lg text-red-500">{userData.banReason}</Text>
                    </div>
                )}
            </div>

            {userData.employee && (
                <>
                    <Divider />
                    <Title level={4}>Информация о сотруднике</Title>
                    <div className="p-4 bg-gray-50 rounded-md">
                        <Text strong className="block mb-2">Описание:</Text>
                        <Text>{userData.employee.description || 'Описание отсутствует'}</Text>
                    </div>
                </>
            )}

            {userData.client && (
                <>
                    <Divider />
                    <Title level={4}>Информация о клиенте</Title>
                    <div className="p-4 bg-gray-50 rounded-md">
                        <Text strong className="block mb-2">Название компании:</Text>
                        <Text>{userData.client.nameCompany || 'Не указано'}</Text>
                    </div>
                </>
            )}
        </div>
    );
};

export default observer(ProfilePage);

