import React from 'react';
import { Box, Tooltip, IconButton, Switch } from '@mui/material';
import { 
  Description as SpreadsheetIcon, 
  AttachMoney as CashIcon, 
  Checklist as ChecklistIcon,
  Medication as MedicationIcon,
  LocalPharmacy as PharmacyIcon,
  MenuBook as VademecumIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';

/**
 * @fileoverview Componente de barra lateral para navegación entre herramientas
 * @author J.O.T.
 * @version 1.0.0
 */

/**
 * @description Componente de barra lateral que permite la navegación entre las diferentes herramientas de la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSelect - Función que maneja el cambio entre componentes
 * @param {Function} props.toggleTheme - Función para alternar entre tema oscuro y claro
 * @param {string} props.themeMode - Modo actual del tema ('dark' o 'light')
 * @returns {JSX.Element} Componente de barra lateral con iconos de navegación
 */
function Sidebar({ onSelect, toggleTheme, themeMode }) {
  return (
    <Box
      sx={{
        width: '60px', // Sidebar angosto
        height: '100vh',
        backgroundColor: themeMode === 'dark' ? '#333' : '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        transition: 'background-color 0.3s ease',
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
      
      <Tooltip title="Precios de Medicamentos" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('medicationPrices')}>
          <PharmacyIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Vademecum de Argentina" arrow placement="right">
        <IconButton color="inherit" onClick={() => onSelect('argentinaVademecum')}>
          <VademecumIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Tooltip>
      
      {/* Switch para alternar entre tema oscuro y claro */}
      <Box sx={{ marginTop: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Tooltip title={themeMode === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} arrow placement="right">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {themeMode === 'dark' ? <LightModeIcon sx={{ fontSize: 30 }} /> : <DarkModeIcon sx={{ fontSize: 30 }} />}
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default Sidebar;