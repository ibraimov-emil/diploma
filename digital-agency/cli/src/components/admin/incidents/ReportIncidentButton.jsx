import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import IncidentForm from './IncidentForm';

const ReportIncidentButton = ({ 
  variant = 'icon', 
  color = 'default',
  size = 'medium',
  text = 'Report Issue',
  tooltip = 'Report an issue or problem',
  relatedEntityType,
  relatedEntityId,
  relatedEntityName,
  className,
  sx = {}
}) => {
  const [formOpen, setFormOpen] = useState(false);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={tooltip}>
          <IconButton
            onClick={handleOpenForm}
            color={color}
            size={size}
            className={className}
            sx={sx}
          >
            <ReportProblemIcon />
          </IconButton>
        </Tooltip>
        <IncidentForm
          open={formOpen}
          onClose={handleCloseForm}
          relatedEntityType={relatedEntityType}
          relatedEntityId={relatedEntityId}
          relatedEntityName={relatedEntityName}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant === 'contained' ? 'contained' : 'outlined'}
        color={color === 'default' ? 'primary' : color}
        size={size}
        onClick={handleOpenForm}
        startIcon={<ReportProblemIcon />}
        className={className}
        sx={sx}
      >
        {text}
      </Button>
      <IncidentForm
        open={formOpen}
        onClose={handleCloseForm}
        relatedEntityType={relatedEntityType}
        relatedEntityId={relatedEntityId}
        relatedEntityName={relatedEntityName}
      />
    </>
  );
};

export default ReportIncidentButton; 