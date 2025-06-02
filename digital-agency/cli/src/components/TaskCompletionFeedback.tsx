import React from 'react';
import { Modal, Form, Rate, Input, Button } from 'antd';
import { CreateFeedbackDto } from '../types/feedback';

interface TaskCompletionFeedbackProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (feedback: CreateFeedbackDto) => void;
  taskId: string;
  projectId: string;
}

const TaskCompletionFeedback: React.FC<TaskCompletionFeedbackProps> = ({
  visible,
  onClose,
  onSubmit,
  taskId,
  projectId
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit({
        ...values,
        linkedEntityId: taskId
      });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Оценка выполнения задачи"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Отправить
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="ratingSpeed"
          label="Скорость выполнения"
          rules={[{ required: true }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="ratingSolutionQuality"
          label="Качество выполнения"
          rules={[{ required: true }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="ratingClarity"
          label="Соответствие требованиям"
          rules={[{ required: true }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="generalSatisfaction"
          label="Общая удовлетворенность"
          rules={[{ required: true }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskCompletionFeedback; 