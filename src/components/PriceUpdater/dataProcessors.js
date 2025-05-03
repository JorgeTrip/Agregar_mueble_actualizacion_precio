/**
 * @fileoverview Funciones para procesar datos de archivos Excel para la actualización de precios
 * @author J.O.T.
 * @version 1.0.0
 */

/**
 * @description Normaliza un código de producto para facilitar la comparación
 * @param {string|number} code - Código a normalizar
 * @returns {string} Código normalizado
 */
export const normalizeCode = (code) => {
  if (code === undefined || code === null) return '';
  
  // Convertir a string y eliminar espacios
  let normalizedCode = String(code).trim();
  
  // Eliminar ceros a la izquierda
  normalizedCode = normalizedCode.replace(/^0+/, '');
  
  return normalizedCode;
};

/**
 * @description Normaliza un encabezado de columna para facilitar la identificación
 * @param {string} header - Encabezado a normalizar
 * @returns {string} Encabezado normalizado
 */
export const normalizeHeader = (header) => {
  if (!header) return '';
  
  return String(header)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]/g, ''); // Eliminar caracteres especiales
};

/**
 * @description Identifica la columna de código de producto
 * @param {Object} headerRow - Fila de encabezados
 * @returns {number} Índice de la columna de código o -1 si no se encuentra
 */
export const identifyCodeColumn = (headerRow) => {
  const codePatterns = [
    'codigo', 'code', 'cod', 'id', 'articulo', 'producto', 'item'
  ];
  
  // Buscar primero la columna exacta 'COD'
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === 'COD') {
      return i;
    }
  }
  
  // Si no se encuentra, buscar por patrones
  for (let i = 0; i < headerRow.length; i++) {
    const normalizedHeader = normalizeHeader(headerRow[i]);
    
    if (codePatterns.some(pattern => normalizedHeader.includes(pattern))) {
      return i;
    }
  }
  
  // Si no se encuentra y hay al menos 2 columnas, asumir que la segunda columna (B) es el código
  if (headerRow.length >= 2) {
    return 1; // Índice 1 corresponde a la columna B
  }
  
  return -1;
};

/**
 * @description Identifica la columna de descripción del producto (DROGA)
 * @param {Object} headerRow - Fila de encabezados
 * @returns {number} Índice de la columna de descripción o -1 si no se encuentra
 */
export const identifyDescriptionColumn = (headerRow) => {
  const descPatterns = [
    'descripcion', 'description', 'desc', 'nombre', 'name', 'producto', 'articulo', 'droga'
  ];
  
  // Buscar primero la columna exacta 'DROGA'
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === 'DROGA') {
      return i;
    }
  }
  
  // Si no se encuentra, buscar por patrones
  for (let i = 0; i < headerRow.length; i++) {
    const normalizedHeader = normalizeHeader(headerRow[i]);
    
    if (descPatterns.some(pattern => normalizedHeader.includes(pattern))) {
      return i;
    }
  }
  
  // Si no se encuentra y hay al menos 3 columnas, asumir que la tercera columna (C) es la descripción
  if (headerRow.length >= 3) {
    return 2; // Índice 2 corresponde a la columna C
  }
  
  return -1;
};

/**
 * @description Identifica la columna de precio (PVP)
 * @param {Object} headerRow - Fila de encabezados
 * @returns {number} Índice de la columna de precio o -1 si no se encuentra
 */
export const identifyPriceColumn = (headerRow) => {
  const pricePatterns = [
    'precio', 'price', 'valor', 'value', 'importe', 'amount', 'costo', 'cost', 'pvp'
  ];
  
  // Buscar primero la columna exacta 'PVP'
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === 'PVP') {
      return i;
    }
  }
  
  // Si no se encuentra, buscar por patrones
  for (let i = 0; i < headerRow.length; i++) {
    const normalizedHeader = normalizeHeader(headerRow[i]);
    
    if (pricePatterns.some(pattern => normalizedHeader.includes(pattern))) {
      return i;
    }
  }
  
  // Si no se encuentra y hay al menos 5 columnas, asumir que la quinta columna (E) es el precio
  if (headerRow.length >= 5) {
    return 4; // Índice 4 corresponde a la columna E
  }
  
  return -1;
};

/**
 * @description Identifica la columna de mueble
 * @param {Object} headerRow - Fila de encabezados
 * @returns {number} Índice de la columna de mueble o -1 si no se encuentra
 */
export const identifyFurnitureColumn = (headerRow) => {
  const furniturePatterns = [
    'mueble', 'furniture', 'ubicacion', 'location', 'estante', 'shelf'
  ];
  
  // Buscar primero la columna exacta 'Mueble'
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === 'Mueble') {
      return i;
    }
  }
  
  // Si no se encuentra, buscar por patrones
  for (let i = 0; i < headerRow.length; i++) {
    const normalizedHeader = normalizeHeader(headerRow[i]);
    
    if (furniturePatterns.some(pattern => normalizedHeader.includes(pattern))) {
      return i;
    }
  }
  
  // Si no se encuentra y hay al menos 1 columna, asumir que la primera columna (A) es el mueble
  if (headerRow.length >= 1) {
    return 0; // Índice 0 corresponde a la columna A
  }
  
  return -1;
};

/**
 * @description Identifica la columna de marca
 * @param {Object} headerRow - Fila de encabezados
 * @returns {number} Índice de la columna de marca o -1 si no se encuentra
 */
export const identifyBrandColumn = (headerRow) => {
  const brandPatterns = [
    'marca', 'brand', 'fabricante', 'manufacturer', 'lab', 'laboratorio'
  ];
  
  // Buscar primero la columna exacta 'MARCA'
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === 'MARCA') {
      return i;
    }
  }
  
  // Si no se encuentra, buscar por patrones
  for (let i = 0; i < headerRow.length; i++) {
    const normalizedHeader = normalizeHeader(headerRow[i]);
    
    if (brandPatterns.some(pattern => normalizedHeader.includes(pattern))) {
      return i;
    }
  }
  
  // Si no se encuentra y hay al menos 4 columnas, asumir que la cuarta columna (D) es la marca
  if (headerRow.length >= 4) {
    return 3; // Índice 3 corresponde a la columna D
  }
  
  return -1;
};

/**
 * @description Procesa el archivo de referencia (A)
 * @param {Array} jsonData - Datos del archivo en formato JSON
 * @returns {Array} Datos procesados
 */
export const processReferenceFile = (jsonData) => {
  if (!jsonData || jsonData.length < 2) {
    throw new Error("El archivo no contiene datos suficientes");
  }
  
  const headerRow = jsonData[0];
  
  // Identificar columnas importantes según la estructura de la imagen
  const codeColumnIndex = identifyCodeColumn(headerRow); // Columna B: COD
  const descColumnIndex = identifyDescriptionColumn(headerRow); // Columna C: DROGA
  const priceColumnIndex = identifyPriceColumn(headerRow); // Columna E: PVP
  const furnitureColumnIndex = identifyFurnitureColumn(headerRow); // Columna A: Mueble
  const brandColumnIndex = identifyBrandColumn(headerRow); // Columna D: MARCA
  
  if (codeColumnIndex === -1) {
    throw new Error("No se pudo identificar la columna de código de producto (COD)");
  }
  
  if (priceColumnIndex === -1) {
    throw new Error("No se pudo identificar la columna de precio (PVP)");
  }
  
  // Procesar los datos
  const processedData = [];
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    // Verificar que la fila tenga datos
    if (!row || row.length === 0 || !row[codeColumnIndex]) {
      continue;
    }
    
    const code = normalizeCode(row[codeColumnIndex]);
    const description = descColumnIndex !== -1 ? row[descColumnIndex] : '';
    const price = priceColumnIndex !== -1 ? parseFloat(row[priceColumnIndex]) || 0 : 0;
    const furniture = furnitureColumnIndex !== -1 ? row[furnitureColumnIndex] : 'Sin mueble';
    const brand = brandColumnIndex !== -1 ? row[brandColumnIndex] : '';
    
    // Crear objeto con los datos procesados según la estructura de la imagen
    const processedRow = {
      Codigo: code,
      Droga: description,
      PrecioAnterior: price,
      Mueble: furniture,
      Marca: brand
    };
    
    processedData.push(processedRow);
  }
  
  return processedData;
};

/**
 * @description Procesa el archivo de actualización (B)
 * @param {Array} jsonData - Datos del archivo en formato JSON
 * @returns {Array} Datos procesados
 */
export const processUpdateFile = (jsonData) => {
  if (!jsonData || jsonData.length < 2) {
    throw new Error("El archivo no contiene datos suficientes");
  }
  
  const headerRow = jsonData[0];
  
  // Identificar columnas importantes
  const codeColumnIndex = identifyCodeColumn(headerRow);
  const priceColumnIndex = identifyPriceColumn(headerRow);
  
  if (codeColumnIndex === -1) {
    throw new Error("No se pudo identificar la columna de código de producto");
  }
  
  if (priceColumnIndex === -1) {
    throw new Error("No se pudo identificar la columna de precio");
  }
  
  // Procesar los datos
  const processedData = [];
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    // Verificar que la fila tenga datos
    if (!row || row.length === 0 || !row[codeColumnIndex]) {
      continue;
    }
    
    const code = normalizeCode(row[codeColumnIndex]);
    const newPrice = priceColumnIndex !== -1 ? parseFloat(row[priceColumnIndex]) || 0 : 0;
    
    // Crear objeto con los datos procesados
    processedData.push({
      Codigo: code,
      PrecioNuevo: newPrice
    });
  }
  
  return processedData;
};

/**
 * @description Actualiza los precios en los datos de referencia con los nuevos precios
 * @param {Array} referenceData - Datos de referencia (A)
 * @param {Array} updateData - Datos de actualización (B)
 * @returns {Array} Datos actualizados
 */
export const updatePrices = (referenceData, updateData) => {
  if (!referenceData || !updateData) {
    throw new Error("No hay datos para actualizar");
  }
  
  // Crear un mapa de códigos a nuevos precios para búsqueda rápida
  const priceMap = new Map();
  
  updateData.forEach(item => {
    if (item.Codigo && item.PrecioNuevo) {
      priceMap.set(normalizeCode(item.Codigo), item.PrecioNuevo);
    }
  });
  
  // Actualizar los precios en los datos de referencia
  const updatedData = referenceData.map(item => {
    const normalizedCode = normalizeCode(item.Codigo);
    const newPrice = priceMap.get(normalizedCode);
    
    // Si hay un nuevo precio, actualizar el item
    if (newPrice !== undefined) {
      return {
        ...item,
        PrecioActualizado: newPrice,
        PrecioAnterior: item.PrecioAnterior || 0,
        Diferencia: newPrice - (item.PrecioAnterior || 0),
        PorcentajeCambio: item.PrecioAnterior 
          ? ((newPrice - item.PrecioAnterior) / item.PrecioAnterior * 100).toFixed(2) + '%'
          : 'N/A'
      };
    }
    
    // Si no hay nuevo precio, mantener el anterior
    return {
      ...item,
      PrecioActualizado: item.PrecioAnterior,
      Diferencia: 0,
      PorcentajeCambio: '0%'
    };
  });
  
  return updatedData;
};
