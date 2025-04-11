/**
 * @fileoverview Componente para mostrar precios de medicamentos desde Alfabeta
 * Este componente muestra la página web externa de Alfabeta para consultar precios
 * de medicamentos dentro de un iframe responsivo.
 * @author J.O.T.
 */
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Componente que muestra la página de precios de medicamentos de Alfabeta
 * @returns {JSX.Element} Componente con iframe para precios de medicamentos
 */
function MedicationPrices() {
  return (
    <Box sx={{
      p: 3, // Padding interno 
      width: '910px', // Ancho del contenedor
      boxSizing: 'border-box',
      overflowX: 'hidden',
      // Agrego manejo de ancho en pantallas pequeñas:
      '@media (max-width: 600px)': {
        width: '100%',
        p: 2
      }
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Precios de Medicamentos
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontStyle: 'italic', letterSpacing: '0.1em', textAlign: 'center', mb: 4 }}>
      
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Box 
          sx={{
            width: '100%', // Cambiado de 810px a 100% para aprovechar todo el ancho disponible
            maxWidth: '100%',
            margin: '0 auto',
            height: '80vh',
            overflow: 'hidden',
            '& iframe': {
              border: 'none',
              width: '100%',
              height: '100%',
            },
          }}
        >
          <iframe 
            src="https://alfabeta.net/precio/" 
            title="Precios de Medicamentos - Alfabeta"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default MedicationPrices;