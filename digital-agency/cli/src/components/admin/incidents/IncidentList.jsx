import React, { useState } from 'react';
import { Table, Card, Typography, DatePicker, Select, Tag, Spin, Button, Space, Badge, Tooltip } from 'antd';
import { SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { QualityService } from '../../../services';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const IncidentList = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Fetch incidents data
  const { data: incidents, isLoading, error, refetch } = useQuery(
    ['incidents', dateRange, statusFilter, severityFilter],
    async () => {
      // First get all incidents for the date range
      const allIncidents = await QualityService.getIncidents(dateRange);
      
      // Then filter by status and severity if needed
      return allIncidents.filter(incident => {
        const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
        const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
        return matchesStatus && matchesSeverity;
      });
    },
    {
      onError: (error) => {
        console.error('Error fetching incidents:', error);
      },
      refetchInterval: 300000, // Refresh every 5 minutes
    }
  );

  // Generate severity tag
  const renderSeverityTag = (severity) => {
    let color = '';
    let text = '';
    
    switch (severity) {
      case 'high':
        color = 'red';
        text = 'Высокая';
        break;
      case 'medium':
        color = 'orange';
        text = 'Средняя';
        break;
      case 'low':
        color = 'green';
        text = 'Низкая';
        break;
      default:
        color = 'default';
        text = severity;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  // Generate status badge
  const renderStatusBadge = (status) => {
    let color = '';
    let text = '';
    let icon = null;
    
    switch (status) {
      case 'open':
        color = 'processing';
        text = 'Открыт';
        icon = <SyncOutlined spin />;
        break;
      case 'resolved':
        color = 'success';
        text = 'Решен';
        icon = <CheckCircleOutlined />;
        break;
      case 'investigating':
        color = 'warning';
        text = 'Расследуется';
        icon = <ExclamationCircleOutlined />;
        break;
      default:
        color = 'default';
        text = status;
    }
    
    return <Badge status={color} text={text} />;
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Tooltip title={record.description}>
          <span className="cursor-pointer">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Важность',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: renderSeverityTag,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: renderStatusBadge,
    },
    {
      title: 'Дата создания',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      width: 200,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Дата решения',
      dataIndex: 'resolutionTime',
      key: 'resolutionTime',
      width: 200,
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ];

  // If loading, show spinner
  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <Card>
      <Title level={4}>Список инцидентов</Title>
      
      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Option value="all">Все статусы</Option>
          <Option value="open">Открытые</Option>
          <Option value="investigating">Расследуются</Option>
          <Option value="resolved">Решенные</Option>
        </Select>
        
        <Select
          value={severityFilter}
          onChange={setSeverityFilter}
          style={{ width: 150 }}
        >
          <Option value="all">Все важности</Option>
          <Option value="high">Высокая</Option>
          <Option value="medium">Средняя</Option>
          <Option value="low">Низкая</Option>
        </Select>
        
        <Button type="primary" onClick={() => refetch()}>
          Обновить
        </Button>
      </Space>
      
      <Table
        dataSource={incidents}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>
              <strong>Описание:</strong> {record.description}
              {record.metadata && (
                <>
                  <br />
                  <strong>Дополнительная информация:</strong> {record.metadata}
                </>
              )}
            </p>
          ),
        }}
      />
    </Card>
  );
};

export default IncidentList; 