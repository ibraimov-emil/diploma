import React, { useState } from 'react';
import { Card, Row, Col, Table, Statistic, Alert, DatePicker, Spin, Button, message } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import dayjs from 'dayjs';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';
import { QualityService } from '../../../services';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

const ITSMDashboardContent = () => {
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(7, 'days'),
        dayjs(),
    ]);

    // Seed data mutation
    const seedMutation = useMutation(QualityService.seedQualityData, {
        onSuccess: () => {
            message.success('ITSM data seeded successfully');
            // Invalidate queries to refetch data
            queryClient.invalidateQueries('latestServiceMetrics');
            queryClient.invalidateQueries('incidents');
            queryClient.invalidateQueries('auditLogs');
        },
        onError: () => {
            message.error('Failed to seed ITSM data');
        }
    });

    // Use TanStack Query to fetch data
    const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useQuery(
        'latestServiceMetrics',
        QualityService.getLatestServiceMetrics,
        {
            onError: (error) => {
                console.error('Error fetching service metrics:', error);
            }
        }
    );

    const { data: incidents, isLoading: incidentsLoading, error: incidentsError } = useQuery(
        ['incidents', dateRange],
        () => QualityService.getIncidents(dateRange),
        {
            onError: (error) => {
                console.error('Error fetching incidents:', error);
            }
        }
    );

    const { data: auditLogs, isLoading: auditLogsLoading, error: auditLogsError } = useQuery(
        ['auditLogs', dateRange],
        () => QualityService.getAuditLogs(dateRange),
        {
            onError: (error) => {
                console.error('Error fetching audit logs:', error);
            }
        }
    );

    const { data: incidentStats, isLoading: incidentStatsLoading } = useQuery(
        'incidentStats',
        QualityService.getIncidentStats,
        {
            onError: (error) => {
                console.error('Error fetching incident stats:', error);
            }
        }
    );

    // Handle data loading and errors
    const isLoading = metricsLoading || incidentsLoading || auditLogsLoading || incidentStatsLoading;
    const hasError = metricsError || incidentsError || auditLogsError;

    if (isLoading) {
        return <Spin size="large" />;
    }

    if (hasError) {
        return <Alert message="Failed to fetch ITSM data" type="error" />;
    }

    // Prepare chart data
    const incidentSeverityData = [
        { type: 'High', value: incidents?.filter(i => i.severity === 'high').length || 0 },
        { type: 'Medium', value: incidents?.filter(i => i.severity === 'medium').length || 0 },
        { type: 'Low', value: incidents?.filter(i => i.severity === 'low').length || 0 },
    ];

    const incidentStatusData = [
        { type: 'Open', value: incidents?.filter(i => i.status === 'open').length || 0 },
        { type: 'Resolved', value: incidents?.filter(i => i.status === 'resolved').length || 0 },
    ];

    const metricsConfig = {
        data: [
            { time: 'Uptime', value: metricsData?.uptime || 0 },
            { time: 'MTTR', value: metricsData?.mttr || 0 },
            { time: 'MTBF', value: metricsData?.mtbf || 0 },
            { time: 'Response Time', value: metricsData?.responseTime || 0 },
            { time: 'Error Rate', value: metricsData?.errorRate || 0 },
        ],
        xField: 'time',
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Row gutter={[16, 16]} align="middle">
                <Col span={16}>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>ITSM Dashboard</h1>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <Button 
                        type="primary" 
                        onClick={() => seedMutation.mutate()}
                        loading={seedMutation.isLoading}
                    >
                        Seed ITSM Data
                    </Button>
                </Col>
                <Col span={24}>
                    <DatePicker.RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                    />
                </Col>
                
                <Col span={8}>
                    <Card title="Service Uptime">
                        <Statistic
                            value={metricsData?.uptime}
                            precision={2}
                            suffix="%"
                            valueStyle={{ color: metricsData?.uptime >= 99.9 ? '#3f8600' : '#cf1322' }}
                        />
                    </Card>
                </Col>
                
                <Col span={8}>
                    <Card title="Mean Time To Recovery">
                        <Statistic
                            value={metricsData?.mttr}
                            precision={1}
                            suffix="min"
                            valueStyle={{ color: metricsData?.mttr <= 30 ? '#3f8600' : '#cf1322' }}
                        />
                    </Card>
                </Col>
                
                <Col span={8}>
                    <Card title="Mean Time Between Failures">
                        <Statistic
                            value={metricsData?.mtbf}
                            precision={1}
                            suffix="min"
                            valueStyle={{ color: metricsData?.mtbf >= 1440 ? '#3f8600' : '#cf1322' }}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Service Metrics">
                        <Line {...metricsConfig} />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card title="Incident Severity">
                        <Pie
                            data={incidentSeverityData}
                            angleField="value"
                            colorField="type"
                            radius={0.8}
                            label={{
                                type: 'outer',
                                content: '{name} {percentage}',
                            }}
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card title="Incident Status">
                        <Pie
                            data={incidentStatusData}
                            angleField="value"
                            colorField="type"
                            radius={0.8}
                            label={{
                                type: 'outer',
                                content: '{name} {percentage}',
                            }}
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Recent Incidents">
                        <Table
                            dataSource={incidents}
                            rowKey="id"
                            columns={[
                                { title: 'Title', dataIndex: 'title', key: 'title' },
                                { title: 'Severity', dataIndex: 'severity', key: 'severity' },
                                { title: 'Status', dataIndex: 'status', key: 'status' },
                                { 
                                    title: 'Registration Time', 
                                    dataIndex: 'registrationTime', 
                                    key: 'registrationTime',
                                    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
                                },
                                { 
                                    title: 'Resolution Time', 
                                    dataIndex: 'resolutionTime', 
                                    key: 'resolutionTime',
                                    render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
                                },
                            ]}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Audit Logs">
                        <Table
                            dataSource={auditLogs}
                            rowKey="id"
                            columns={[
                                { title: 'Action', dataIndex: 'action', key: 'action' },
                                { title: 'Entity Type', dataIndex: 'entityType', key: 'entityType' },
                                { title: 'Entity ID', dataIndex: 'entityId', key: 'entityId' },
                                { title: 'Details', dataIndex: 'details', key: 'details' },
                                { 
                                    title: 'Timestamp', 
                                    dataIndex: 'timestamp', 
                                    key: 'timestamp',
                                    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
                                },
                            ]}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Wrap the component with QueryClientProvider
const ItsmDashboard = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ITSMDashboardContent />
        </QueryClientProvider>
    );
};

export default ItsmDashboard; 