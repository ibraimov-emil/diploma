import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import {useQuery} from "react-query";
import {Space, Table, Tag} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined, EyeOutlined, MessageOutlined} from "@ant-design/icons";
import {AuthContext} from "../../contexts/authContext";
import {fetchEmployees} from "../../services/EmployeeService";
import {Button} from "@mui/material";

const EmployeesList = observer(() => {
    const {data: employees, isLoading, isError} = useQuery('employees', fetchEmployees)
    const {user} = useContext(AuthContext)
    const navigate = useNavigate();
    
    // Function to open a chat with an employee
    const handleOpenChat = (employeeId, employeeName) => {
        // Navigate to chat page with this employee
        navigate(`/chats/${employeeId}`, { state: { employeeName } });
    };

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError){
        return <div>Error</div>
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['md'],
        },
        {
            title: 'Имя',
            dataIndex: ['user', 'name'],
            key: 'name',
            render: (text) => (
                <span className="font-semibold">{text}</span>
            ),
        },
        {
            title: 'Фамилия',
            dataIndex: ['user', 'surname'],
            key: 'surname',
            render: (text) => (
                <span className="font-semibold">{text}</span>
            ),
        },
        {
            title: 'Телефон',
            dataIndex: ['user', 'phone'],
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Роли',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <>
                    {roles && roles.map(role => (
                        <Tag color="blue" key={role.id} className="mb-1">
                            {role.value}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            key: "actions",
            title: "Действия",
            render: (record) => {
                return (
                    <Space size="middle">
                        {/* Write button for chat */}
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            startIcon={<MessageOutlined />}
                            onClick={() => handleOpenChat(record.id, `${record.user.name} ${record.user.surname}`)}
                        >
                            Написать
                        </Button>
                        
                        {!user.isClient &&
                            <>
                                <Link to={`/employees/edit/${record.id}`}>
                                    <EditOutlined />
                                </Link>
                            </>
                        }
                        <Link to={`/employees/view/${record.id}`}>
                            <EyeOutlined />
                        </Link>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="App">
            <header className="App-header">
                <Table 
                    columns={columns}
                    dataSource={employees}
                    loading={isLoading}
                    rowKey="id"
                    scroll={{ x: true }}
                    pagination={{ 
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} сотрудников`
                    }}
                    className="shadow-md rounded-lg overflow-hidden"
                />
            </header>
        </div>
    );
});

export default EmployeesList;
