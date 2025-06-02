import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { IncidentList } from './IncidentList';
import { IncidentForm } from './IncidentForm';
import { IncidentDetails } from './IncidentDetails';
import { IncidentMetrics } from './IncidentMetrics';
import { Incident } from '../../types/incident';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`incident-tabpanel-${index}`}
      aria-labelledby={`incident-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const IncidentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    totalIncidents: 0,
    openIncidents: 0,
    resolvedIncidents: 0,
    averageResolutionTime: 0,
    slaCompliance: 0,
    incidentsByPriority: [],
    incidentsByCategory: [],
    resolutionTimeTrend: []
  });

  useEffect(() => {
    // TODO: Fetch incidents from API
    fetchIncidents();
    fetchMetrics();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents');
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/incidents/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateIncident = () => {
    setSelectedIncident(null);
    setIsFormOpen(true);
  };

  const handleEditIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsFormOpen(true);
  };

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDetailsOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedIncident(null);
  };

  const handleFormSubmit = async (incidentData: Partial<Incident>) => {
    try {
      if (selectedIncident) {
        await fetch(`/api/incidents/${selectedIncident.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incidentData)
        });
      } else {
        await fetch('/api/incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incidentData)
        });
      }
      handleFormClose();
      fetchIncidents();
      fetchMetrics();
    } catch (error) {
      console.error('Error saving incident:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Управление инцидентами
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateIncident}
        >
          Создать инцидент
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Список инцидентов" />
          <Tab label="Метрики" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <IncidentList
            incidents={incidents}
            onEdit={handleEditIncident}
            onView={handleViewIncident}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <IncidentMetrics {...metrics} />
        </TabPanel>
      </Paper>

      <IncidentForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        incident={selectedIncident}
        users={[]} // TODO: Fetch users from API
        services={[]} // TODO: Fetch services from API
      />

      {selectedIncident && (
        <IncidentDetails
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          incident={selectedIncident}
          onEdit={() => {
            setIsDetailsOpen(false);
            handleEditIncident(selectedIncident);
          }}
        />
      )}
    </Container>
  );
}; 