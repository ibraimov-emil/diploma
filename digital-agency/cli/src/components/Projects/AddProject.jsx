import React, { useState } from 'react';
import {HashRouter, useNavigate} from 'react-router-dom';
import { Form, Input, message, Select } from 'antd';
import { Button } from '@mui/material';
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


const { Option } = Select;

const AddProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false);

  const {data: requests, } = useQuery('requests', fetchRequests)
  const {data: services, isLoading, isError} = useQuery('services', fetchServices)
  const {data: clients, isLoading: isLoadingClients, isError: isErrorClients} = useQuery('clients', fetchClients)
  const {data: statuses} = useQuery('statuses', fetchStatuses)

  const createProjectMutation  = useMutation(data => createOneProject(data),
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
      <Header category="Страница" title="Создать проект" />

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input rows={4} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: false, message: 'Please enter the description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="serviceId"
          label="Service"
          rules={[{ required: true, message: 'Please select the service' }]}
        >
          <Select placeholder="Select a service">
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
          label="Client"
          rules={[{ required: true, message: 'Please select the client' }]}
        >
          <Select placeholder="Select a client">
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
          label="Status"
          rules={[{ required: true, message: 'Please select the status' }]}
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
        <Form.Item
          name="requestId"
          label="Request"
          rules={[{ required: false, message: 'Please select the request' }]}
        >
          <Select placeholder="Select a status">
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