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

function ClosureChecklist() {
  const [items, setItems] = useState(
    predefinedItems.map(name => ({ name, amount: '' }))
  );
  const [newItem, setNewItem] = useState({ name: '', amount: '' });
  const inputRefs = useRef([]);

  const formatARS = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleAddCustom = (e) => {
    if (e.key === 'Enter' && newItem.name && newItem.amount) {
      setItems(prev => [...prev, {
        name: newItem.name,
        amount: parseFloat(newItem.amount).toFixed(2)
      }]);
      setNewItem({ name: '', amount: '' });
    }
  };

  const updateItemAmount = (index, value) => {
    const newItems = [...items];
    newItems[index].amount = value;
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleClearAll = () => {
    setItems(predefinedItems.map(name => ({ name, amount: '' })));
    setNewItem({ name: '', amount: '' });
  };

  const handleSaveToFile = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const content = items.map(item => 
      `${item.name.padEnd(25)}: $${formatARS(item.amount || 0)}`
    ).join('\n') + `\n\nTOTAL GENERAL: $${formatARS(total)}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${formattedDate} Cierre de caja.txt`);
  };

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Checklist de Cierre
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontStyle: 'italic', letterSpacing: '0.1em', textAlign: 'center', mb: 4 }}>
        By J.O.T.
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
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateItemAmount(index, e.target.value)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
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
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                  onKeyPress={handleAddCustom}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
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