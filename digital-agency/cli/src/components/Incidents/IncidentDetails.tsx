import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  BugReport as BugIcon,
  Assignment as AssignmentIcon,
  Comment as CommentIcon,
  AttachFile as AttachmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Incident } from '../../types/incident';
import { formatDate } from '../../utils/dateUtils';

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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{incident.title}</Typography>
          <Box>
            <Chip
              label={incident.priority}
              color={
                incident.priority === 'CRITICAL'
                  ? 'error'
                  : incident.priority === 'HIGH'
                  ? 'warning'
                  : 'info'
              }
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={incident.status}
              color={
                incident.status === 'NEW'
                  ? 'error'
                  : incident.status === 'IN_PROGRESS'
                  ? 'warning'
                  : 'success'
              }
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Описание
              </Typography>
              <Typography>{incident.description}</Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                История
              </Typography>
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <BugIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2">Создан</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(incident.createdAt)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                {incident.updatedAt && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="info">
                        <AssignmentIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">Обновлен</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(incident.updatedAt)}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
                {incident.resolvedAt && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="success">
                        <ScheduleIcon />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">Разрешен</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(incident.resolvedAt)}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            </Paper>

            {incident.comments && incident.comments.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Комментарии
                </Typography>
                <List>
                  {incident.comments.map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <CommentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={comment.text}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {comment.author}
                              </Typography>
                              {' — '}
                              {formatDate(comment.timestamp)}
                            </>
                          }
                        />
                      </ListItem>
                      {index < incident.comments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Детали
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Категория"
                    secondary={incident.category}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Ответственный"
                    secondary={incident.assignedTo}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Влияние"
                    secondary={incident.impact}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Срочность"
                    secondary={incident.urgency}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Время разрешения"
                    secondary={`${incident.resolutionTime} минут`}
                  />
                </ListItem>
              </List>
            </Paper>

            {incident.affectedServices && incident.affectedServices.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Затронутые сервисы
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {incident.affectedServices.map((service, index) => (
                    <Chip key={index} label={service} size="small" />
                  ))}
                </Box>
              </Paper>
            )}

            {incident.attachments && incident.attachments.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Вложения
                </Typography>
                <List dense>
                  {incident.attachments.map((attachment, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachmentIcon />
                      </ListItemIcon>
                      <ListItemText primary={attachment} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
        <Button onClick={onEdit} variant="contained" color="primary">
          Редактировать
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 