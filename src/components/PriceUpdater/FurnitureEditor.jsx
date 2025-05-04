import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Chip
} from '@mui/material';
import { 
  Save as SaveIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/**
 * @description Componente para editar los muebles de productos sin mueble asignado o con mueble "NO"
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.products - Lista de productos sin mueble o con mueble "NO"
 * @param {Function} props.onSave - Función que se ejecuta al guardar los cambios
 * @param {Array} props.availableFurnitures - Lista de muebles disponibles para seleccionar
 * @returns {JSX.Element} Componente de edición de muebles
 */
const FurnitureEditor = ({ products, onSave, availableFurnitures = [] }) => {
  // Estado para los productos editables
  const [editableProducts, setEditableProducts] = useState([]);
  // Estado para el producto que se está editando actualmente
  const [editingIndex, setEditingIndex] = useState(-1);
  // Estado para el valor temporal del mueble que se está editando
  const [tempFurniture, setTempFurniture] = useState('');

  // Inicializar los productos editables cuando cambian los productos de entrada
  useEffect(() => {
    if (products && products.length > 0) {
      setEditableProducts([...products]);
    }
  }, [products]);

  /**
   * @description Inicia la edición de un producto
   * @param {number} index - Índice del producto a editar
   */
  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setTempFurniture(editableProducts[index].Mueble || '');
  };

  /**
   * @description Cancela la edición de un producto
   */
  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setTempFurniture('');
  };

  /**
   * @description Guarda la edición de un producto
   * @param {number} index - Índice del producto editado
   */
  const handleSaveEdit = (index) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      Mueble: tempFurniture
    };
    setEditableProducts(updatedProducts);
    setEditingIndex(-1);
    setTempFurniture('');
  };

  /**
   * @description Guarda todos los cambios realizados
   */
  const handleSaveAll = () => {
    if (onSave) {
      onSave(editableProducts);
    }
  };

  /**
   * @description Determina el color del chip según el estado del mueble
   * @param {string} mueble - Nombre del mueble
   * @returns {string} Color del chip (error, warning, primary, etc.)
   */
  const getMuebleChipColor = (mueble) => {
    if (!mueble) return 'warning';
    
    const lowerMueble = mueble.toLowerCase();
    
    // Muebles inválidos o no encontrados
    if (
      mueble === 'NO' || 
      lowerMueble.includes('no encontrado') || 
      lowerMueble.includes('sin mueble') ||
      lowerMueble.includes('sin asignar')
    ) {
      return 'error';
    }
    
    return 'primary';
  };

  // Extraer muebles únicos de los productos para sugerencias
  const uniqueFurnitures = [...new Set([
    ...availableFurnitures,
    ...editableProducts
      .map(product => product.Mueble)
      .filter(mueble => 
        mueble && 
        mueble !== 'NO' && 
        !mueble.toLowerCase().includes('no encontrado') &&
        !mueble.toLowerCase().includes('sin mueble') &&
        !mueble.toLowerCase().includes('sin asignar')
      )
  ])].sort();

  // Si no hay productos para editar, no mostrar nada
  if (!editableProducts || editableProducts.length === 0) {
    return null;
  }

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3, 
        mb: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(244, 67, 54, 0.08)', // Fondo rojo suave para destacar
        border: '1px solid rgba(244, 67, 54, 0.3)'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h3" color="error">
          Productos sin mueble asignado o con mueble no válido ({editableProducts.length})
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleSaveAll}
          disabled={editingIndex !== -1}
        >
          Guardar cambios
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Estos productos tienen alguna de las siguientes condiciones:
        <ul>
          <li>Mueble "NO" o "no encontrado"</li>
          <li>Sin mueble asignado</li>
          <li>Con texto que indica que no tienen mueble válido</li>
        </ul>
        Edite los muebles para incluirlos en las planillas por mueble.
        Los productos con mueble no válido no aparecerán en las planillas por mueble, pero sí en la planilla de referencia completa.
      </Typography>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Droga</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Mueble</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editableProducts.map((product, index) => (
              <TableRow 
                key={`${product.Codigo}-${index}`}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <TableCell>{product.Codigo}</TableCell>
                <TableCell>{product.Droga}</TableCell>
                <TableCell>{product.Marca}</TableCell>
                <TableCell>
                  {product.PrecioActualizado ? product.PrecioActualizado : product.PrecioAnterior}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <Autocomplete
                      value={tempFurniture}
                      onChange={(event, newValue) => setTempFurniture(newValue || '')}
                      inputValue={tempFurniture}
                      onInputChange={(event, newInputValue) => setTempFurniture(newInputValue)}
                      options={uniqueFurnitures}
                      freeSolo
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          size="small" 
                          autoFocus
                          placeholder="Ingrese mueble"
                        />
                      )}
                      sx={{ width: 150 }}
                    />
                  ) : (
                    <Chip 
                      label={product.Mueble || 'Sin mueble'} 
                      color={getMuebleChipColor(product.Mueble)}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        color="success" 
                        onClick={() => handleSaveEdit(index)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <CheckIcon fontSize="small" />
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={handleCancelEdit}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </Button>
                    </Stack>
                  ) : (
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />} 
                      onClick={() => handleStartEdit(index)}
                      disabled={editingIndex !== -1}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      Editar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FurnitureEditor;
