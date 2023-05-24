import React, { useState } from 'react';
import {HashRouter, useNavigate} from 'react-router-dom';
import { Form, Input, message, Select } from 'antd';
import { Button } from '@mui/material';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from 'axios';
import {createOneRequest, fetchRequest, fetchServices, fetchStatuses} from "../../../services/RequestService";
import {fetchClients} from "../../../services/ClientService";
import {Header} from "../index";
import RequestList from "./RequestList";

const { Option } = Select;

const AddRequest = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false);

  const {data: services, isLoading, isError} = useQuery('services', fetchServices)
  const {data: clients, isLoading: isLoadingClients, isError: isErrorClients} = useQuery('clients', fetchClients)
  const {data: statuses} = useQuery('statuses', fetchStatuses)
  {console.log(clients)}
  const createStageMutation  = useMutation(requestData => createOneRequest(requestData),
      {onSuccess: () => queryClient.invalidateQueries(["requests"])}
  )

  const onFinish = async (values) => {
    setLoading(true);
    try {
      createStageMutation.mutate(values);
      message.success('Request added successfully');
      navigate('/requests/list');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to add request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Страница" title="Добавить заявку" />

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the description' }]}
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
                  {client.user.name} {client.user.surname} {client.user.email}
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Создать
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRequest;