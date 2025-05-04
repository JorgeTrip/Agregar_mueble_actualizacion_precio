import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Download as DownloadIcon,
  Search as SearchIcon,
  CloudDownload as CloudDownloadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Importar componentes
import FileDropZone from './PriceUpdater/FileDropZone';
import ProductSearch from './PriceUpdater/ProductSearch';
import FurnitureTable from './PriceUpdater/FurnitureTable';
import FurnitureEditor from './PriceUpdater/FurnitureEditor';
import { processReferenceFile, processUpdateFile, updatePrices } from './PriceUpdater/dataProcessors';

/**
 * @fileoverview Componente para actualizar precios en una planilla de referencia
 * @author J.O.T.
 * @version 1.0.0
 */

/**
 * @description Componente principal para actualizar precios en una planilla de referencia
 * @returns {JSX.Element} Componente de actualización de precios
 */
const PriceUpdater = () => {
  // Estados para los archivos
  const [referenceFile, setReferenceFile] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);
  
  // Estados para los datos procesados
  const [referenceData, setReferenceData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [productsWithoutFurniture, setProductsWithoutFurniture] = useState([]);
  const [availableFurnitures, setAvailableFurnitures] = useState([]);
  
  // Estados para la interfaz
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDraggingReference, setIsDraggingReference] = useState(false);
  const [isDraggingUpdate, setIsDraggingUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Identificar productos sin mueble, con mueble "NO" o con mueble no encontrado
  useEffect(() => {
    if (updatedData) {
      const withoutFurniture = updatedData.filter(item => 
        !item.Mueble || 
        item.Mueble === 'NO' || 
        item.Mueble === 'Sin mueble' ||
        item.Mueble === 'no encontrado' ||
        item.Mueble === 'NO ENCONTRADO' ||
        item.Mueble.toLowerCase().includes('no encontrado') ||
        item.Mueble.toLowerCase().includes('sin asignar') ||
        item.Mueble.toLowerCase().includes('sin mueble')
      );
      setProductsWithoutFurniture(withoutFurniture);
      
      // Extraer muebles únicos para sugerencias
      const furnitures = [...new Set(
        updatedData
          .map(item => item.Mueble)
          .filter(mueble => 
            mueble && 
            mueble !== 'NO' && 
            mueble !== 'Sin mueble' &&
            mueble !== 'no encontrado' &&
            mueble !== 'NO ENCONTRADO' &&
            !mueble.toLowerCase().includes('no encontrado') &&
            !mueble.toLowerCase().includes('sin asignar') &&
            !mueble.toLowerCase().includes('sin mueble')
          )
      )];
      setAvailableFurnitures(furnitures);
    }
  }, [updatedData]);
  
  /**
   * @description Verifica si un mueble es válido para mostrarse en las tablas
   * @param {string} mueble - Nombre del mueble a verificar
   * @returns {boolean} True si el mueble es válido, false en caso contrario
   */
  const isFurnitureValid = (mueble) => {
    if (!mueble) return false;
    
    const invalidPatterns = [
      'NO',
      'Sin mueble',
      'sin mueble',
      'no encontrado',
      'NO ENCONTRADO',
      'sin asignar'
    ];
    
    // Verificar si el mueble coincide exactamente con alguno de los patrones inválidos
    if (invalidPatterns.includes(mueble)) return false;
    
    // Verificar si el mueble contiene alguno de los patrones inválidos
    const lowerMueble = mueble.toLowerCase();
    return !invalidPatterns.some(pattern => lowerMueble.includes(pattern.toLowerCase()));
  };
  
  // Agrupar datos por mueble para mostrar en tablas separadas
  // Excluir productos con muebles inválidos de las tablas por mueble
  const furnitureGroups = updatedData ? 
    Object.entries(
      updatedData
        .filter(item => isFurnitureValid(item.Mueble))
        .reduce((groups, item) => {
          const furniture = item.Mueble;
          if (!groups[furniture]) groups[furniture] = [];
          groups[furniture].push(item);
          return groups;
        }, {})
    ) : [];

  /**
   * @description Maneja la carga del archivo de referencia (A)
   * @param {File} file - Archivo Excel de referencia
   */
  const handleReferenceFileUpload = useCallback((file) => {
    setIsProcessing(true);
    setError(null);
    setInfo("Procesando archivo de referencia...");
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          throw new Error("El archivo de referencia no contiene datos suficientes");
        }
        
        const processedData = processReferenceFile(jsonData);
        setReferenceData(processedData);
        setReferenceFile(file);
        setInfo("Archivo de referencia cargado correctamente. Ahora cargue el archivo de actualización de precios.");
      } catch (err) {
        setError(`Error al procesar el archivo de referencia: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError("Error al leer el archivo de referencia");
      setIsProcessing(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, []);

  /**
   * @description Maneja la carga del archivo de actualización (B)
   * @param {File} file - Archivo Excel con los nuevos precios
   */
  const handleUpdateFileUpload = useCallback((file) => {
    if (!referenceData) {
      setError("Primero debe cargar el archivo de referencia");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setInfo("Procesando archivo de actualización...");
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          throw new Error("El archivo de actualización no contiene datos suficientes");
        }
        
        const processedData = processUpdateFile(jsonData);
        setUpdateData(processedData);
        setUpdateFile(file);
        
        // Actualizar los precios
        const { updatedData: updated, stats } = updatePrices(referenceData, processedData);
        setUpdatedData(updated);
        
        setInfo(`Precios actualizados correctamente. Se actualizaron ${stats.changed} de ${stats.total} productos.`);
        setIsProcessing(false);
      } catch (err) {
        console.error("Error al procesar el archivo de actualización:", err);
        setError(`Error al procesar el archivo de actualización: ${err.message}`);
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError("Error al leer el archivo de actualización");
      setIsProcessing(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, [referenceData]);

  /**
   * @description Busca productos en los datos actualizados
   * @param {string} term - Término de búsqueda
   */
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    
    if (!term.trim() || !updatedData) {
      setSearchResults([]);
      return;
    }
    
    const normalizedTerm = term.toLowerCase().trim();
    const results = updatedData.filter(item => 
      (item.Codigo && item.Codigo.toString().toLowerCase().includes(normalizedTerm)) ||
      (item.Droga && item.Droga.toString().toLowerCase().includes(normalizedTerm)) ||
      (item.Marca && item.Marca.toString().toLowerCase().includes(normalizedTerm))
    );
    
    setSearchResults(results);
  }, [updatedData]);

  /**
   * @description Maneja la actualización de muebles de productos
   * @param {Array} updatedProducts - Productos con muebles actualizados
   */
  const handleFurnitureUpdate = useCallback((updatedProducts) => {
    if (!updatedData) return;
    
    // Crear un mapa para buscar productos por código rápidamente
    const productMap = new Map();
    updatedProducts.forEach(product => {
      productMap.set(product.Codigo, product.Mueble);
    });
    
    // Actualizar los muebles en todos los datos
    const newUpdatedData = updatedData.map(item => {
      if (productMap.has(item.Codigo)) {
        return { ...item, Mueble: productMap.get(item.Codigo) };
      }
      return item;
    });
    
    setUpdatedData(newUpdatedData);
    setInfo("Muebles actualizados correctamente");
  }, [updatedData]);

  /**
   * @description Descarga los datos actualizados como archivo Excel
   * @param {string} format - Formato del archivo (xlsx, xls, csv)
   * @param {boolean} byFurniture - Indica si se debe separar por mueble
   */
  const handleDownload = useCallback((format = 'xlsx', byFurniture = false) => {
    if (!updatedData || updatedData.length === 0) {
      setError("No hay datos para descargar");
      return;
    }
    
    try {
      const fileName = `Precios_Actualizados_${new Date().toISOString().split('T')[0]}`;
      
      if (byFurniture) {
        // Crear un libro con una hoja por mueble
        // Excluir productos con mueble "NO"
        const wb = XLSX.utils.book_new();
        
        furnitureGroups.forEach(([furniture, items]) => {
          const ws = XLSX.utils.json_to_sheet(items);
          const safeFurnitureName = furniture.replace(/[\/\?\*\[\]]/g, '_').substring(0, 30);
          XLSX.utils.book_append_sheet(wb, ws, safeFurnitureName);
        });
        
        const wbout = XLSX.write(wb, { bookType: format, type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}_por_mueble.${format}`);
      } else {
        // Crear un libro con todos los datos en una sola hoja (incluidos los "NO")
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Precios Actualizados");
        
        const wbout = XLSX.write(wb, { bookType: format, type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.${format}`);
      }
      
      setInfo(`Archivo descargado correctamente en formato ${format.toUpperCase()}`);
    } catch (err) {
      setError(`Error al descargar el archivo: ${err.message}`);
    }
  }, [updatedData, furnitureGroups]);

  /**
   * @description Limpia todos los datos y archivos
   */
  const handleClear = useCallback(() => {
    setReferenceFile(null);
    setUpdateFile(null);
    setReferenceData(null);
    setUpdateData(null);
    setUpdatedData(null);
    setError(null);
    setInfo(null);
    setSearchTerm('');
    setSearchResults([]);
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '900px', margin: '0 auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Actualización de Precios
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontStyle: 'italic', letterSpacing: '0.1em', textAlign: 'center', mb: 4 }}>
        Actualice precios en su planilla de referencia
      </Typography>
      
      {/* Zona de carga de archivos */}
      {!updatedData && (
        <Stack spacing={3} sx={{ mb: 4 }}>
          <FileDropZone
            onDrop={handleReferenceFileUpload}
            isDragActive={isDraggingReference}
            setIsDragActive={setIsDraggingReference}
            disabled={!!referenceFile || isProcessing}
            title="Cargar Planilla de Referencia (A)"
            description="Arrastre aquí su planilla completa con muebles y precios"
            icon={<CloudDownloadIcon sx={{ fontSize: 40 }} />}
            file={referenceFile}
          />
          
          <FileDropZone
            onDrop={handleUpdateFileUpload}
            isDragActive={isDraggingUpdate}
            setIsDragActive={setIsDraggingUpdate}
            disabled={!referenceFile || !!updateFile || isProcessing}
            title="Cargar Planilla de Actualización (B)"
            description="Arrastre aquí su planilla con los nuevos precios"
            icon={<UploadIcon sx={{ fontSize: 40 }} />}
            file={updateFile}
          />
        </Stack>
      )}
      
      {/* Mensajes de error e información */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 800, margin: '0 auto' }}>
          {error}
        </Alert>
      )}
      
      {info && (
        <Alert severity="info" sx={{ mb: 2, maxWidth: 800, margin: '0 auto' }}>
          {info}
        </Alert>
      )}
      
      {/* Editor de muebles para productos sin mueble asignado o con mueble "NO" */}
      {updatedData && productsWithoutFurniture.length > 0 && (
        <FurnitureEditor 
          products={productsWithoutFurniture} 
          onSave={handleFurnitureUpdate}
          availableFurnitures={availableFurnitures}
        />
      )}

      {/* Búsqueda de productos y resultados */}
      {updatedData && (
        <Box sx={{ mb: 4 }}>
          <ProductSearch 
            onSearch={handleSearch} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            placeholder="Buscar por código, droga o marca..."
          />
          
          {searchResults.length > 0 && (
            <Paper sx={{ mt: 2, p: 2, maxHeight: 300, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Resultados de búsqueda
              </Typography>
              <FurnitureTable 
                title="Resultados" 
                data={searchResults} 
                highlightTerm={searchTerm}
              />
            </Paper>
          )}
        </Box>
      )}
      
      {/* Tablas por mueble */}
      {updatedData && !searchTerm && (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Productos por mueble ({updatedData.filter(item => isFurnitureValid(item.Mueble)).length} productos en {furnitureGroups.length} muebles)
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Se muestran solo los productos con mueble válido. Los productos sin mueble o con muebles como "NO", "no encontrado", etc. se pueden editar en la sección superior.
          </Typography>
          
          {furnitureGroups.map(([furniture, items]) => (
            <FurnitureTable 
              key={furniture}
              title={furniture}
              data={items}
            />
          ))}
        </Box>
      )}

      {/* Botones de descarga */}
      {updatedData && (
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4, justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload('xlsx')}
          >
            Descargar Planilla Completa
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload('xlsx', true)}
          >
            Descargar Separado por Mueble
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            onClick={handleClear}
          >
            Volver a empezar
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default PriceUpdater;
