import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ReportIncidentButton from '../incidents/ReportIncidentButton';

const InvoiceActionButtons = ({ invoice, onPay, onPrint, onDownload, paymentStatus }) => {
  const isPaymentFailed = paymentStatus === 'failed';
  
  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {/* Primary action - Pay invoice */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<PaymentIcon />}
          onClick={onPay}
          disabled={paymentStatus === 'paid'}
        >
          {paymentStatus === 'paid' ? 'Paid' : 'Pay Invoice'}
        </Button>
        
        {/* Secondary actions */}
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={onPrint}
        >
          Print
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
        >
          Download PDF
        </Button>
      </Box>
      
      {/* Show report problem button after payment failure */}
      {isPaymentFailed && (
        <Box 
          sx={{ 
            mt: 1, 
            p: 2, 
            bgcolor: 'error.light', 
            borderRadius: 1,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="error.dark" fontWeight="bold">
              Payment Failed
            </Typography>
            <Typography variant="body2" color="error.dark">
              There was a problem processing your payment. Please try again or report the issue.
            </Typography>
          </Box>
          
          <ReportIncidentButton 
            variant="contained"
            color="error"
            text="Report Payment Issue"
            tooltip="Report a problem with your payment"
            relatedEntityType="invoice"
            relatedEntityId={invoice.id}
            relatedEntityName={`Invoice #${invoice.invoiceNumber || invoice.id}`}
          />
        </Box>
      )}
    </Box>
  );
};

export default InvoiceActionButtons; 