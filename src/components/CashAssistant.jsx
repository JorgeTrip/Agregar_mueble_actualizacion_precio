import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

function CashAssistant() {
  const [amounts, setAmounts] = useState([]);
  const [currentAmount, setCurrentAmount] = useState('');
  const [cashFund, setCashFund] = useState('');
  const [includeCashFund, setIncludeCashFund] = useState(false);
  const [systemTotal, setSystemTotal] = useState(0);
  const [discrepancy, setDiscrepancy] = useState(0);

  const formatARS = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  useEffect(() => {
    setDiscrepancy(calculatePhysicalTotal() - systemTotal);
  }, [amounts, cashFund, includeCashFund, systemTotal]);

  const calculatePhysicalTotal = () => {
    const total = amounts.reduce((sum, amount) => sum + Number(amount), 0);
    return includeCashFund ? total - (Number(cashFund) || 0) : total;
  };

  const handleAddAmount = (e) => {
    if (e.key === 'Enter' && currentAmount) {
      const amount = parseFloat(currentAmount);
      if (!isNaN(amount) && amount > 0) {
        setAmounts(prev => [...prev, amount.toFixed(2)]);
        setCurrentAmount('');
      }
    }
  };

  const handleClearAll = () => {
    setAmounts([]);
    setCashFund('');
    setSystemTotal(0);
    setIncludeCashFund(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Asistente de Arqueo de Caja
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontStyle: 'italic', letterSpacing: '0.1em', textAlign: 'center', mb: 4 }}>
        By J.O.T.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Recuento Físico
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
            Instrucciones: Ingrese cada monto individual y presione Enter para confirmar.
            <br/>
            Ejemplo: Para ingresar $1.500,75 → Escriba "1500.75" y presione Enter
          </Typography>

          <TextField
            fullWidth
            label="Ingresar monto (Presione Enter)"
            type="number"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            onKeyPress={handleAddAmount}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={{ mb: 3 }}
          />

          <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #555', borderRadius: 1 }}>
            {amounts.map((amount, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`${index + 1}. $${formatARS(amount)}`}
                  sx={{ '& .MuiListItemText-primary': { fontFamily: 'monospace' } }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeCashFund}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setIncludeCashFund(isChecked);
                    setCashFund(isChecked ? '' : '0');
                  }}
                />
              }
              label="Incluir fondo de caja"
            />
            
            <Button variant="outlined" color="error" onClick={handleClearAll}>
              Borrar Todo
            </Button>
          </Box>

          {includeCashFund && (
            <TextField
              fullWidth
              label="Fondo de caja"
              type="number"
              value={cashFund}
              onChange={(e) => setCashFund(e.target.value)}
              InputProps={{
                inputProps: { 
                  min: 0,
                  step: 0.01,
                  pattern: "[0-9]*" 
                }
              }}
              sx={{ mt: 2 }}
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Totales
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Concepto</TableCell>
                  <TableCell align="right">Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total ingresado</TableCell>
                  <TableCell align="right">${formatARS(amounts.reduce((sum, amount) => sum + Number(amount), 0))}</TableCell>
                </TableRow>
                {includeCashFund && (
                  <TableRow>
                    <TableCell>Fondo de caja (-)</TableCell>
                    <TableCell align="right">${formatARS(cashFund)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>Total físico</TableCell>
                  <TableCell align="right">${formatARS(calculatePhysicalTotal())}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ width: '200px' }}>
                    <TextField
                      fullWidth
                      label="Total sistema"
                      type="number"
                      value={systemTotal || ''}
                      onChange={(e) => setSystemTotal(Number(e.target.value))}
                      onFocus={(e) => e.target.value === '0' && setSystemTotal('')}
                      InputProps={{
                        inputProps: { 
                          min: 0,
                          step: 0.01
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ width: '150px' }}>${formatARS(systemTotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Diferencia</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: discrepancy === 0 ? 'inherit' : discrepancy > 0 ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}
                  >
                    ${formatARS(discrepancy)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CashAssistant;