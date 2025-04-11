import React from 'react';
import { Box, Tooltip, IconButton, Switch, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      sx={{
        width: isMobile ? '100%' : '60px', // Ancho completo en móvil, angosto en desktop
        height: isMobile ? 'auto' : 'calc(100vh - 64px)', // Restar la altura del navbar (64px)
        maxHeight: isMobile ? 'auto' : 'calc(100vh - 64px)', // Limitar altura máxima
        backgroundColor: themeMode === 'dark' ? '#333' : '#f0f0f0',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        justifyContent: isMobile ? 'space-around' : 'flex-start',
        alignItems: 'center',
        padding: isMobile ? '10px 0' : '20px 0 10px 0', // Añadir padding inferior para dar espacio
        transition: 'all 0.3s ease',
        position: 'fixed',
        top: isMobile ? 'auto' : '64px', // En desktop debajo del navbar, en móvil no aplica
        bottom: isMobile ? 0 : 'auto', // En móvil, fijarlo al fondo
        left: 0,
        zIndex: 1000, // Mayor que el navbar superior para asegurar visibilidad
        boxShadow: isMobile ? '0px -2px 4px rgba(0,0,0,0.1)' : 'none', // Sombra en modo móvil para destacar
        overflowY: 'auto', // Permitir scroll si hay muchos elementos
        overflowX: 'hidden',
        scrollbarWidth: 'thin', // Scrollbar delgado para Firefox
        '&::-webkit-scrollbar': { // Personalizar scrollbar para Chrome
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: themeMode === 'dark' ? '#555' : '#bbb',
          borderRadius: '4px',
        }
      }}
    >
      <Tooltip title="Agregar mueble a planilla de precios" arrow placement={isMobile ? "bottom" : "right"}>
        <IconButton color="inherit" onClick={() => onSelect('home')} sx={{ my: isMobile ? 0 : 0.5 }}>
          <SpreadsheetIcon sx={{ fontSize: isMobile ? 25 : 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Asistente de Arqueo de Caja" arrow placement={isMobile ? "bottom" : "right"}>
        <IconButton color="inherit" onClick={() => onSelect('cashAssistant')} sx={{ my: isMobile ? 0 : 0.5 }}>
          <CashIcon sx={{ fontSize: isMobile ? 25 : 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Checklist de Cierre" arrow placement={isMobile ? "bottom" : "right"}>
        <IconButton color="inherit" onClick={() => onSelect('checklist')} sx={{ my: isMobile ? 0 : 0.5 }}>
          <ChecklistIcon sx={{ fontSize: isMobile ? 25 : 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Calculadora de Dosis Pediátricas" arrow placement={isMobile ? "bottom" : "right"}>
        <IconButton color="inherit" onClick={() => onSelect('dosageCalculator')} sx={{ my: isMobile ? 0 : 0.5 }}>
          <MedicationIcon sx={{ fontSize: isMobile ? 25 : 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Precios de Medicamentos" arrow placement={isMobile ? "bottom" : "right"}>
        <IconButton color="inherit" onClick={() => onSelect('medicationPrices')} sx={{ my: isMobile ? 0 : 0.5 }}>
          <PharmacyIcon sx={{ fontSize: isMobile ? 25 : 40 }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Vademecum de Argentina" arrow placement={isMobile ? "bottom" : "right"}>
        <IconButton color="inherit" onClick={() => onSelect('argentinaVademecum')} sx={{ my: isMobile ? 0 : 0.5 }}>
          <VademecumIcon sx={{ fontSize: isMobile ? 25 : 40 }} />
        </IconButton>
      </Tooltip>
      
      {/* Switch para alternar entre tema oscuro y claro */}
      <Box sx={{
        marginTop: isMobile ? 0 : 'auto',
        marginBottom: isMobile ? 0 : '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Tooltip title={themeMode === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} arrow placement={isMobile ? "bottom" : "right"}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ my: isMobile ? 0 : 1 }}>
              {themeMode === 'dark' ? <LightModeIcon sx={{ fontSize: isMobile ? 25 : 30 }} /> : <DarkModeIcon sx={{ fontSize: isMobile ? 25 : 30 }} />}
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default Sidebar;