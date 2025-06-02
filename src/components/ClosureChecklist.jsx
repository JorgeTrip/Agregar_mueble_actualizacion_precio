import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  AppBar,
  Card,
  CardContent
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useRef } from 'react';
import { Upload as UploadIcon, Description as DescriptionIcon } from '@mui/icons-material';

/**
 * @fileoverview Componente para gestionar el checklist de cierre de caja de una farmacia
 * @author J.O.T.
 * @version 2.0.0
 */

/**
 * @description Lista de conceptos predefinidos para el checklist de cierre
 * @type {string[]}
 */
const predefinedItems = [
  'Deposito 1',
  'Deposito 2',
  'Deposito 3',
  'Depo Final',
  'Retiro',
  'Ajuste',
  'Tarjetas',
  'Mercado Pago',
  'Pedidos Ya',
  'Rappi',
  'Extra Cash Electron',
  'Extra Cash Mercado Pago'
];

/**
 * @description Mapeo de conceptos de Sinergie a los nombres de la planilla
 * @type {Object.<string, string>}
 */
const sinergieToPlanillaMap = {
  'EFECTIVO': 'Efectivo',
  'TARJETAS': 'Tarjetas',
  'MERCADOPAGO': 'Mercado Pago',
  'PEDIDOSYA': 'Pedidos Ya',
  'RAPPI': 'Rappi',
  'TRANSFERENCIA': 'Transferencia',
  'CHEQUE': 'Cheque',
  'OTROS': 'Otros'
};

/**
 * @description Mapeo de turnos
 * @type {Object.<string, string>}
 */
const turnosMap = {
  'TURNO 1': 'Turno Mañana',
  'TURNO 2': 'Turno Tarde',
  'TURNO 3': 'Turno Noche'
};

/**
 * @description Componente principal que gestiona el checklist de cierre
 * @returns {JSX.Element} Componente de checklist de cierre
 */
