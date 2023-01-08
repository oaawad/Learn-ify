import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
function NotFound() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh  ',
        color: 'grey.600',
      }}
    >
      <WarningAmberIcon sx={{ color: 'error.main', fontSize: 200, mb: '1rem' }} />
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Page Not Found
      </Typography>
    </Box>
  );
}

export default NotFound;
