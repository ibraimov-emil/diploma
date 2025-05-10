import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Incident, IncidentPriority, IncidentStatus, IncidentCategory } from '../../types/incident';
import { formatDate } from '../../utils/dateUtils';

interface IncidentListProps {
  incidents: Incident[];
  onEdit: (incident: Incident) => void;
  onDelete: (id: string) => void;
  onView: (incident: Incident) => void;
}

const priorityColors = {
  [IncidentPriority.CRITICAL]: 'error',
  [IncidentPriority.HIGH]: 'warning',
  [IncidentPriority.MEDIUM]: 'info',
  [IncidentPriority.LOW]: 'success'
};

const statusColors = {
  [IncidentStatus.NEW]: 'error',
  [IncidentStatus.IN_PROGRESS]: 'warning',
  [IncidentStatus.ON_HOLD]: 'info',
  [IncidentStatus.RESOLVED]: 'success',
  [IncidentStatus.CLOSED]: 'default'
};

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onEdit,
  onDelete,
  onView
}) => {
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(incidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<IncidentCategory | 'ALL'>('ALL');

  useEffect(() => {
    let filtered = incidents;

    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.priority === priorityFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.category === categoryFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchTerm, priorityFilter, statusFilter, categoryFilter]);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Приоритет</InputLabel>
          <Select
            value={priorityFilter}
            label="Приоритет"
            onChange={(e) => setPriorityFilter(e.target.value as IncidentPriority | 'ALL')}
          >
            <MenuItem value="ALL">Все</MenuItem>
            {Object.values(IncidentPriority).map(priority => (
              <MenuItem key={priority} value={priority}>{priority}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'ALL')}
          >
            <MenuItem value="ALL">Все</MenuItem>
            {Object.values(IncidentStatus).map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={categoryFilter}
            label="Категория"
            onChange={(e) => setCategoryFilter(e.target.value as IncidentCategory | 'ALL')}
          >
            <MenuItem value="ALL">Все</MenuItem>
            {Object.values(IncidentCategory).map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Заголовок</TableCell>
              <TableCell>Приоритет</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Создан</TableCell>
              <TableCell>Ответственный</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIncidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>{incident.title}</TableCell>
                <TableCell>
                  <Chip
                    label={incident.priority}
                    color={priorityColors[incident.priority] as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={incident.status}
                    color={statusColors[incident.status] as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{incident.category}</TableCell>
                <TableCell>{formatDate(incident.createdAt)}</TableCell>
                <TableCell>{incident.assignedTo}</TableCell>
                <TableCell>
                  <Tooltip title="Просмотр">
                    <IconButton onClick={() => onView(incident)} size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редактировать">
                    <IconButton onClick={() => onEdit(incident)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton onClick={() => onDelete(incident.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 