import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Home as HomeIcon, AttachMoney as CashIcon } from '@mui/icons-material';

function Sidebar({ onSelect }) {
  return (
    <Box
      sx={{
        width: '60px', // Sidebar angosto
        height: '100vh',
        backgroundColor: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <Tooltip title="Procesador de lista de precios con mueble" arrow>
        <IconButton color="inherit" onClick={() => onSelect('home')}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Asistente de Arqueo de Caja" arrow>
        <IconButton color="inherit" onClick={() => onSelect('cashAssistant')}>
          <CashIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default Sidebar;