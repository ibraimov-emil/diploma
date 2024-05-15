import React, {useState} from 'react';
import {HashRouter, useNavigate} from 'react-router-dom';
import {Form, Input, message, Select} from 'antd';
import {Button} from '@mui/material';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from 'axios';
import {Header} from "../Dashboard";
import {fetchClients} from "../../services/ClientService";
import {
    createOneRequest,
    deleteOneRequest,
    fetchRequests,
    fetchServices,
    fetchStatuses
} from "../../services/RequestService";
import {createOneProject} from "../../services/ProjectService";
import {fetchEmployees} from "../../services/UserService";


const {Option} = Select;

const AddProject = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false);

    const {data: requests,} = useQuery('requests', fetchRequests)
    const {data: services, isLoading, isError} = useQuery('services', fetchServices)
    const {data: clients, isLoading: isLoadingClients, isError: isErrorClients} = useQuery('clients', fetchClients)
    const {data: statuses} = useQuery('statuses', fetchStatuses)
    const {data: employees} = useQuery('employees', fetchEmployees)

    const createProjectMutation = useMutation(data => createOneProject(data),
        {onSuccess: () => queryClient.invalidateQueries(["projects"])}
    )

    const onFinish = async (values) => {
        setLoading(true);
        try {
            createProjectMutation.mutate(values);
            message.success('Request added successfully');
            navigate('/projects');
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to add request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header title="Создать проект"/>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Название"
                    rules={[{required: true, message: 'Please enter the name'}]}
                >
                    <Input rows={4}/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Описание"
                    rules={[{required: false, message: 'Please enter the description'}]}
                >
                    <Input.TextArea rows={4}/>
                </Form.Item>
                <Form.Item
                    name="serviceId"
                    label="Услуга"
                    rules={[{required: true, message: 'Please select the service'}]}
                >
                    <Select placeholder="Выберите услугу">
                        {services &&
                            services.map((service) => (
                                <Option key={service.id} value={service.id}>
                                    {service.name}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="clientId"
                    label="Клиент"
                    rules={[{required: true, message: 'Please select the client'}]}
                >
                    <Select placeholder="Выберите клиента">
                        {clients &&
                            clients.map((client) => (
                                <Option key={client.id} value={client.id}>
                                    {client.user.id} {client.user.name} {client.user.surname} {client.user.email}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="statusId"
                    label="Статус"
                    rules={[{required: true, message: 'Please select the status'}]}
                >
                    <Select placeholder="Выберите статус">
                        {statuses &&
                            statuses.map((status) => (
                                <Option key={status.id} value={status.id}>
                                    {status.name}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="employeesIds"
                    label="Выберите сотрудников"
                    rules={[{required: true, message: 'Выберите сотрудников', type: 'array'}]}
                >
                    <Select mode="multiple" placeholder="Выберите сотрудников">
                        {employees &&
                            employees.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.user.name} {item.user.surname} - {item.description}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="requestId"
                    label="Заявка"
                    rules={[{required: false, message: 'Please select the request'}]}
                >
                    <Select placeholder="Выберите статус">
                        {requests &&
                            requests.map((request) => (
                                <Option key={request.id} value={request.id}>
                                    {request.id} {request.description}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProject;
