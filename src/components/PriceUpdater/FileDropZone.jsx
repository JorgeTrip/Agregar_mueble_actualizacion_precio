import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  alpha
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';

/**
 * @description Componente para arrastrar y soltar archivos
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onDrop - Función que se ejecuta al soltar un archivo
 * @param {boolean} props.isDragActive - Indica si se está arrastrando un archivo sobre la zona
 * @param {Function} props.setIsDragActive - Función para actualizar el estado de arrastre
 * @param {boolean} props.disabled - Indica si la zona está deshabilitada
 * @param {string} props.title - Título de la zona
 * @param {string} props.description - Descripción de la zona
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {File} props.file - Archivo seleccionado
 * @param {string} props.color - Color del componente (primary, secondary, etc.)
 * @returns {JSX.Element} Componente de zona para arrastrar y soltar archivos
 */
const FileDropZone = ({ 
  onDrop, 
  isDragActive, 
  setIsDragActive, 
  disabled = false, 
  title, 
  description, 
  icon, 
  file,
  color = 'primary'
}) => {
  /**
   * @description Maneja el evento de arrastrar sobre el componente
   * @param {React.DragEvent} e - Evento de arrastre
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragActive(true);
  };
  
  /**
   * @description Maneja el evento de arrastrar fuera del componente
   * @param {React.DragEvent} e - Evento de arrastre
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
  };
  
  /**
   * @description Maneja el evento de arrastrar sobre el componente
   * @param {React.DragEvent} e - Evento de arrastre
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    e.dataTransfer.dropEffect = 'copy';
  };
  
  /**
   * @description Maneja el evento de soltar un archivo
   * @param {React.DragEvent} e - Evento de arrastre
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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: isDragActive 
          ? (theme) => alpha(theme.palette[color].main, 0.08)
          : disabled 
            ? 'rgba(0, 0, 0, 0.05)' 
            : 'background.paper',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          width: '100%',
          border: '2px dashed',
          borderColor: isDragActive 
            ? `${color}.main` 
            : disabled 
              ? 'grey.300' 
              : 'grey.500',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
          '&:hover': {
            borderColor: !disabled ? `${color}.main` : 'grey.300',
            backgroundColor: !disabled 
              ? (theme) => alpha(theme.palette[color].main, 0.04)
              : 'transparent'
          }
        }}
      >
        {file ? (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Archivo cargado
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 1,
                mb: 2
              }}
            >
              <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {file.name}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Tamaño: {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        ) : (
          <>
            {icon || <CloudUploadIcon sx={{ fontSize: 48, color: disabled ? 'action.disabled' : `${color}.main`, mb: 2 }} />}
            
            <Typography variant="h6" gutterBottom>
              {title || 'Cargar archivo'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description || 'Arrastre y suelte un archivo aquí, o haga clic para seleccionar un archivo'}
            </Typography>
            
            {!disabled && (
              <Button 
                variant="outlined" 
                component="label"
                color={color}
                size="small"
                startIcon={<CloudUploadIcon />}
              >
                Seleccionar archivo
                <input 
                  type="file" 
                  hidden 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onDrop(e.target.files[0]);
                    }
                  }} 
                />
              </Button>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default FileDropZone;
