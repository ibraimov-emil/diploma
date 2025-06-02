import React from 'react';
import { Modal, Form, Rate, Input, Button } from 'antd';
import { CreateFeedbackDto } from '../../types/feedback';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (feedback: CreateFeedbackDto) => void;
  linkedEntityId: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, onClose, onSubmit, linkedEntityId }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit({ ...values, linkedEntityId });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Оценка удовлетворенности"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Отмена</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Отправить</Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="ratingSpeed" label="Скорость реакции" rules={[{ required: true }]}>
          <Rate />
        </Form.Item>
        <Form.Item name="ratingSolutionQuality" label="Качество решения" rules={[{ required: true }]}>
          <Rate />
        </Form.Item>
        <Form.Item name="ratingClarity" label="Ясность коммуникации" rules={[{ required: true }]}>
          <Rate />
        </Form.Item>
        <Form.Item name="generalSatisfaction" label="Общая удовлетворенность" rules={[{ required: true }]}>
          <Rate />
        </Form.Item>
        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal; 