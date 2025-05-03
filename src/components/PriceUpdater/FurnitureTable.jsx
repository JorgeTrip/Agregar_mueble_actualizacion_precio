import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow
} from '@mui/material';

/**
 * @description Componente para mostrar una tabla de productos por mueble
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tabla (nombre del mueble)
 * @param {Array} props.data - Datos a mostrar en la tabla
 * @param {string} props.highlightTerm - Término a resaltar en la tabla (opcional)
 * @returns {JSX.Element} Componente de tabla de productos
 */
const FurnitureTable = ({ title, data, highlightTerm }) => {
  if (!data || data.length === 0) {
    return null;
  }

  /**
   * @description Resalta el término de búsqueda en un texto
   * @param {string} text - Texto donde buscar
   * @param {string} term - Término a resaltar
   * @returns {JSX.Element|string} Texto con el término resaltado o el texto original
   */
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    
    const textStr = String(text);
    const termLower = term.toLowerCase();
    const index = textStr.toLowerCase().indexOf(termLower);
    
    if (index === -1) return textStr;
    
    return (
      <>
        {textStr.substring(0, index)}
        <span style={{ backgroundColor: '#f48fb1', color: '#000', padding: '0 2px' }}>
          {textStr.substring(index, index + term.length)}
        </span>
        {textStr.substring(index + term.length)}
      </>
    );
  };

  // Obtener las columnas de los datos
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Definir el orden específico de las columnas según la estructura de la planilla A
  const columnOrder = [
    'Codigo',       // COD (B)
    'Droga',        // DROGA (C)
    'Marca',        // MARCA (D)
    'PrecioAnterior', // PVP anterior (E)
    'PrecioActualizado', // Nuevo precio
    'Diferencia',   // Diferencia entre precios
    'PorcentajeCambio' // Porcentaje de cambio
  ];
  
  // Filtrar columnas no deseadas y ordenarlas según el orden definido
  const displayColumns = columns
    .filter(col => 
      col !== 'id' && 
      col !== '_id' && 
      !col.startsWith('__') &&
      col !== 'rowNumber' &&
      col !== 'Mueble' // No mostrar Mueble en la tabla ya que se usa como título
    )
    .sort((a, b) => {
      const indexA = columnOrder.indexOf(a);
      const indexB = columnOrder.indexOf(b);
      
      // Si ambas columnas están en el orden definido, usar ese orden
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // Si solo una columna está en el orden definido, ponerla primero
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // Si ninguna está en el orden definido, mantener el orden original
      return 0;
    });

  return (
    <Paper 
      elevation={3}
      sx={{ 
        mb: 4, 
        overflow: 'hidden',
        borderRadius: 2,
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.length} productos
        </Typography>
      </Box>
      
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {displayColumns.map((column) => (
                <TableCell 
                  key={column}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#2d2d2d',
                    color: column === 'PrecioActualizado' ? '#4caf50' : 
                           column === 'PrecioAnterior' ? '#f44336' : 
                           'inherit'
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {displayColumns.map((column) => (
                  <TableCell 
                    key={`${index}-${column}`}
                    sx={{
                      color: column === 'PrecioActualizado' ? '#4caf50' : 
                             column === 'PrecioAnterior' ? '#f44336' : 
                             'inherit'
                    }}
                  >
                    {highlightTerm 
                      ? highlightText(row[column], highlightTerm)
                      : row[column]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FurnitureTable;
