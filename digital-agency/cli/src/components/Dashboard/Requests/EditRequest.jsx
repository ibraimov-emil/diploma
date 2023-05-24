import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, message, Select } from 'antd';
import { Button } from '@mui/material';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from 'axios';
import {fetchRequest, fetchServices, fetchStatuses, updateRequest} from "../../../services/RequestService";
import {fetchClients} from "../../../services/ClientService";
import {Header} from "../index";

const { Option } = Select;

const EditRequest = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const {data: request, isLoading, isError} = useQuery(['request', id], () => fetchRequest(id))

  const {data: services} = useQuery('services', fetchServices)
  const {data: clients, isLoading: isLoadingClients, isError: isErrorClients} = useQuery('clients', fetchClients)
  const {data: statuses} = useQuery('statuses', fetchStatuses)

  const updateRequestMutation  = useMutation(requestData => updateRequest(requestData),
      {onSuccess: () => queryClient.invalidateQueries(["requests"])}
  )
  // const updateRequest = useMutation((requestData) => axios.put(`/requests/${id}`, requestData));

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log(values)
      updateRequestMutation.mutate({id: id, requestData: values});
      message.success('Request updated successfully');
      navigate('/requests/list');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update request');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <>Loading</>
  }
  console.log(request)

  return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Страница" title="Редактировать заявку" />
      <div className="flex justify-between items-center mb-4">
      </div>
      <Form layout="vertical" onFinish={onFinish} initialValues={request}>
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
            Обновить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditRequest;