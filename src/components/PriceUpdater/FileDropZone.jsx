import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button
} from '@mui/material';
import { FileUpload as FileUploadIcon } from '@mui/icons-material';

/**
 * @description Componente que permite arrastrar y soltar archivos
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onDrop - Función que se ejecuta cuando se suelta un archivo
 * @param {boolean} props.isDragActive - Indica si hay un archivo siendo arrastrado sobre el componente
 * @param {Function} props.setIsDragActive - Función para actualizar el estado de arrastre
 * @param {boolean} props.disabled - Indica si el componente está deshabilitado
 * @param {string} props.title - Título del componente
 * @param {string} props.description - Descripción del componente
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {File} props.file - Archivo cargado
 * @returns {JSX.Element} Componente de zona para arrastrar y soltar archivos
 */
const FileDropZone = ({ 
  onDrop, 
  isDragActive, 
  setIsDragActive, 
  disabled, 
  title, 
  description, 
  icon,
  file 
}) => {
  /**
   * @description Maneja el evento de arrastrar sobre el componente
   * @param {React.DragEvent} e - Evento de arrastre
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  /**
   * @description Maneja el evento de salir del área de arrastre
   * @param {React.DragEvent} e - Evento de salida
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  /**
   * @description Maneja el evento de soltar un archivo en el componente
   * @param {React.DragEvent} e - Evento de soltar
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onDrop(files[0]);
    }
  };

  /**
   * @description Maneja la selección de archivo mediante el input
   * @param {React.ChangeEvent} e - Evento de cambio
   */
  const handleFileSelect = (e) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      onDrop(files[0]);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: disabled ? 'rgba(0, 0, 0, 0.12)' : 'rgba(25, 118, 210, 0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          width: '100%',
          border: '2px dashed',
          borderColor: disabled 
            ? 'rgba(255, 255, 255, 0.2)' 
            : isDragActive 
              ? '#90caf9' 
              : 'rgba(255, 255, 255, 0.3)',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          backgroundColor: isDragActive 
            ? 'rgba(144, 202, 249, 0.08)' 
            : 'transparent',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          '&:hover': {
            borderColor: disabled 
              ? 'rgba(255, 255, 255, 0.2)' 
              : '#90caf9',
            backgroundColor: disabled 
              ? 'transparent' 
              : 'rgba(144, 202, 249, 0.04)'
          }
        }}
      >
        {file ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Archivo cargado
            </Typography>
            <Typography variant="body1">
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              {icon || <FileUploadIcon sx={{ fontSize: 40, color: '#90caf9' }} />}
            </Box>
            <Typography variant="h6" gutterBottom>
              {title || 'Cargar archivo'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {description || 'Arrastre y suelte un archivo aquí o haga clic para seleccionarlo'}
            </Typography>
            <Button
              component="label"
              variant="outlined"
              sx={{ mt: 2 }}
              disabled={disabled}
            >
              Seleccionar archivo
              <input
                type="file"
                hidden
                accept=".xlsx,.xls,.csv,.ods"
                onChange={handleFileSelect}
                disabled={disabled}
              />
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default FileDropZone;
