import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { 
  Description as SpreadsheetIcon, 
  AttachMoney as CashIcon, 
  Checklist as ChecklistIcon,
  Medication as MedicationIcon 
} from '@mui/icons-material';
// Remove the import for react-router-dom since we're not using it
// import { Link } from 'react-router-dom';

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
      <Tooltip title="Agregar mueble a planilla de precios" arrow placement="right">
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
      
      <Tooltip title="Calculadora de Dosis Pediátricas" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('dosageCalculator')}>
          <MedicationIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
      
      {/* Remove the ListItem button that was here */}
    </Box>
  );
}

export default Sidebar;