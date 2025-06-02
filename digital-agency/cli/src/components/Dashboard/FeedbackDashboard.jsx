import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider, Table, Progress, Tabs } from 'antd';
import { Line, Column, Pie, Gauge } from '@ant-design/charts';

// Mock data to avoid API call errors
const mockFeedbackData = {
  // Average satisfaction level for the last 30 days
  averageSatisfaction: 4.3,
  
  // Rating distribution by teams
  satisfactionByTeam: {
    'Команда поддержки': 4.5,
    'Команда разработки': 4.2,
    'Команда аналитики': 4.0,
    'Команда дизайна': 4.7
  },
  
  // Rating distribution by employees
  satisfactionByEmployee: [
    { name: 'Иванов И.И.', rating: 4.8, department: 'Разработка' },
    { name: 'Петров П.П.', rating: 4.2, department: 'Поддержка' },
    { name: 'Сидоров С.С.', rating: 3.9, department: 'Аналитика' },
    { name: 'Смирнова А.А.', rating: 4.7, department: 'Дизайн' },
    { name: 'Козлов Д.В.', rating: 4.5, department: 'Разработка' }
  ],
  
  // Rating distribution by projects
  satisfactionByProject: [
    { project: 'Проект A', rating: 4.6 },
    { project: 'Проект B', rating: 3.8 },
    { project: 'Проект C', rating: 4.2 },
    { project: 'Проект D', rating: 4.5 },
    { project: 'Проект E', rating: 4.0 }
  ],
  
  // Dynamics chart data (last 6 months)
  satisfactionTrend: [
    { date: '2023-12', satisfaction: 3.8 },
    { date: '2024-01', satisfaction: 4.0 },
    { date: '2024-02', satisfaction: 4.1 },
    { date: '2024-03', satisfaction: 4.2 },
    { date: '2024-04', satisfaction: 4.3 },
    { date: '2024-05', satisfaction: 4.5 }
  ],
  
  // Issue recurrence rate
  issueRecurrenceRate: 0.15, // 15% of issues recur
  
  // Response quality assessment
  responseQuality: {
    excellent: 65,
    good: 25,
    average: 8,
    poor: 2
  },
  
  // Rating distribution
  ratingDistribution: {
    '5': 58,
    '4': 27,
    '3': 10,
    '2': 3,
    '1': 2
  }
};

const FeedbackDashboard = () => {
  const [feedbackData, setFeedbackData] = useState(mockFeedbackData);
  const { TabPane } = Tabs;

  // Uncomment this when API is ready
  // useEffect(() => {
  //   fetchFeedbackData();
  // }, []);
  // 
  // const fetchFeedbackData = async () => {
  //   try {
  //     const response = await fetch('/api/feedback/dashboard');
  //     const data = await response.json();
  //     setFeedbackData(data);
  //   } catch (error) {
  //     console.error('Error fetching feedback data:', error);
  //     setFeedbackData(mockFeedbackData); // Fallback to mock data
  //   }
  // };

  // Convert data for Ant Design Charts
  const lineData = feedbackData.satisfactionTrend.map(item => ({
    month: item.date,
    value: item.satisfaction,
  }));

  const barData = Object.entries(feedbackData.satisfactionByTeam).map(([team, value]) => ({
    team,
    value,
  }));
  
  const pieData = Object.entries(feedbackData.ratingDistribution).map(([rating, count]) => ({
    type: `${rating} звезд`,
    value: count,
  }));
  
  const qualityPieData = Object.entries(feedbackData.responseQuality).map(([quality, percentage]) => ({
    type: quality,
    value: percentage,
  }));

  // Line chart config for satisfaction trend
  const lineConfig = {
    data: lineData,
    xField: 'month',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    yAxis: {
      min: 0,
      max: 5,
    },
  };

  // Bar chart config for team satisfaction
  const barConfig = {
    data: barData,
    xField: 'team',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      value: {
        min: 0,
        max: 5,
      },
    },
  };
  
  // Pie chart config for rating distribution
  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    legend: {
      position: 'bottom',
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    height: 200,
  };
  
  // Gauge chart config for issue recurrence rate
  const gaugeConfig = {
    percent: feedbackData.issueRecurrenceRate,
    range: {
      color: ['#30BF78', '#FAAD14', '#F4664A'],
    },
    height: 120,
    statistic: {
      content: {
        formatter: () => `${(feedbackData.issueRecurrenceRate * 100).toFixed(0)}%`,
      },
    },
  };
  
  // Pie chart config for response quality
  const qualityPieConfig = {
    data: qualityPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    legend: {
      position: 'bottom',
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    height: 200,
  };
  
  // Table columns for employee satisfaction
  const employeeColumns = [
    {
      title: 'Сотрудник',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Отдел',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Рейтинг',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <span>
          {rating}
          <Progress 
            percent={rating * 20} 
            size="small" 
            status={rating >= 4.5 ? "success" : rating >= 3.5 ? "normal" : "exception"}
            showInfo={false}
            style={{ marginLeft: 10, width: 80 }}
          />
        </span>
      ),
      sorter: (a, b) => a.rating - b.rating,
      defaultSortOrder: 'descend',
    },
  ];
  
  // Table columns for project satisfaction
  const projectColumns = [
    {
      title: 'Проект',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Рейтинг',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <span>
          {rating}
          <Progress 
            percent={rating * 20} 
            size="small" 
            status={rating >= 4.5 ? "success" : rating >= 3.5 ? "normal" : "exception"}
            showInfo={false}
            style={{ marginLeft: 10, width: 80 }}
          />
        </span>
      ),
      sorter: (a, b) => a.rating - b.rating,
      defaultSortOrder: 'descend',
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Аналитика обратной связи</h2>
      
      {/* First row - Key metrics */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Средняя оценка за 30 дней" 
              value={feedbackData.averageSatisfaction} 
              precision={1} 
              suffix="/ 5" 
            />
            <Progress 
              percent={feedbackData.averageSatisfaction * 20} 
              status={feedbackData.averageSatisfaction >= 4.5 ? "success" : "active"}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Частота повторения проблем" 
              value={feedbackData.issueRecurrenceRate * 100} 
              precision={1} 
              suffix="%" 
            />
            <Gauge {...gaugeConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="Распределение оценок">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
      
      {/* Second row - Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card size="small" title="Динамика удовлетворенности">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="Удовлетворенность по командам">
            <Column {...barConfig} />
          </Card>
        </Col>
      </Row>
      
      {/* Third row - Tables and Response quality */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card size="small" bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="Оценка по сотрудникам" key="1">
                <Table 
                  dataSource={feedbackData.satisfactionByEmployee} 
                  columns={employeeColumns} 
                  pagination={false}
                  rowKey="name"
                  size="small"
                />
              </TabPane>
              <TabPane tab="Оценка по проектам" key="2">
                <Table 
                  dataSource={feedbackData.satisfactionByProject} 
                  columns={projectColumns} 
                  pagination={false}
                  rowKey="project"
                  size="small"
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="Оценка качества ответа">
            <Pie {...qualityPieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FeedbackDashboard; 