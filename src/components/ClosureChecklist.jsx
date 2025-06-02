import React, { useState } from 'react';
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
    if (value === '' || value === null || value === undefined) return '';
    
    // Usar Intl.NumberFormat para formatear con puntos y comas
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    
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
   * @description Maneja el cambio en un campo numérico con formato
   * @param {string} value - El valor ingresado
   * @param {Function} setRawValue - Función para establecer el valor crudo
   * @param {Function} setFormattedValue - Función para establecer el valor formateado
   * @param {string} prevValue - El valor anterior formateado (opcional)
   */
  const handleFormattedChange = (e, index) => {
    const value = e.target.value;
    const prevItem = items[index];
    
    // Si es un valor vacío, reiniciar ambos estados
    if (value === '') {
      const newItems = [...items];
      newItems[index] = { ...prevItem, amount: '', formattedAmount: '' };
      setItems(newItems);
      return;
    }
    
    // Validar que solo se ingresen números, comas y puntos
    const regex = /^[0-9,.]*$/;
    if (!regex.test(value)) return;
    
    // Detectar si se acaba de agregar un punto (probablemente desde el teclado numérico)
    const justAddedDot = value.endsWith('.') && !prevItem.formattedAmount.endsWith(',');
    
    // Procesar el valor para manejar el punto/coma decimal
    let processedValue = justAddedDot ? value.slice(0, -1) + ',' : value;
    
    // Eliminar cualquier caracter que no sea dígito, punto o coma
    const cleanValue = processedValue.replace(/[^0-9,.]/g, '');
    
    // Separar la parte entera y decimal (si existe)
    let [integerPart, decimalPart] = cleanValue.split(',');
    
    // Eliminar cualquier punto existente en la parte entera
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
    
    // Convertir a número para cálculos internos
    const numericStr = integerPart + (decimalPart !== undefined ? '.' + decimalPart : '');
    const numericValue = parseFloat(numericStr) || 0;
    
    // Actualizar el estado
    const newItems = [...items];
    newItems[index] = {
      ...prevItem,
      amount: numericValue.toString(),
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
            const amount = totales[item.name].toString();
            return {
              ...item,
              amount,
              formattedAmount: formatARS(parseFloat(amount))
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
  const renderPlanilla = () => (
    <Box sx={{ mt: 2 }}>
      <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#fffde7' }}>
        <CardContent>
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
            <Table size="small" sx={{ border: '1px solid #e0e0e0' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>CONCEPTO</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>IMPORTE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: '1px solid #e0e0e0' }}>{item.name}</TableCell>
                    <TableCell align="right" sx={{ border: '1px solid #e0e0e0' }}>
                      {item.formattedAmount ? `$${item.formattedAmount}` : '__________'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>TOTAL</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>
                    ${formatARS(total)}
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
        >
          Guardar Planilla
        </Button>
      </Box>
    </Box>
  );

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
                        value={item.formattedAmount}
                        onChange={(e) => handleFormattedChange(e, index)}
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
                  value={newItem.formattedAmount}
                  onChange={handleNewItemAmountChange}
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
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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