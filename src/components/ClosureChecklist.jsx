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
  Button
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useRef, useEffect } from 'react';

/**
 * @fileoverview Componente para gestionar el checklist de cierre de caja de una farmacia
 * @author J.O.T.
 * @version 1.0.0
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
 * @description Componente principal que gestiona el checklist de cierre
 * @returns {JSX.Element} Componente de checklist de cierre
 */
function ClosureChecklist() {
  /** @type {[{name: string, amount: string, formattedAmount: string}[], Function]} Estado para almacenar los items del checklist */
  const [items, setItems] = useState(
    predefinedItems.map(name => ({ name, amount: '', formattedAmount: '' }))
  );
  /** @type {[{name: string, amount: string, formattedAmount: string}, Function]} Estado para el nuevo item que se está ingresando */
  const [newItem, setNewItem] = useState({ name: '', amount: '', formattedAmount: '' });
  /** @type {React.MutableRefObject<HTMLInputElement[]>} Referencias a los campos de entrada para navegación con teclado */
  const inputRefs = useRef([]);

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
  const handleFormattedChange = (value, index, prevValue = '') => {
    // Si es un valor vacío, reiniciar ambos estados
    if (value === '') {
      const newItems = [...items];
      newItems[index].amount = '';
      newItems[index].formattedAmount = '';
      setItems(newItems);
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
      const newItems = [...items];
      newItems[index].amount = parsedValue.toString();
      newItems[index].formattedAmount = displayValue;
      setItems(newItems);
    } else if (displayValue === '' || displayValue === ',') {
      // Si solo hay una coma o está vacío
      const newItems = [...items];
      newItems[index].amount = '';
      newItems[index].formattedAmount = displayValue;
      setItems(newItems);
    }
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
   * @description Maneja la adición de un nuevo item personalizado al checklist
   * @param {React.KeyboardEvent} e - Evento de teclado
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

  return (
    <Box sx={{
      p: 3, 
      width: '900px', 
      boxSizing: 'border-box',
      overflowX: 'hidden',
      // Agrego manejo de ancho en pantallas pequeñas:
      '@media (max-width: 600px)': {
        width: '100%',
        p: 2
      }
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Checklist de Cierre
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontStyle: 'italic', letterSpacing: '0.1em', textAlign: 'center', mb: 4 }}>
      
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Items Predefinidos
            </Typography>
            <List dense>
              {items.map((item, index) => (
                <ListItem key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <ListItemText primary={item.name} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Monto"
                        value={item.formattedAmount}
                        onChange={(e) => updateItemAmount(index, e.target.value)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        InputProps={{
                          inputProps: { inputMode: 'decimal' },
                          startAdornment: item.formattedAmount ? '$' : null
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Agregar otro concepto
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={handleAddCustom}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Monto"
                  value={newItem.formattedAmount}
                  onChange={(e) => handleNewItemFormattedChange(e.target.value, newItem.formattedAmount)}
                  onKeyPress={handleAddCustom}
                  InputProps={{
                    inputProps: { inputMode: 'decimal' },
                    startAdornment: newItem.formattedAmount ? '$' : null
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleClearAll}
                sx={{ flex: 1 }}
              >
                Borrar Todo
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveToFile}
                sx={{ flex: 1 }}
              >
                Guardar
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Total General: ${formatARS(total)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClosureChecklist;