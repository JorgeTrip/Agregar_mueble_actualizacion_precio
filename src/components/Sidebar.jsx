import React, { useState, useRef, useEffect } from 'react';
import { Box, Tooltip, IconButton, Switch, useMediaQuery, useTheme } from '@mui/material';
import { 
  Description as SpreadsheetIcon, 
  AttachMoney as CashIcon, 
  Checklist as ChecklistIcon,
  Medication as MedicationIcon,
  LocalPharmacy as PharmacyIcon,
  MenuBook as VademecumIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
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
  const navbarRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Función para verificar si se necesitan mostrar los chevrons
  const checkScrollButtons = () => {
    if (isMobile && buttonsContainerRef.current && navbarRef.current) {
      const container = navbarRef.current;
      const content = buttonsContainerRef.current;
      
      // Verificar si el contenido es más ancho que el contenedor
      const needsScrolling = content.scrollWidth > container.clientWidth;
      
      // Actualizar visibilidad de los chevrons
      setShowLeftChevron(needsScrolling && scrollPosition > 0);
      setShowRightChevron(needsScrolling && scrollPosition < content.scrollWidth - container.clientWidth);
    } else {
      setShowLeftChevron(false);
      setShowRightChevron(false);
    }
  };
  
  // Función para desplazar a la izquierda
  const scrollLeft = () => {
    if (buttonsContainerRef.current && navbarRef.current) {
      const container = navbarRef.current;
      const newPosition = Math.max(0, scrollPosition - 100);
      buttonsContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  // Función para desplazar a la derecha
  const scrollRight = () => {
    if (buttonsContainerRef.current && navbarRef.current) {
      const container = navbarRef.current;
      const content = buttonsContainerRef.current;
      const newPosition = Math.min(
        content.scrollWidth - container.clientWidth,
        scrollPosition + 100
      );
      buttonsContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  // Manejar el evento de scroll
  const handleScroll = () => {
    if (buttonsContainerRef.current) {
      setScrollPosition(buttonsContainerRef.current.scrollLeft);
      checkScrollButtons();
    }
  };
  
  // Efecto para verificar si se necesitan los chevrons al montar el componente o cambiar el tamaño
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    
    return () => {
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [isMobile]);
  
  // Efecto para manejar el evento de scroll
  useEffect(() => {
    const buttonsContainer = buttonsContainerRef.current;
    if (buttonsContainer) {
      buttonsContainer.addEventListener('scroll', handleScroll);
      return () => {
        buttonsContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  return (
    <Box
      ref={navbarRef}
      sx={{
        width: isMobile ? '100%' : '60px', // Ancho completo en móvil, angosto en desktop
        height: isMobile ? 'auto' : 'calc(100vh - 64px)', // Restar la altura del navbar (64px)
        maxHeight: isMobile ? 'auto' : 'calc(100vh - 64px)', // Limitar altura máxima
        backgroundColor: themeMode === 'dark' ? '#333' : '#f0f0f0',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        justifyContent: 'flex-start', // Cambiado para permitir desplazamiento
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
      {/* Chevron izquierdo para navegación en móvil */}
      {isMobile && showLeftChevron && (
        <IconButton 
          onClick={scrollLeft} 
          sx={{ 
            position: 'absolute', 
            left: 0, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1001,
            backgroundColor: themeMode === 'dark' ? 'rgba(51, 51, 51, 0.8)' : 'rgba(240, 240, 240, 0.8)',
            '&:hover': {
              backgroundColor: themeMode === 'dark' ? 'rgba(51, 51, 51, 0.9)' : 'rgba(240, 240, 240, 0.9)',
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      
      {/* Contenedor de botones con scroll horizontal en móvil */}
      <Box
        ref={buttonsContainerRef}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'flex-start',
          overflowX: isMobile ? 'auto' : 'hidden',
          overflowY: 'hidden',
          width: isMobile ? 'calc(100% - 20px)' : '100%', // Espacio para los chevrons
          height: '100%',
          scrollbarWidth: 'none', // Ocultar scrollbar en Firefox
          msOverflowStyle: 'none', // Ocultar scrollbar en IE/Edge
          '&::-webkit-scrollbar': { // Ocultar scrollbar en Chrome/Safari
            display: 'none',
          },
          padding: isMobile ? '0 10px' : 0,
          gap: isMobile ? '15px' : 0, // Espacio entre botones en móvil
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
      
      {/* Chevron derecho para navegación en móvil */}
      {isMobile && showRightChevron && (
        <IconButton 
          onClick={scrollRight} 
          sx={{ 
            position: 'absolute', 
            right: 0, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1001,
            backgroundColor: themeMode === 'dark' ? 'rgba(51, 51, 51, 0.8)' : 'rgba(240, 240, 240, 0.8)',
            '&:hover': {
              backgroundColor: themeMode === 'dark' ? 'rgba(51, 51, 51, 0.9)' : 'rgba(240, 240, 240, 0.9)',
            }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default Sidebar;