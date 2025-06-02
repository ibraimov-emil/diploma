import React, { useState } from 'react';
import { Form, Input, Select, Button, Alert, Typography, Spin, Card } from 'antd';
import { useQuery, useMutation } from 'react-query';
import $host from '../../../services';
import { API_URL } from '../../../services/index';
import { QualityService } from '../../../services';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const IncidentForm = () => {
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Fetch current user info to use as the creator
  const { data: currentUser, isLoading: userLoading } = useQuery('currentUser', 
    async () => {
      try {
        const { data } = await $host.get(`${API_URL}auth/user`);
        return data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    }
  );

  // Create incident mutation
  const createIncidentMutation = useMutation(
    async (values) => {
      return await QualityService.createIncident(values);
    },
    {
      onSuccess: () => {
        form.resetFields();
        setFormSubmitted(true);
        // Reset success message after 5 seconds
        setTimeout(() => setFormSubmitted(false), 5000);
      }
    }
  );

  const onFinish = (values) => {
    const incidentData = {
      ...values,
      userId: currentUser?.id || 1, // Use current user ID or fallback to 1
      registrationTime: new Date(),
      status: 'open'
    };
    
    createIncidentMutation.mutate(incidentData);
  };
  
  if (userLoading) {
    return <Spin size="large" />;
  }

  return (
    <Card className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Title level={2}>Сообщить об инциденте</Title>
      <p className="text-gray-500 mb-6">
        Используйте эту форму для сообщения о технических проблемах, сбоях или других инцидентах в системе.
      </p>
      
      {formSubmitted && (
        <Alert
          message="Инцидент успешно зарегистрирован"
          description="Специалисты уже работают над решением проблемы."
          type="success"
          showIcon
          className="mb-6"
        />
      )}
      
      {createIncidentMutation.isError && (
        <Alert
          message="Ошибка при создании инцидента"
          description={createIncidentMutation.error.message || "Пожалуйста, попробуйте позже."}
          type="error"
          showIcon
          className="mb-6"
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          severity: 'medium',
        }}
      >
        <Form.Item
          name="title"
          label="Заголовок"
          rules={[{ required: true, message: 'Пожалуйста, введите заголовок инцидента' }]}
        >
          <Input placeholder="Краткое описание проблемы" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Подробное описание"
          rules={[{ required: true, message: 'Пожалуйста, опишите инцидент' }]}
        >
          <TextArea 
            placeholder="Укажите детали: что произошло, когда, какие действия привели к проблеме" 
            rows={4} 
          />
        </Form.Item>
        
        <Form.Item
          name="severity"
          label="Важность"
          rules={[{ required: true, message: 'Пожалуйста, выберите уровень важности' }]}
        >
          <Select>
            <Option value="low">Низкая</Option>
            <Option value="medium">Средняя</Option>
            <Option value="high">Высокая</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="metadata"
          label="Дополнительная информация"
        >
          <TextArea 
            placeholder="URL страницы, версия браузера, операционная система и т.п." 
            rows={2} 
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={createIncidentMutation.isLoading}
            size="large"
          >
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default IncidentForm; 