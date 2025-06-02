import React, { useState, useContext } from 'react';
import {HashRouter, useNavigate} from 'react-router-dom';
import { Form, Input, message, Select } from 'antd';
import { Button } from '@mui/material';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from 'axios';
import {createOneRequest, createClientRequest, fetchRequest, fetchServices, fetchStatuses} from "../../services/RequestService";
import {fetchClients} from "../../services/ClientService";
import {Header} from "../Dashboard";
import RequestList from "./RequestList";
import {AuthContext} from "../../contexts/authContext";

const { Option } = Select;

const AddRequest = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const {user} = useContext(AuthContext);

  const {data: services, isLoading, isError} = useQuery('services', fetchServices)
  const {data: clients, isLoading: isLoadingClients, isError: isErrorClients} = useQuery('clients', fetchClients)
  const {data: statuses} = useQuery('statuses', fetchStatuses)
  
  const createAdminRequestMutation = useMutation(requestData => createOneRequest(requestData),
      {onSuccess: () => queryClient.invalidateQueries(["requests"])}
  );
  
  const createClientRequestMutation = useMutation(requestData => createClientRequest(requestData),
      {onSuccess: () => queryClient.invalidateQueries(["requests"])}
  );

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Use different mutation based on user role
      if (user.isClient) {
        // For clients, we only need serviceId and description
        // The backend will set the clientId and statusId
        createClientRequestMutation.mutate({
          serviceId: values.serviceId,
          clientId: user.user.id,
          statusId: 1,
          description: values.description
        });
      } else {
        // For admins, use the full form data
        createAdminRequestMutation.mutate(values);
      }
      
      message.success('Request added successfully');
      navigate('/requests');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to add request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="Добавить заявку" />

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
        
        {/* Only show the Client field if user is not a client */}
        {!user.isClient && (
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
        )}

        {!user.isClient && (
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
        )}
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
