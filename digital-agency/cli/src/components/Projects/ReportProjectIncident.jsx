import React, { useState } from 'react';
import { Form, Input, Select, Button, Alert, Typography, Modal } from 'antd';
import { useQuery, useMutation } from 'react-query';
import $host from '../../services';
import { API_URL } from '../../services/index';
import { QualityService } from '../../services';
import { WarningOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const ReportProjectIncident = ({ projectId, projectName, visible, onClose }) => {
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
        // Reset success message after 3 seconds
        setTimeout(() => {
          setFormSubmitted(false);
          onClose();
        }, 3000);
      }
    }
  );

  const onFinish = (values) => {
    // Ensure required fields have default values
    const incidentData = {
      title: values.title?.trim() || `Проблема с проектом #${projectId}`,
      description: values.description?.trim() || 'Не указано',
      severity: values.severity || 'medium',
      userId: currentUser?.id || 1,
      registrationTime: new Date(),
      status: 'open',
      relatedEntityType: 'project',
      relatedEntityId: projectId,
      requestTitle: projectName,
      additionalInfo: values.additionalInfo?.trim() || ''
    };
    
    createIncidentMutation.mutate(incidentData);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={<span><WarningOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />Сообщить о проблеме с проектом</span>}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <p className="text-gray-500 mb-4">
        Используйте эту форму для сообщения о проблемах, связанных с проектом #{projectId}.
      </p>
      
      {formSubmitted && (
        <Alert
          message="Инцидент успешно зарегистрирован"
          description="Специалисты скоро рассмотрят вашу проблему."
          type="success"
          showIcon
          className="mb-4"
        />
      )}
      
      {createIncidentMutation.isError && (
        <Alert
          message="Ошибка при создании инцидента"
          description={createIncidentMutation.error?.message || "Пожалуйста, попробуйте позже."}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          title: `Проблема с проектом #${projectId}`,
          severity: 'medium'
        }}
      >
        <Form.Item
          name="title"
          label="Заголовок"
          rules={[{ required: true, message: 'Пожалуйста, введите заголовок проблемы' }]}
        >
          <Input placeholder="Краткое описание проблемы" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Подробное описание"
          rules={[{ required: true, message: 'Пожалуйста, опишите проблему с проектом' }]}
        >
          <TextArea 
            placeholder="Опишите, что именно не работает или какие проблемы у вас возникли с проектом" 
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
          name="additionalInfo"
          label="Дополнительная информация"
        >
          <TextArea 
            placeholder="Действия, которые привели к проблеме, ожидаемый результат и т.п." 
            rows={2} 
          />
        </Form.Item>
        
        <Form.Item className="flex justify-end mb-0">
          <Button 
            onClick={handleCancel}
            className="mr-2"
          >
            Отмена
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            danger
            loading={createIncidentMutation.isLoading}
          >
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportProjectIncident; 