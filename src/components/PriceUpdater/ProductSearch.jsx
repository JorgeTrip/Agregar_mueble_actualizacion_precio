import React, { useRef } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  Paper,
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

/**
 * @description Componente para buscar productos en los datos
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSearch - Función que se ejecuta al buscar
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {Function} props.setSearchTerm - Función para actualizar el término de búsqueda
 * @param {string} props.placeholder - Texto de placeholder para el campo de búsqueda
 * @returns {JSX.Element} Componente de búsqueda de productos
 */
const ProductSearch = ({ onSearch, searchTerm, setSearchTerm, placeholder }) => {
  // Referencia al campo de búsqueda para poder enfocarlo
  const searchInputRef = useRef(null);
  /**
   * @description Maneja el cambio en el campo de búsqueda
   * @param {React.ChangeEvent} e - Evento de cambio
   */
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  /**
   * @description Limpia el campo de búsqueda y enfoca el input
   */
  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
    
    // Enfocar el campo de búsqueda después de limpiarlo
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  /**
   * @description Maneja la tecla Enter en el campo de búsqueda
   * @param {React.KeyboardEvent} e - Evento de teclado
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder || "Buscar por código o descripción..."}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          inputRef={searchInputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(144, 202, 249, 0.5)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#90caf9',
              },
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default ProductSearch;
