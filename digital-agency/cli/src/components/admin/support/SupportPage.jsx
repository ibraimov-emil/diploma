import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import axios from 'axios';
import { API_URL } from '../../../services/index';
import ReportIncidentButton from '../incidents/ReportIncidentButton';

const SupportPage = () => {
  const [userIncidents, setUserIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}incidents`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter to only show current user's incidents
        // In a real app, you'd have a backend endpoint for this
        setUserIncidents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
        setError('Failed to load your reported issues');
        setLoading(false);
      }
    };

    fetchUserIncidents();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Help & Support
      </Typography>

      <Grid container spacing={3}>
        {/* Left column - Support options */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Report a Problem
              </Typography>
              <ReportIncidentButton 
                variant="contained"
                text="Report New Issue"
              />
            </Box>
            <Typography variant="body1" paragraph>
              Experiencing issues with our platform? Report a problem and our support team will assist you as soon as possible.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Your Reported Issues
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : userIncidents.length === 0 ? (
              <Typography color="text.secondary" sx={{ my: 2 }}>
                You haven't reported any issues yet.
              </Typography>
            ) : (
              <List>
                {userIncidents.map((incident) => (
                  <Paper 
                    key={incident.id} 
                    variant="outlined" 
                    sx={{ mb: 2, p: 2 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {incident.title}
                      </Typography>
                      <Box>
                        <Chip 
                          label={incident.severity} 
                          size="small" 
                          color={getSeverityColor(incident.severity)} 
                          sx={{ mr: 1 }} 
                        />
                        <Chip 
                          label={incident.status} 
                          size="small" 
                          color={getStatusColor(incident.status)} 
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Reported on {new Date(incident.registrationTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {incident.description}
                    </Typography>
                    {incident.status === 'resolved' && (
                      <Box sx={{ bgcolor: 'success.light', p: 1, borderRadius: 1 }}>
                        <Typography variant="body2" color="success.dark">
                          <strong>Resolved:</strong> {new Date(incident.resolutionTime).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right column - Contact options */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ChatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Live Chat Support
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Chat with our support team in real-time for immediate assistance.
              </Typography>
            </CardContent>
            <CardActions>
              <Button startIcon={<ForumIcon />} fullWidth>
                Start Chat
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Email Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email our support team at:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                support@digitalagency.com
              </Typography>
            </CardContent>
            <CardActions>
              <Button startIcon={<EmailIcon />} fullWidth>
                Send Email
              </Button>
            </CardActions>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Phone Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Call our support line:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                +1 (800) 555-1234
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Available Monday-Friday, 9AM-5PM
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupportPage; 