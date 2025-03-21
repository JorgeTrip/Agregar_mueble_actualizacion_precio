import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Description as SpreadsheetIcon, AttachMoney as CashIcon, Checklist as ChecklistIcon } from '@mui/icons-material';

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
      <Tooltip title="Planilla de Excel" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('home')}>
          <SpreadsheetIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Asistente de Arqueo de Caja" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('cashAssistant')}>
          <CashIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Checklist de Cierre" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('checklist')}>
          <ChecklistIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default Sidebar;