function ClosureChecklist() {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState(0);
  
  /** @type {[{name: string, amount: string, formattedAmount: string}[], Function]} Estado para almacenar los items del checklist */
  const [items, setItems] = useState(
    predefinedItems.map(name => ({ name, amount: '', formattedAmount: '' }))
  );
  
  /** @type {[{name: string, amount: string, formattedAmount: string}, Function]} Estado para el nuevo item que se está ingresando */
  const [newItem, setNewItem] = useState({ name: '', amount: '', formattedAmount: '' });
  
  /** @type {React.MutableRefObject<HTMLInputElement[]>} Referencias a los campos de entrada para navegación con teclado */
  const inputRefs = useRef([]);
  
  // Estado para los datos de Sinergie
  const [sinergieData, setSinergieData] = useState({
    turno: '',
    fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD para input date
    hora: new Date().toTimeString().substring(0, 5), // Formato HH:MM
    cajero: ''
  });

  /**
   * @description Formatea un valor numérico a formato de moneda argentina
   * @param {number} value - El valor a formatear
   * @returns {string} El valor formateado como moneda argentina con punto como separador de miles y coma para decimales
   */
  const formatARS = (value) => {
    if (value === '' || value === null || value === undefined || isNaN(value)) return '';
    
    // Convertir a número por si es string
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : Number(value);
    
    if (isNaN(numValue)) return '';
    
    // Usar Intl.NumberFormat para formatear con puntos y comas
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currencyDisplay: 'symbol'
    }).format(numValue);
    
    return formatted;
  };
  
  /**
   * @description Convierte un valor formateado a número
   * @param {string} formattedValue - El valor formateado
   * @returns {number} El valor numérico
   */
  const parseFormattedValue = (formattedValue) => {
    if (!formattedValue) return 0;
    // Eliminar todos los puntos y reemplazar la coma por punto decimal
    const numericString = formattedValue.replace(/\./g, '').replace(',', '.');
    return parseFloat(numericString) || 0;
  };

  /**
   * @description Maneja el cambio en campos con formato de moneda
   * @param {React.ChangeEvent} e - Evento de cambio
   * @param {number} index - Índice del ítem que se está editando
   */
  const handleFormattedChange = (e, index) => {
    const value = e.target.value;
    const prevItem = items[index];
    
    // Si el valor está vacío, reiniciar ambos estados
    if (value === '') {
      const newItems = [...items];
      newItems[index] = { ...prevItem, amount: '', formattedAmount: '' };
      setItems(newItems);
      return;
    }
    
    // Validar que solo contenga dígitos, puntos o comas
    const regex = /^[0-9,.]*$/;
    if (!regex.test(value)) return;
    
    // Detectar si se acaba de agregar un punto (probablemente desde el teclado numérico)
    const justAddedDot = value.endsWith('.') && !prevItem.formattedAmount?.endsWith(',');
    
    // Conservar los puntos de miles existentes y solo convertir el último punto a coma si se acaba de agregar
    let processedValue;
    if (justAddedDot) {
      // Si se acaba de agregar un punto al final, convertirlo en coma
      processedValue = value.slice(0, -1) + ',';
    } else {
      // De lo contrario, mantener el valor tal como está
      processedValue = value;
    }
    
    // Eliminar cualquier caracter que no sea dígito, punto o coma
    const cleanValue = processedValue.replace(/[^0-9,.]/g, '');
    
    // Verificar si ya existe una coma decimal
    const hasDecimal = cleanValue.includes(',');
    
    // Separar la parte entera y decimal (si existe)
    let [integerPart, decimalPart] = cleanValue.split(',');
    
    // Eliminar cualquier punto existente en la parte entera para reformatearla
    integerPart = integerPart ? integerPart.replace(/\./g, '') : '';
    
    // Limitar la parte decimal a 2 dígitos
    if (decimalPart !== undefined) {
      decimalPart = decimalPart.substring(0, 2);
    }
    
    // Formatear la parte entera con puntos cada 3 dígitos
    let formattedInteger = '';
    for (let i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 === 0) {
        formattedInteger += '.';
      }
      formattedInteger += integerPart[i];
    }
    
    // Reconstruir el valor con la parte decimal si existe
    let displayValue = formattedInteger;
    if (decimalPart !== undefined) {
      displayValue += ',' + decimalPart;
    }
    
    // Para cálculos internos, convertir a formato numérico estándar
    let numericValue = integerPart;
    if (decimalPart !== undefined) {
      numericValue += '.' + decimalPart;
    }
    
    // Convertir a número para asegurar que sea un formato válido
    const parsedValue = parseFloat(numericValue);
    
    // Actualizar el estado con el nuevo valor
    const newItems = [...items];
    newItems[index] = { 
      ...prevItem, 
      amount: !isNaN(parsedValue) ? parsedValue.toString() : '',
      formattedAmount: displayValue
    };
    setItems(newItems);
  };

  /**
   * @description Maneja el cambio en un campo numérico con formato para el nuevo item
   * @param {string} value - El valor ingresado
   * @param {string} prevValue - El valor anterior formateado (opcional)
   */
  const handleNewItemFormattedChange = (value, prevValue = '') => {
    // Si es un valor vacío, reiniciar ambos estados
    if (value === '') {
      setNewItem(prev => ({ ...prev, amount: '', formattedAmount: '' }));
      return;
    }
    
    // Detectar si se acaba de agregar un punto (probablemente desde el teclado numérico)
    const justAddedDot = value.endsWith('.') && !prevValue.endsWith(',');
    
    // Conservar los puntos de miles existentes y solo convertir el último punto a coma si se acaba de agregar
    let processedValue;
    if (justAddedDot) {
      // Si se acaba de agregar un punto al final, convertirlo en coma
      processedValue = value.slice(0, -1) + ',';
    } else {
      // De lo contrario, mantener el valor tal como está
      processedValue = value;
    }
    
    // Eliminar cualquier caracter que no sea dígito, punto o coma
    const cleanValue = processedValue.replace(/[^0-9.,]/g, '');
    
    // Verificar si ya existe una coma decimal
    const hasDecimal = cleanValue.includes(',');
    
    // Separar la parte entera y decimal (si existe)
    let [integerPart, decimalPart] = cleanValue.split(',');
    
    // Eliminar cualquier punto existente en la parte entera para reformatearla
    integerPart = integerPart ? integerPart.replace(/\./g, '') : '';
    
    // Formatear la parte entera con puntos cada 3 dígitos
    let formattedInteger = '';
    for (let i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 === 0) {
        formattedInteger += '.';
      }
      formattedInteger += integerPart[i];
    }
    
    // Reconstruir el valor con la parte decimal si existe
    let displayValue = formattedInteger;
    if (decimalPart !== undefined) {
      displayValue += ',' + decimalPart;
    }
    
    // Para cálculos internos, convertir a formato numérico estándar
    let numericValue = integerPart;
    if (decimalPart !== undefined) {
      numericValue += '.' + decimalPart;
    }
    
    // Guardar ambos valores: el numérico para cálculos y el formateado para mostrar
    const parsedValue = parseFloat(numericValue);
    
    if (!isNaN(parsedValue)) {
      setNewItem(prev => ({ ...prev, amount: parsedValue.toString(), formattedAmount: displayValue }));
    } else if (displayValue === '' || displayValue === ',') {
      // Si solo hay una coma o está vacío
      setNewItem(prev => ({ ...prev, amount: '', formattedAmount: displayValue }));
    }
  };

  /**
   * @description Maneja los eventos de teclado en los campos de nuevo ítem
   * @param {React.KeyboardEvent} e - Evento de teclado
   */
  const handleNewItemKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newItem.name && newItem.amount) {
        handleAddItem();
      }
    }
  };

  /**
   * @description Maneja la adición de un nuevo item personalizado al checklist
   */
  const handleAddItem = () => {
    if (newItem.name && newItem.amount) {
      setItems(prev => [...prev, {
        name: newItem.name,
        amount: newItem.amount,
        formattedAmount: formatARS(parseFloat(newItem.amount))
      }]);
      setNewItem({ name: '', amount: '', formattedAmount: '' });
    }
  };

  /**
   * @description Maneja el cambio en el monto del nuevo ítem
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
   */
  const handleNewItemAmountChange = (e) => {
    handleNewItemFormattedChange(e.target.value, newItem.formattedAmount);
  };

  /**
   * @description Maneja la adición de un nuevo item personalizado al checklist
   * @param {React.KeyboardEvent} e - Evento de teclado
   * @deprecated Usar handleNewItemKeyDown en su lugar
   */
  const handleAddCustom = (e) => {
    if (e.key === 'Enter' && newItem.name && newItem.amount) {
      setItems(prev => [...prev, {
        name: newItem.name,
        amount: parseFloat(newItem.amount).toFixed(2),
        formattedAmount: formatARS(parseFloat(newItem.amount))
      }]);
      setNewItem({ name: '', amount: '', formattedAmount: '' });
    }
  };

  /**
   * @description Actualiza el monto de un item específico en el checklist
   * @param {number} index - Índice del item a actualizar
   * @param {string} value - Nuevo valor para el monto
   */
  const updateItemAmount = (index, value) => {
    handleFormattedChange(value, index, items[index].formattedAmount);
  };

  /**
   * @description Calcula el total de todos los montos ingresados
   * @type {number}
   */
  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  /**
   * @description Limpia todos los campos y reinicia el estado del componente
   */
  const handleResetForm = () => {
    setItems(predefinedItems.map(name => ({ name, amount: '', formattedAmount: '' })));
    setNewItem({ name: '', amount: '', formattedAmount: '' });
  };

  /**
   * @description Limpia todos los campos y reinicia el estado del componente
   * @deprecated Usar handleResetForm en su lugar
   */
  const handleClearAll = () => {
    setItems(predefinedItems.map(name => ({ name, amount: '', formattedAmount: '' })));
    setNewItem({ name: '', amount: '', formattedAmount: '' });
  };

  /**
   * @description Guarda el checklist actual en un archivo de texto
   */
  const handleSaveToFile = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const content = items.map(item => 
      `${item.name.padEnd(25)}: $${formatARS(item.amount || 0)}`
    ).join('\n') + `\n\nTOTAL GENERAL: $${formatARS(total)}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${formattedDate} Cierre de caja.txt`);
  };

  /**
   * @description Maneja la navegación por teclado entre los campos de entrada
   * @param {number} index - Índice del campo actual
   * @param {React.KeyboardEvent} e - Evento de teclado
   */
  const handleKeyPress = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = index + 1;
      
      if (nextIndex < items.length) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        // Focus en el primer campo de custom al llegar al final
        document.getElementById('custom-name-input')?.focus();
      }
    }
  };

  /**
   * @description Maneja el cambio de pestaña
   * @param {React.SyntheticEvent} event - Evento de cambio de pestaña
   * @param {number} newValue - Índice de la nueva pestaña seleccionada
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  /**
   * @description Procesa el archivo de Sinergie cargado
   * @param {Event} event - Evento de cambio del input de archivo
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');
        
        // Buscar información del turno, fecha, hora y cajero
        let turno = '';
        let fecha = '';
        let hora = '';
        let cajero = '';
        let totales = {};
        
        // Patrones para buscar en el archivo
        const turnoPattern = /TURNO\s*\d+/i;
        const fechaHoraPattern = /(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2})/;
        const cajeroPattern = /CAJERO\s*:\s*(.+)/i;
        const totalPattern = /^([A-Z\s]+)\s+([\d.,]+)$/i;
        
        lines.forEach(line => {
          // Buscar turno
          if (turnoPattern.test(line)) {
            const match = line.match(turnoPattern);
            if (match) turno = match[0].toUpperCase();
          }
          
          // Buscar fecha y hora
          const fechaHoraMatch = line.match(fechaHoraPattern);
          if (fechaHoraMatch) {
            fecha = fechaHoraMatch[1];
            hora = fechaHoraMatch[2];
          }
          
          // Buscar cajero
          const cajeroMatch = line.match(cajeroPattern);
          if (cajeroMatch) {
            cajero = cajeroMatch[1].trim();
          }
          
          // Buscar totales
          const totalMatch = line.match(totalPattern);
          if (totalMatch) {
            const concepto = totalMatch[1].trim().toUpperCase();
            const monto = totalMatch[2].replace(/\./g, '').replace(',', '.');
            
            // Mapear el concepto de Sinergie al formato de la planilla
            const conceptoMapeado = Object.keys(sinergieToPlanillaMap).find(
              key => concepto.includes(key)
            );
            
            if (conceptoMapeado) {
              totales[sinergieToPlanillaMap[conceptoMapeado]] = parseFloat(monto);
            }
          }
        });
        
        // Actualizar el estado con los datos extraídos
        setSinergieData({
          turno: turnosMap[turno] || turno,
          fecha,
          hora,
          cajero,
          totales
        });
        
        // Actualizar los items con los totales encontrados
        const updatedItems = items.map(item => {
          if (item.name in totales) {
            const amountNum = parseFloat(totales[item.name]);
            const formattedAmount = formatARS(amountNum);
            return {
              ...item,
              amount: amountNum.toString(),
              formattedAmount: formattedAmount
            };
          }
          return item;
        });
        
        setItems(updatedItems);
        setFileLoaded(true);
        setActiveTab(1); // Cambiar a la pestaña de planilla
        
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo. Asegúrate de que sea un archivo de Sinergie válido.');
      }
    };
    
    reader.readAsText(file);
  };
  
  /**
   * @description Renderiza la vista de carga de archivo
   * @returns {JSX.Element} Componente de carga de archivo
   */
  const renderFileUpload = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      p: 4,
      border: '2px dashed #90caf9',
      borderRadius: 2,
      textAlign: 'center',
      minHeight: '200px',
      backgroundColor: 'rgba(144, 202, 249, 0.05)'
    }}>
      <input
        accept=".txt"
        style={{ display: 'none' }}
        id="sinergie-file-upload"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="sinergie-file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadIcon />}
          sx={{ mb: 2 }}
        >
          Seleccionar archivo de Sinergie
        </Button>
      </label>
      <Typography variant="body1" color="textSecondary">
        Arrastra y suelta un archivo de cierre de Sinergie aquí, o haz clic para seleccionar
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
        Formato soportado: .txt (exportado desde Sinergie)
      </Typography>
    </Box>
  );
  
  /**
   * @description Renderiza la planilla de papel con los datos cargados
   * @returns {JSX.Element} Componente de planilla de papel
   */


  const renderPlanilla = () => {
    // Crear un tema que fuerce los estilos claros independientemente del tema global
    const planillaTheme = createTheme({
      // Deshabilitar transiciones para evitar parpadeos
      transitions: {
        create: () => 'none',
      },
      // Forzar modo claro explícitamente
      palette: {
        mode: 'light',
        background: {
          paper: '#fffde7',
          default: '#fffde7'
        },
        text: {
          primary: 'rgba(0, 0, 0, 0.87)',
          secondary: 'rgba(0, 0, 0, 0.6)',
          disabled: 'rgba(0, 0, 0, 0.38)'
        }
      },
      // Sobrescribir estilos de componentes
      components: {
        // Estilos para el contenedor principal
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: '#fffde7 !important',
              backgroundImage: 'none !important',
              '& *': {
                color: 'rgba(0, 0, 0, 0.87) !important'
              }
            }
          }
        },
        // Estilos para la tarjeta
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: '#fffde7 !important',
              color: 'rgba(0, 0, 0, 0.87) !important',
              '& .MuiCardContent-root': {
                backgroundColor: '#fffde7 !important',
                color: 'rgba(0, 0, 0, 0.87) !important',
                padding: '16px !important',
                '&:last-child': {
                  paddingBottom: '16px !important'
                }
              }
            }
          }
        },
        // Estilos para la tipografía
        MuiTypography: {
          styleOverrides: {
            root: {
              color: 'rgba(0, 0, 0, 0.87) !important',
              '&.MuiTypography-h5': {
                fontWeight: 'bold !important',
                textAlign: 'center !important',
                marginBottom: '16px !important'
              }
            }
          }
        },
        // Estilos para la tabla
        MuiTable: {
          styleOverrides: {
            root: {
              border: '1px solid rgba(0, 0, 0, 0.12) !important',
              '&, & *': {
                color: 'rgba(0, 0, 0, 0.87) !important',
                borderColor: 'rgba(0, 0, 0, 0.23) !important',
                backgroundColor: 'transparent !important'
              }
            }
          }
        },
        // Estilos para las filas de la tabla
        MuiTableRow: {
          styleOverrides: {
            head: {
              backgroundColor: '#f5f5f5 !important',
              '& .MuiTableCell-head': {
                color: 'rgba(0, 0, 0, 0.87) !important',
                fontWeight: 'bold !important',
                backgroundColor: '#f5f5f5 !important'
              }
            },
            root: {
              backgroundColor: '#fffde7 !important',
              '&:nth-of-type(odd)': {
                backgroundColor: 'rgba(0, 0, 0, 0.02) !important'
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04) !important'
              },
              '& .MuiTableCell-root': {
                color: 'rgba(0, 0, 0, 0.87) !important',
                borderColor: 'rgba(0, 0, 0, 0.12) !important',
                backgroundColor: 'transparent !important'
              }
            }
          }
        },
        // Estilos para las celdas de la tabla
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderColor: 'rgba(0, 0, 0, 0.12) !important',
              color: 'rgba(0, 0, 0, 0.87) !important',
              backgroundColor: 'transparent !important',
              '&.MuiTableCell-head': {
                color: 'rgba(0, 0, 0, 0.87) !important',
                fontWeight: 'bold !important',
                backgroundColor: '#f5f5f5 !important'
              }
            }
          }
        },
        // Estilos para el contenedor de la tabla
        MuiTableContainer: {
          styleOverrides: {
            root: {
              backgroundColor: 'transparent !important',
              '& *': {
                backgroundColor: 'transparent !important'
              }
            }
          }
        },
        // Estilos para los botones
        MuiButton: {
          styleOverrides: {
            root: {
              color: '#1976d2 !important',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04) !important'
              }
            },
            contained: {
              color: '#fff !important',
              backgroundColor: '#1976d2 !important',
              '&:hover': {
                backgroundColor: '#1565c0 !important'
              }
            }
          }
        }
      }
    });

    return (
      <Box sx={{ 
        mt: 2,
        '& .MuiPaper-root': {
          backgroundColor: '#fffde7 !important',
          backgroundImage: 'none !important'
        }
      }}>
        <ThemeProvider theme={planillaTheme}>
          <Card 
            variant="outlined" 
            sx={{ 
              mb: 3,
              backgroundColor: '#fffde7 !important',
              '& .MuiCardContent-root': {
                backgroundColor: '#fffde7 !important'
              }
            }}
          >
            <CardContent sx={{ backgroundColor: '#fffde7 !important' }}>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  PLANILLA DE CIERRE DE CAJA
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    <strong>FECHA:</strong> {sinergieData.fecha || '__________'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>TURNO:</strong> {sinergieData.turno || '__________'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>HORA:</strong> {sinergieData.hora || '__________'}
                  </Typography>
                </Box>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                  <strong>CAJERO/A:</strong> {sinergieData.cajero || '__________'}
                </Typography>
              </Box>
              
              <TableContainer>
                <Table size="small" sx={{ 
                  border: '1px solid #e0e0e0',
                  '& .MuiTableCell-root': {
                    color: 'rgba(0, 0, 0, 0.87)',
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                }}>
                  <TableHead>
                    <TableRow sx={{ 
                      '& .MuiTableCell-root': {
                        backgroundColor: '#f5f5f5',
                        color: 'rgba(0, 0, 0, 0.87)'
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0', fontSize: 16, padding: '8px' }}>CONCEPTO</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0', fontSize: 16, padding: '8px' }}>IMPORTE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ border: '1px solid #e0e0e0', fontSize: 14, padding: '8px' }}>{item.name}</TableCell>
                        <TableCell align="right" sx={{ border: '1px solid #e0e0e0', fontSize: 14, padding: '8px' }}>
                          {item.amount ? formatARS(item.amount) : '__________'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ 
                      '& .MuiTableCell-root': {
                        backgroundColor: '#f5f5f5',
                        color: 'rgba(0, 0, 0, 0.87)'
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>TOTAL</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>
                        {formatARS(total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Box sx={{ mt: 2, width: '48%' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>OBSERVACIONES:</strong>
                  </Typography>
                  <Box sx={{ border: '1px solid #e0e0e0', minHeight: '80px', p: 1 }}>
                    {sinergieData.observaciones || '________________________________________________________________'}
                  </Box>
                </Box>
                <Box sx={{ mt: 2, width: '48%' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>FIRMA RESPONSABLE:</strong>
                  </Typography>
                  <Box sx={{ borderBottom: '1px solid #000', minHeight: '30px', mb: 2 }}></Box>
                  <Typography variant="body2" align="center">
                    Aclaración y Firma
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </ThemeProvider>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 2,
          '& .MuiButton-root': {
            color: '#1976d2 !important',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04) !important'
            }
          },
          '& .MuiButton-contained': {
            color: '#fff !important',
            backgroundColor: '#1976d2 !important',
            '&:hover': {
              backgroundColor: '#1565c0 !important'
            }
          }
        }}>
          <Button 
            variant="outlined" 
            onClick={() => setActiveTab(0)}
            startIcon={<DescriptionIcon />}
          >
            Volver a cargar archivo
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveToFile}
            disabled={!fileLoaded}
            startIcon={<SaveIcon />}
          >
            Guardar Planilla
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{
      p: 3, 
      width: '1000px', 
      maxWidth: '100%',
      boxSizing: 'border-box',
      mx: 'auto',
      '& .MuiFormControl-root': { mt: 1 }  
      }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        color: '#90caf9', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        mb: 2 
      }}>
        Planilla de Corte de Caja
      </Typography>
      
      <AppBar position="static" color="default" sx={{ mb: 3, borderRadius: 1, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Carga desde Sinergie" />
          <Tab label="Planilla de Cierre" />
        </Tabs>
      </AppBar>

      {activeTab === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Datos del Turno
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2, '& .MuiFormControl-root': { width: '100%' } }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ position: 'relative', width: '100%', mt: 0, mb: 1, height: '56px', display: 'flex', alignItems: 'center' }}>
                  <select
                    value={sinergieData.turno}
                    onChange={(e) => setSinergieData(prev => ({ ...prev, turno: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '56px',
                      padding: '16px 14px',
                      marginTop: '15.5px',
                      border: '1px solid rgba(255, 255, 255, 0.23)',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      fontSize: '1rem',
                      color: sinergieData.turno ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      appearance: 'none',
                      outline: 'none',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.87)'
                      },
                      '&:focus': {
                        borderColor: '#90caf9',
                        borderWidth: '1px',
                        boxShadow: '0 0 0 1px #90caf9'
                      }
                    }}
                  >
                    <option value="" disabled style={{ color: 'rgba(255, 255, 255, 0.7)', backgroundColor: '#121212' }}>
                      Seleccionar turno
                    </option>
                      <option value="Turno Mañana" style={{ color: 'white', backgroundColor: '#121212' }}>Turno Mañana</option>
                    <option value="Turno Tarde" style={{ color: 'white', backgroundColor: '#121212' }}>Turno Tarde</option>
                    <option value="Turno Noche" style={{ color: 'white', backgroundColor: '#121212' }}>Turno Noche</option>
                  </select>
                  <Box sx={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    ▼
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha"
                  value={sinergieData.fecha}
                  onChange={(e) => setSinergieData(prev => ({ ...prev, fecha: e.target.value }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="time"
                  label="Hora"
                  value={sinergieData.hora}
                  onChange={(e) => setSinergieData(prev => ({ ...prev, hora: e.target.value }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Cajero/a"
                  value={sinergieData.cajero}
                  onChange={(e) => setSinergieData(prev => ({ ...prev, cajero: e.target.value }))}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, mb: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ingresar Valores
              </Typography>
              
              <Grid container spacing={2} sx={{ maxWidth: '600px' }}>
                {items.map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">{item.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                        value={item.amount ? `$${item.formattedAmount}` : ''}
                        onChange={(e) => {
                          // Remover el símbolo $ si existe antes de procesar
                          const value = e.target.value.startsWith('$') ? e.target.value.substring(1) : e.target.value;
                          handleFormattedChange({ target: { value } }, index);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const nextIndex = index + 1;
                            if (nextIndex < items.length) {
                              const nextInput = inputRefs.current[nextIndex];
                              if (nextInput) {
                                nextInput.focus();
                              }
                            }
                          }
                        }}
                        inputRef={el => inputRefs.current[index] = el}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '40px'
                          },
                          '& .MuiOutlinedInput-input': {
                            textAlign: 'right',
                            padding: '8px 12px'
                          }
                        }}
                        inputProps={{
                          inputMode: 'decimal'
                        }}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                Ingrese los montos correspondientes a cada concepto
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Agregar Concepto Personalizado
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Concepto"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  onKeyDown={handleNewItemKeyDown}
                />
                <TextField
                  label="Monto"
                  value={newItem.amount ? `$${newItem.formattedAmount}` : ''}
                  onChange={(e) => {
                    // Remover el símbolo $ si existe antes de procesar
                    const value = e.target.value.startsWith('$') ? e.target.value.substring(1) : e.target.value;
                    handleNewItemFormattedChange(value, newItem.formattedAmount);
                  }}
                  onKeyDown={handleNewItemKeyDown}
                  sx={{ width: '150px' }}
                  inputProps={{
                    style: { textAlign: 'right' },
                    inputMode: 'decimal'
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddItem}
                  disabled={!newItem.name || !newItem.amount}
                >
                  Agregar
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleResetForm}
              >
                Limpiar Todo
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setActiveTab(1)}
                  startIcon={<DescriptionIcon />}
                >
                  Vista Previa
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveToFile}
                  startIcon={<DescriptionIcon />}
                >
                  Guardar Planilla
                </Button>
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Total General</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ${formatARS(total)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Vista Previa de la Planilla</Typography>
              <Button 
                variant="outlined" 
                onClick={() => setActiveTab(0)}
                startIcon={<DescriptionIcon />}
              >
                Volver a la carga
              </Button>
            </Box>
            
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fffde7' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                PLANILLA DE CIERRE DE CAJA
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '0.8rem' }}>
                <span><strong>FECHA:</strong> {new Date().toLocaleDateString()}</span>
                <span><strong>TURNO:</strong> {sinergieData.turno || '__________'}</span>
                <span><strong>HORA:</strong> {new Date().toLocaleTimeString()}</span>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem' }}>
                <strong>CAJERO/A:</strong> {sinergieData.cajero || '__________'}
              </Typography>
              
              <TableContainer>
                <Table size="small" sx={{ '& td, & th': { border: '1px solid #e0e0e0', p: 0.5, fontSize: '0.75rem' } }}>
                  <TableHead>
                    <TableRow sx={{ 
                  '& .MuiTableCell-root': {
                    backgroundColor: '#f5f5f5',
                    color: 'rgba(0, 0, 0, 0.87)'
                  }
                }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>CONCEPTO</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>IMPORTE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.filter(item => item.amount).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">${item.formattedAmount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ 
                  '& .MuiTableCell-root': {
                    backgroundColor: '#f5f5f5',
                    color: 'rgba(0, 0, 0, 0.87)'
                  }
                }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>${formatARS(total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      )}
      {activeTab === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Total General</Typography>
              <Typography variant="h6">
                ${formatARS(total)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Total General</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${formatARS(total)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
    </Box>
  );
}

// Función para formatear un número como moneda argentina
const formatARS = (value) => {
  if (value === '' || value === null || value === undefined) return '0,00';
  
  // Asegurarse de que el valor sea un número
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : value;
  
  // Formatear el número con separadores de miles y decimales
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

export default ClosureChecklist;