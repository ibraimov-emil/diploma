import React, { useState } from 'react';
import { Modal, Button, Typography, Row, Col, Card, Tag, Divider, List, Space, Timeline } from 'antd';
import { 
  BugOutlined, 
  EditOutlined, 
  CommentOutlined, 
  PaperClipOutlined, 
  ClockCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Incident } from '../../types/incident';
import { formatDate } from '../../utils/dateUtils';
import FeedbackModal from '../Feedback/FeedbackModal';
import { CreateFeedbackDto } from '../../types/feedback';

const { Title, Text, Paragraph } = Typography;

interface IncidentDetailsProps {
  open: boolean;
  onClose: () => void;
  incident: Incident;
  onEdit: () => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  open,
  onClose,
  incident,
  onEdit
}) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackOpen = () => {
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackClose = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackSubmit = (feedback: CreateFeedbackDto) => {
    console.log('Feedback submitted:', feedback);
    // Here you would send the feedback to your API
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Helper function to get tag color based on priority or status
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'gold';
      case 'LOW': return 'green';
      default: return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'red';
      case 'IN_PROGRESS': return 'orange';
      case 'RESOLVED': return 'blue';
      case 'CLOSED': return 'green';
      default: return 'default';
    }
  };

  // Check if comments exist and have length
  const hasComments = incident.comments && incident.comments.length > 0;

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{incident.title}</span>
            <div>
              <Tag color={getPriorityColor(incident.priority)} style={{ marginRight: 8 }}>
                {incident.priority}
              </Tag>
              <Tag color={getStatusColor(incident.status)}>
                {incident.status}
              </Tag>
            </div>
          </div>
        }
        open={open}
        onCancel={onClose}
        width={1000}
        footer={[
          <Button key="feedback" type="primary" icon={<MessageOutlined />} onClick={handleFeedbackOpen}>
            Оставить отзыв
          </Button>,
          <Button key="edit" icon={<EditOutlined />} onClick={onEdit}>
            Редактировать
          </Button>,
          <Button key="close" onClick={onClose}>
            Закрыть
          </Button>
        ]}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Card title="Описание" style={{ marginBottom: 16 }}>
              <Paragraph>{incident.description}</Paragraph>
            </Card>

            <Card title="История" style={{ marginBottom: 16 }}>
              <Timeline>
                <Timeline.Item dot={<BugOutlined style={{ fontSize: '16px' }} />}>
                  <Text strong>Создан</Text>
                  <br />
                  <Text type="secondary">{formatDate(incident.createdAt)}</Text>
                </Timeline.Item>
                
                {incident.updatedAt && (
                  <Timeline.Item dot={<EditOutlined style={{ fontSize: '16px' }} />}>
                    <Text strong>Обновлен</Text>
                    <br />
                    <Text type="secondary">{formatDate(incident.updatedAt)}</Text>
                  </Timeline.Item>
                )}
                
                {incident.resolvedAt && (
                  <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
                    <Text strong>Разрешен</Text>
                    <br />
                    <Text type="secondary">{formatDate(incident.resolvedAt)}</Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>

            {hasComments && (
              <Card title="Комментарии">
                <List
                  itemLayout="horizontal"
                  dataSource={incident.comments}
                  renderItem={(comment, index) => (
                    <>
                      <List.Item>
                        <List.Item.Meta
                          avatar={<CommentOutlined />}
                          title={comment.text}
                          description={
                            <>
                              <Text strong>{comment.author}</Text> — {formatDate(comment.timestamp)}
                            </>
                          }
                        />
                      </List.Item>
                      {index < (incident.comments?.length || 0) - 1 && <Divider style={{ margin: '8px 0' }} />}
                    </>
                  )}
                />
              </Card>
            )}
          </Col>
          
          <Col span={8}>
            <Card title="Детали" style={{ marginBottom: 16 }}>
              <List size="small">
                <List.Item>
                  <Text strong>Категория:</Text> {incident.category}
                </List.Item>
                <List.Item>
                  <Text strong>Ответственный:</Text> {incident.assignedTo}
                </List.Item>
                <List.Item>
                  <Text strong>Влияние:</Text> {incident.impact}
                </List.Item>
                <List.Item>
                  <Text strong>Срочность:</Text> {incident.urgency}
                </List.Item>
                <List.Item>
                  <Text strong>Время разрешения:</Text> {incident.resolutionTime} минут
                </List.Item>
              </List>
            </Card>

            {incident.affectedServices && incident.affectedServices.length > 0 && (
              <Card title="Затронутые сервисы" style={{ marginBottom: 16 }}>
                <Space wrap>
                  {incident.affectedServices.map((service, index) => (
                    <Tag key={index}>{service}</Tag>
                  ))}
                </Space>
              </Card>
            )}

            {incident.attachments && incident.attachments.length > 0 && (
              <Card title="Вложения">
                <List
                  size="small"
                  dataSource={incident.attachments}
                  renderItem={(attachment, index) => (
                    <List.Item>
                      <PaperClipOutlined style={{ marginRight: 8 }} />
                      {attachment}
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Col>
        </Row>
      </Modal>

      {isFeedbackModalOpen && (
        <FeedbackModal
          visible={isFeedbackModalOpen}
          onClose={handleFeedbackClose}
          onSubmit={handleFeedbackSubmit}
          linkedEntityId={incident.id}
        />
      )}
    </>
  );
}; 