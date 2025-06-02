import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Chip,
  Autocomplete
} from '@mui/material';
import { Incident, IncidentPriority, IncidentStatus, IncidentCategory } from '../../types/incident';

interface IncidentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (incident: Partial<Incident>) => void;
  incident?: Incident;
  users: { id: string; name: string }[];
  services: string[];
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  open,
  onClose,
  onSubmit,
  incident,
  users,
  services
}) => {
  const [formData, setFormData] = React.useState<Partial<Incident>>(
    incident || {
      title: '',
      description: '',
      priority: IncidentPriority.MEDIUM,
      status: IncidentStatus.NEW,
      category: IncidentCategory.OTHER,
      assignedTo: '',
      affectedServices: [],
      impact: '',
      urgency: ''
    }
  );

  const handleChange = (field: keyof Incident) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {incident ? 'Редактирование инцидента' : 'Создание инцидента'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Заголовок"
                value={formData.title}
                onChange={handleChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Приоритет</InputLabel>
                <Select
                  value={formData.priority}
                  label="Приоритет"
                  onChange={handleChange('priority')}
                >
                  {Object.values(IncidentPriority).map(priority => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={formData.status}
                  label="Статус"
                  onChange={handleChange('status')}
                >
                  {Object.values(IncidentStatus).map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category}
                  label="Категория"
                  onChange={handleChange('category')}
                >
                  {Object.values(IncidentCategory).map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ответственный</InputLabel>
                <Select
                  value={formData.assignedTo}
                  label="Ответственный"
                  onChange={handleChange('assignedTo')}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={services}
                value={formData.affectedServices || []}
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    affectedServices: newValue
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Затронутые сервисы"
                    placeholder="Выберите сервисы"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Влияние"
                value={formData.impact}
                onChange={handleChange('impact')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Срочность"
                value={formData.urgency}
                onChange={handleChange('urgency')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" color="primary">
            {incident ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 