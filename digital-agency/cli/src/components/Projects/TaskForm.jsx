import React, {useEffect, useState} from 'react'
import {DatePicker, Form, Input, message, Modal, Select} from "antd";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {fetchRequests, fetchServices, fetchStatuses} from "../../services/RequestService";
import {fetchClients} from "../../services/ClientService";
import {createOneTask, fetchProject, fetchTask, updateProject, updateTask} from "../../services/ProjectService";
import {Button} from "@mui/material";
import {fetchEmployees} from "../../services/UserService";
import dayjs from "dayjs";

const {Option} = Select;

const TaskForm = ({stageId, id, onClose}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const {data: requests,} = useQuery('requests', fetchRequests)
    const {data: services, isLoading, isError} = useQuery('services', fetchServices)
    const {data: clients, isLoading: isLoadingClients, isError: isErrorClients} = useQuery('clients', fetchClients)
    const {data: statuses} = useQuery('statuses', fetchStatuses)
    const {data: employees} = useQuery('employees', fetchEmployees)

    const { data: task, isLoading: isLoadingTask, isError: isErrorTask } = useQuery(['task', id], () => fetchTask(id), {
        enabled: !!id, // only fetch task if id is provided
    });

    const createTaskMutation = useMutation(newTask => createOneTask(newTask),
        {onSuccess: () => queryClient.invalidateQueries(["tasks"])}
    )

    const updateTaskMutation = useMutation(updatedTask => updateTask(id, updatedTask), { // Corrected mutation
        onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    });

    useEffect(() => {
        if (task) {
            console.log(task.deadline)
            form.setFieldsValue({
                name: task.name,
                description: task.description,
                employeesIds: task.employeesIds,
                // employeesIds: task.employees.map(e => e.id),
                // statusId: task.status.id,
                deadline: task.deadline ? dayjs(task.deadline) : null, // Преобразование строки в объект dayjs
            });
        }
    }, [task, form]);

    const onFinish = async (values) => {
        try {
            if (id) {
                await updateTaskMutation.mutateAsync({ ...values, id });
                message.success('Task updated successfully');
            } else {
                await createTaskMutation.mutateAsync({ ...values, stageId });
                message.success('Task added successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to submit task');
        }
    };

    return (
        <div className="m-2 p-2 bg-white rounded-3xl">
            <Form layout="vertical" onFinish={onFinish} form={form}>
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
                    name="employeesIds"
                    label="Выберите исполнителей"
                    rules={[{required: true, message: 'Выберите сотрудников', type: 'array'}]}
                >
                    <Select mode="multiple" placeholder="Выберите исполнителей">
                        {employees &&
                            employees.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.user.name} {item.user.surname} - {item.description}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="statusId"
                    label="Status"
                    rules={[{required: true, message: 'Please select the status'}]}
                >
                    <Select placeholder="Select a status">
                        {statuses &&
                            statuses.map((status) => (
                                <Option key={status.id} value={status.id}>
                                    {status.name}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item name="deadline" label="Дедлайн"
                           rules={[{type: 'object', required: true, message: 'Выберите дедлайн'}]}
                >
                    <DatePicker style={{ width: '100%' }}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {id ? `Редактировать` : 'Создать'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default TaskForm
