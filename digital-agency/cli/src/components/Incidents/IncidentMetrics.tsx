import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface IncidentMetricsProps {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  averageResolutionTime: number;
  slaCompliance: number;
  incidentsByPriority: Array<{
    priority: string;
    count: number;
  }>;
  incidentsByCategory: Array<{
    category: string;
    count: number;
  }>;
  resolutionTimeTrend: Array<{
    date: string;
    time: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const IncidentMetrics: React.FC<IncidentMetricsProps> = ({
  totalIncidents,
  openIncidents,
  resolvedIncidents,
  averageResolutionTime,
  slaCompliance,
  incidentsByPriority,
  incidentsByCategory,
  resolutionTimeTrend
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Всего инцидентов
          </Typography>
          <Typography variant="h4">{totalIncidents}</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Открыто: {openIncidents}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Разрешено: {resolvedIncidents}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Среднее время разрешения
          </Typography>
          <Typography variant="h4">
            {averageResolutionTime.toFixed(1)} мин
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Соответствие SLA
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={slaCompliance}
              size={80}
              color={slaCompliance >= 90 ? 'success' : 'warning'}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="caption" component="div" color="textSecondary">
                {`${Math.round(slaCompliance)}%`}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Распределение по приоритетам
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={incidentsByPriority}
                dataKey="count"
                nameKey="priority"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {incidentsByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Инциденты по категориям
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Тренд времени разрешения
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionTimeTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="time" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}; 