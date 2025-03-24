import React from 'react';
import { Box, Tooltip, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Description as SpreadsheetIcon, 
  AttachMoney as CashIcon, 
  Checklist as ChecklistIcon,
  Medication as MedicationIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';
// If you're not using routing yet, you can comment out this line
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
      
      {/* If you're not using routing yet, you can replace this with a regular button */}
      {/* 
      <ListItem button component={Link} to="/add-furniture">
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Agregar mueble a planilla de precios" />
      </ListItem>
      */}
      
      {/* Alternative without routing */}
      <Tooltip title="Agregar mueble" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('addFurniture')}>
          <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default Sidebar;