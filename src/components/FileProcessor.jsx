import React, { useState, useCallback } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Alert,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FileUpload as FileUploadIcon,
  TableChart as TableChartIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

const DropZone = ({ onDrop, children, isDragActive, disabled }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onDrop(files[0]);
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        width: '100%',
        border: '2px dashed',
        borderColor: disabled ? 'rgba(255, 255, 255, 0.2)' : isDragActive ? '#90caf9' : 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        p: 3,
        transition: 'all 0.2s ease',
        backgroundColor: isDragActive ? 'rgba(144, 202, 249, 0.08)' : 'transparent',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        '&:hover': {
          borderColor: disabled ? 'rgba(255, 255, 255, 0.2)' : '#90caf9',
          backgroundColor: disabled ? 'transparent' : 'rgba(144, 202, 249, 0.04)'
        }
      }}
    >
      {children}
    </Box>
  );
};

const FileProcessor = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [referenceData, setReferenceData] = useState(null);
  const [showUploadButtons, setShowUploadButtons] = useState(true);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDraggingReference, setIsDraggingReference] = useState(false);
  const [isDraggingInput, setIsDraggingInput] = useState(false);

  // Función para normalizar códigos
  const normalizeCode = (code) => {
    if (!code) return '';
    return String(code).trim().toUpperCase();
  };

  const isValidFileType = (file) => {
    const validExtensions = ['.xlsx', '.xls', '.ods'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  const handleReferenceFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (!isValidFileType(file)) {
        setError('Por favor, selecciona un archivo Excel o OpenOffice (.xlsx, .xls, .ods)');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

          if (jsonData.length === 0) {
            throw new Error('El archivo de referencia está vacío');
          }

          // Normalizar códigos en los datos de referencia
          // Asumimos que el código está en la columna B y el mueble en la columna A
          const normalizedData = jsonData.slice(1).map(row => ({
            mueble: row.A,
            codigo: normalizeCode(row.B)
          }));

          console.log('Datos de referencia:', normalizedData);
          setReferenceData(normalizedData);
          setError(null);
        } catch (err) {
          console.error('Error al procesar el archivo de referencia:', err);
          setError('Error al procesar el archivo. Verifica que el formato sea correcto y contenga las columnas necesarias.');
        }
      };

      reader.onerror = () => {
        setError('Error al leer el archivo. Intenta nuevamente.');
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error al procesar el archivo:', err);
      setError('Error al procesar el archivo. Por favor, intenta nuevamente.');
    }
  };

  const handleInputFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!referenceData) {
      setError('Por favor, carga primero el archivo de referencia de muebles.');
      return;
    }

    try {
      if (!isValidFileType(file)) {
        setError('Por favor, selecciona un archivo Excel o OpenOffice (.xlsx, .xls, .ods)');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            throw new Error('El archivo está vacío');
          }

          // Procesar datos y colocar mueble como primera columna
          const processedData = jsonData.map(row => {
            const normalizedCode = normalizeCode(row.CodProducto);
            console.log('Buscando código:', normalizedCode);
            const reference = referenceData.find(ref => ref.codigo === normalizedCode);
            console.log('Referencia encontrada:', reference);
            
            // Crear nuevo objeto con mueble como primera propiedad
            return {
              Mueble: reference ? reference.mueble : 'No encontrado',
              ...row
            };
          });

          setData(processedData);
          setError(null);
          setShowUploadButtons(false);
        } catch (err) {
          console.error('Error al procesar el archivo:', err);
          setError('Error al procesar el archivo. Verifica que el formato sea correcto y contenga los datos necesarios.');
        }
      };

      reader.onerror = () => {
        setError('Error al leer el archivo. Intenta nuevamente.');
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error al procesar el archivo:', err);
      setError('Error al procesar el archivo. Por favor, intenta nuevamente.');
    }
  };

  const handleDownload = (format) => {
    if (!data) return;

    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Resultados");
      
      let fileName = "resultados";
      switch(format) {
        case 'xls':
          fileName += '.xls';
          XLSX.writeFile(wb, fileName, { bookType: 'biff2' });
          break;
        case 'ods':
          fileName += '.ods';
          XLSX.writeFile(wb, fileName, { bookType: 'ods' });
          break;
        default: // xlsx
          fileName += '.xlsx';
          XLSX.writeFile(wb, fileName);
      }
    } catch (err) {
      console.error('Error al descargar el archivo:', err);
      setError('Error al generar el archivo de descarga. Por favor, intenta nuevamente.');
    }
    setDownloadAnchorEl(null);
  };

  const handleClear = () => {
    setData(null);
    setReferenceData(null);
    setError(null);
    setShowUploadButtons(true);
  };

  const handleSort = () => {
    if (!data) return;

    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);

    const sortedData = [...data].sort((a, b) => {
      if (newDirection === 'asc') {
        return a.Mueble.localeCompare(b.Mueble);
      } else {
        return b.Mueble.localeCompare(a.Mueble);
      }
    });

    setData(sortedData);
  };

  const handleReferenceFileDrop = useCallback((file) => {
    if (isValidFileType(file)) {
      handleReferenceFileUpload({ target: { files: [file] } });
    } else {
      setError('Por favor, arrastra un archivo Excel o OpenOffice (.xlsx, .xls, .ods)');
    }
  }, []);

  const handleInputFileDrop = useCallback((file) => {
    if (!referenceData) {
      setError('Por favor, carga primero el archivo de referencia de muebles.');
      return;
    }
    if (isValidFileType(file)) {
      handleInputFileUpload({ target: { files: [file] } });
    } else {
      setError('Por favor, arrastra un archivo Excel o OpenOffice (.xlsx, .xls, .ods)');
    }
  }, [referenceData]);

  return (
    <Box 
      sx={{ 
        p: 3, 
        width: '100%', 
        maxWidth: 1200, 
        margin: '0 auto',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
        {showUploadButtons ? (
          <>
            <Typography variant="h6" gutterBottom sx={{ color: '#90caf9', textAlign: 'center' }}>
              Pasos para procesar el archivo:
            </Typography>
            <Typography variant="body1" component="ol" sx={{ pl: 2, mb: 4 }}>
              <li>Carga el archivo de referencia de muebles (.xls o .xlsx)</li>
              <li>Carga el archivo de precios a procesar (.xls o .xlsx)</li>
              <li>Descarga el archivo resultante con la columna de muebles agregada</li>
            </Typography>
            
            <Stack spacing={3} direction="column" sx={{ width: '100%', maxWidth: 600, alignItems: 'stretch' }}>
              <DropZone
                onDrop={handleReferenceFileDrop}
                isDragActive={isDraggingReference}
                disabled={false}
              >
                <Stack spacing={2} alignItems="center">
                  <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}>
                    Arrastra aquí el archivo de referencia de muebles o
                  </Typography>
                  <Tooltip title="Selecciona el archivo que contiene la referencia de muebles" arrow>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<FileUploadIcon />}
                      color="primary"
                      sx={{ 
                        backgroundColor: '#90caf9',
                        '&:hover': { backgroundColor: '#64b5f6' },
                        py: 2
                      }}
                    >
                      Paso 1: Seleccionar archivo de referencia
                      <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={handleReferenceFileUpload}
                      />
                    </Button>
                  </Tooltip>
                </Stack>
              </DropZone>
              
              <DropZone
                onDrop={handleInputFileDrop}
                isDragActive={isDraggingInput}
                disabled={!referenceData}
              >
                <Stack spacing={2} alignItems="center">
                  <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}>
                    Arrastra aquí el archivo de precios o
                  </Typography>
                  <Tooltip title="Selecciona el archivo de precios que deseas procesar" arrow>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<TableChartIcon />}
                      disabled={!referenceData}
                      color="secondary"
                      sx={{ 
                        backgroundColor: '#f48fb1',
                        '&:hover': { backgroundColor: '#f06292' },
                        py: 2
                      }}
                    >
                      Paso 2: Seleccionar archivo de precios
                      <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={handleInputFileUpload}
                      />
                    </Button>
                  </Tooltip>
                </Stack>
              </DropZone>
            </Stack>
          </>
        ) : (
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 1 }}>
            <Tooltip title="Ordenar por mueble" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<SortIcon />}
                onClick={handleSort}
                sx={{ 
                  backgroundColor: '#4fc3f7',
                  '&:hover': { backgroundColor: '#29b6f6' }
                }}
              >
                {`Ordenar ${sortDirection === 'desc' ? '↑' : '↓'}`}
              </Button>
            </Tooltip>
            <Tooltip title="Descargar archivo procesado" arrow>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={(e) => setDownloadAnchorEl(e.currentTarget)}
                sx={{ 
                  backgroundColor: '#90caf9',
                  '&:hover': { backgroundColor: '#64b5f6' }
                }}
              >
                Descargar resultados
              </Button>
            </Tooltip>
            <Menu
              anchorEl={downloadAnchorEl}
              open={Boolean(downloadAnchorEl)}
              onClose={() => setDownloadAnchorEl(null)}
            >
              <MenuItem onClick={() => handleDownload('xlsx')}>Guardar como XLSX</MenuItem>
              <MenuItem onClick={() => handleDownload('xls')}>Guardar como XLS</MenuItem>
              <MenuItem onClick={() => handleDownload('ods')}>Guardar como ODS</MenuItem>
            </Menu>
            <Tooltip title="Volver a empezar" arrow>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={handleClear}
                sx={{ 
                  backgroundColor: '#f48fb1',
                  '&:hover': { backgroundColor: '#f06292' }
                }}
              >
                Volver a empezar
              </Button>
            </Tooltip>
          </Stack>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600, margin: '0 auto' }}>
          {error}
        </Alert>
      )}

      {data && (
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: 440,
            mt: 2,
            '& .MuiPaper-root': {
              boxShadow: 'none'
            }
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell 
                    key={key}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#2d2d2d'
                    }}
                  >
                    {key}
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
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FileProcessor; 