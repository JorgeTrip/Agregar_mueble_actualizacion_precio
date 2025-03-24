import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  FormHelperText,
  InputAdornment
} from '@mui/material';

function DosageCalculator() {
  const [medication, setMedication] = useState('ibuprofen');
  const [concentration, setConcentration] = useState('2');
  const [weight, setWeight] = useState('');
  const [dosage, setDosage] = useState(null);
  const [totalDaily, setTotalDaily] = useState(null);
  const [error, setError] = useState('');
  // New states for antibiotic syrup
  const [prescribedDose, setPrescribedDose] = useState('5');
  const [frequency, setFrequency] = useState('8');
  const [duration, setDuration] = useState('7');
  const [requiredVolume, setRequiredVolume] = useState(null);

  // Medication configurations
  const medications = {
    ibuprofen: {
      name: 'Ibuprofeno',
      dosagePerKg: 10,
      maxDailyPerKg: 30,
      frequency: '6-8 horas',
      concentrations: [
        { value: '2', label: '2% (20 mg/ml)' },
        { value: '4', label: '4% (40 mg/ml)' }
      ]
    },
    paracetamol: {
      name: 'Paracetamol',
      dosagePerKg: 15,
      maxDailyPerKg: 60,
      frequency: '6 horas',
      concentrations: [
        { value: '2', label: '2% (20 mg/ml)' }
      ]
    },
    antibiotic: {
      name: 'Antibiótico en jarabe',
      isCustom: true
    }
  };

  // Calculate dosage when inputs change
  useEffect(() => {
    if (medication === 'antibiotic') {
      calculateAntibioticVolume();
    } else if (weight && !isNaN(weight) && parseFloat(weight) > 0) {
      calculateDosage();
      setError('');
    } else if (weight) {
      setError('Por favor ingrese un peso válido');
      setDosage(null);
      setTotalDaily(null);
    }
  }, [medication, concentration, weight, prescribedDose, frequency, duration]);

  const calculateDosage = () => {
    const med = medications[medication];
    const weightNum = parseFloat(weight);
    const concNum = parseFloat(concentration);
    
    // Calculate single dose in ml
    const singleDose = (weightNum * med.dosagePerKg) / (concNum * 10);
    setDosage(singleDose);
    
    // Calculate total daily dose
    const dailyDose = weightNum * med.maxDailyPerKg;
    setTotalDaily(dailyDose);
  };

  const calculateAntibioticVolume = () => {
    if (!prescribedDose || !frequency || !duration) {
      setRequiredVolume(null);
      return;
    }

    const dosePerTime = parseFloat(prescribedDose);
    const timesPerDay = 24 / parseFloat(frequency);
    const days = parseFloat(duration);

    if (isNaN(dosePerTime) || isNaN(timesPerDay) || isNaN(days)) {
      setRequiredVolume(null);
      return;
    }

    // Calculate total volume needed for the entire treatment
    const totalVolume = dosePerTime * timesPerDay * days;
    setRequiredVolume(totalVolume);
  };

  const formatDosage = (value) => {
    if (value === null) return '';
    return value.toFixed(2);
  };

  const getDosesPerDay = () => {
    const med = medications[medication];
    if (medication === 'ibuprofen') {
      return '3 tomas de ' + formatDosage(dosage) + ' ml cada 8 horas';
    } else if (medication === 'paracetamol') {
      return '4 tomas de ' + formatDosage(dosage) + ' ml cada 6 horas';
    }
    return '';
  };

  const getRecommendedBottleSize = (volume) => {
    // Common antibiotic bottle sizes in ml
    const commonSizes = [60, 90, 100, 120, 150, 200, 240];
    
    // Find the smallest bottle size that can contain the required volume
    for (const size of commonSizes) {
      if (size >= volume) {
        return size;
      }
    }
    
    // If volume is larger than all common sizes, recommend the largest one
    // or suggest multiple bottles
    if (volume > commonSizes[commonSizes.length - 1]) {
      const largestSize = commonSizes[commonSizes.length - 1];
      const bottles = Math.ceil(volume / largestSize);
      return `${bottles} frascos de ${largestSize} ml`;
    }
    
    return commonSizes[commonSizes.length - 1];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Calculadora de Dosis Pediátricas
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontStyle: 'italic', letterSpacing: '0.1em', textAlign: 'center', mb: 4 }}>
        By J.O.T.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Parámetros de cálculo
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="medication-label">Medicamento</InputLabel>
              <Select
                labelId="medication-label"
                value={medication}
                label="Medicamento"
                onChange={(e) => setMedication(e.target.value)}
              >
                <MenuItem value="ibuprofen">Ibuprofeno</MenuItem>
                <MenuItem value="paracetamol">Paracetamol</MenuItem>
                <MenuItem value="antibiotic">Antibiótico en jarabe</MenuItem>
              </Select>
            </FormControl>
            
            {medication !== 'antibiotic' ? (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="concentration-label">Concentración</InputLabel>
                  <Select
                    labelId="concentration-label"
                    value={concentration}
                    label="Concentración"
                    onChange={(e) => setConcentration(e.target.value)}
                  >
                    {medications[medication].concentrations.map((conc) => (
                      <MenuItem key={conc.value} value={conc.value}>
                        {conc.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {concentration === '2' ? '20 mg/ml' : '40 mg/ml'}
                  </FormHelperText>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Peso del niño"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  error={!!error}
                  helperText={error || ''}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    inputProps: { min: 0, step: 0.1 }
                  }}
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Dosis prescrita"
                  type="number"
                  value={prescribedDose}
                  onChange={(e) => setPrescribedDose(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ml</InputAdornment>,
                    inputProps: { min: 0, step: 0.1 }
                  }}
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="frequency-label">Frecuencia</InputLabel>
                  <Select
                    labelId="frequency-label"
                    value={frequency}
                    label="Frecuencia"
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <MenuItem value="6">Cada 6 horas</MenuItem>
                    <MenuItem value="8">Cada 8 horas</MenuItem>
                    <MenuItem value="12">Cada 12 horas</MenuItem>
                    <MenuItem value="24">Cada 24 horas</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Duración del tratamiento"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">días</InputAdornment>,
                    inputProps: { min: 1, step: 1 }
                  }}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <Card sx={{ mb: 2, bgcolor: 'rgba(144, 202, 249, 0.08)' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {medication === 'antibiotic' ? 'Fórmula para antibiótico:' : 'Fórmula general:'}
                </Typography>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'rgba(0, 0, 0, 0.2)', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  textAlign: 'center'
                }}>
                  {medication === 'antibiotic' 
                    ? 'Volumen total = Dosis por toma × (24 ÷ Frecuencia en horas) × Días'
                    : 'Dosis por toma = (Peso en kg × mg/kg/dosis) ÷ Concentración (mg/ml)'}
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Resultados
            </Typography>
            
            {medication === 'antibiotic' ? (
              requiredVolume !== null ? (
                <>
                  <Card sx={{ mb: 2, bgcolor: 'rgba(244, 143, 177, 0.08)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Para un tratamiento de {duration} días con dosis de {prescribedDose} ml cada {frequency} horas:
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        • Volumen total necesario: {formatDosage(requiredVolume)} ml
                      </Typography>
                    </CardContent>
                  </Card>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3 }}>
                    Recomendaciones clave:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      Usar jeringa graduada según la dosis indicada por el médico
                    </Typography>
                    <Typography component="li" variant="body2">
                      Una vez abierto el frasco, mantener el antibiótico refrigerado durante el tratamiento
                    </Typography>
                    <Typography component="li" variant="body2">
                      Agitar el frasco antes de administrar cada dosis
                    </Typography>
                    <Typography component="li" variant="body2">
                      Completar todo el tratamiento aunque los síntomas mejoren
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Ingrese los datos del tratamiento para calcular el volumen necesario
                </Typography>
              )
            ) : (
              dosage !== null ? (
                <>
                  <Card sx={{ mb: 2, bgcolor: 'rgba(244, 143, 177, 0.08)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Para un niño de {weight} kg con dosis de {medications[medication].dosagePerKg} mg/kg cada {medications[medication].frequency}:
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        • Dosis por toma: {formatDosage(dosage)} ml
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        • Total diario: {getDosesPerDay()}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3 }}>
                    Recomendaciones clave:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      Verificar la concentración en la etiqueta ({concentration === '2' ? '2% = 20 mg/ml' : '4% = 40 mg/ml'})
                    </Typography>
                    <Typography component="li" variant="body2">
                      Usar jeringa graduada según la dosis indicada por el médico
                    </Typography>
                    <Typography component="li" variant="body2">
                      No superar: {medications[medication].name} {medications[medication].maxDailyPerKg} mg/kg/día
                    </Typography>
                    <Typography component="li" variant="body2">
                      Consultar al médico si el niño pesa menos de 5 kg o tiene menos de 3 meses
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Ingrese el peso del niño para ver los resultados del cálculo
                </Typography>
              ))
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DosageCalculator;