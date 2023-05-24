import React from 'react';
import { useQuery } from 'react-query';
import { Avatar, Divider, Spin, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {getMyProfile} from "../services/UserService";
import {fetchProjects} from "../services/ProjectService"; // Функция для получения профиля пользователя

const { Title, Text } = Typography;

const MyProfile = () => {
  // const { userId } = useParams(); // Извлекаем идентификатор пользователя из строки URL
  const { isLoading, error, data: user } = useQuery('myProfile', getMyProfile);

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <div className="p-4">
      <Avatar size={64} icon={<UserOutlined />} />
      <Title level={3}>
        {user.name} {user.surname}
      </Title>
      <Divider />

      <div>
        <Text strong>Email:</Text>
        <Text>{user.email}</Text>
      </div>
      <div>
        <Text strong>Phone:</Text>
        <Text>{user.phone}</Text>
      </div>
      <div>
        <Text strong>Birthday:</Text>
        <Text>{user.happyBirthday}</Text>
      </div>
      <div>
        <Text strong>Banned:</Text>
        <Text>{user.banned ? 'Yes' : 'No'}</Text>
      </div>
      {user.banned && (
        <div>
          <Text strong>Ban Reason:</Text>
          <Text>{user.banReason}</Text>
        </div>
      )}

      {user.employee && (
        <>
          <Divider />
          <Title level={4}>Employee Details</Title>
          <Text>Description: {user.employee.description}</Text>
        </>
      )}

      {user.client && (
        <>
          <Divider />
          <Title level={4}>Client Details</Title>
          <Text>Company Name: {user.client.nameCompany}</Text>
        </>
      )}
    </div>
  );
};

export default MyProfile;