import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Card, Avatar, Space, message } from 'antd';

import axios from 'axios';
import {MessageOutlined} from "@mui/icons-material";

const { Meta } = Card;

const EmployeesProject = () => {
    const { data: employees, isLoading, isError } = useQuery('employees', async () => {
        const response = await axios.get('/api/employees'); // Замените на ваш эндпоинт для получения данных сотрудников
        return response.data;
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Failed to fetch employees</div>;
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {employees.map((employee) => (
                <Card key={employee.id}>
                    <Meta
                        avatar={<Avatar>{employee.user.name[0]}</Avatar>}
                        title={`${employee.user.name} ${employee.user.surname}`}
                        description={`ID: ${employee.id}`}
                    />
                    <div className="mt-2">
                        <MessageOutlined onClick={() => message.info('Send message')} />
                    </div>
                </Card>
            ))}
        </Space>
    );
};

export default EmployeesProject;