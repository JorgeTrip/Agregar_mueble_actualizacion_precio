# Procesador de Precios con Muebles

Aplicación web multifuncional para gestión farmacéutica que incluye:

1. Procesamiento de listas de precios con muebles
2. Asistente de arqueo de caja
3. Checklist de cierre diario

## Características Principales

### 🪑 Procesador de Precios
- Carga de archivos Excel mediante drag & drop
- Asignación automática de muebles mediante archivo de referencia
- Validación de formatos (XLSX, XLS, ODS)
- Ordenamiento por nombre de mueble
- Exportación de resultados en múltiples formatos
- Interfaz intuitiva con feedback visual

### 💰 Asistente de Arqueo de Caja
- Registro de montos individuales con entrada rápida
- Cálculo automático de total físico
- Gestión de fondo de caja
- Comparación con total del sistema
- Detección de discrepancias con resaltado de colores
- Formateo automático de montos en pesos argentinos

### 📋 Checklist de Cierre
- Lista predefinida de conceptos comunes
- Adición de conceptos personalizados
- Cálculo de total general automático
- Generación de reportes en texto plano
- Guardado automático con fecha en nombre de archivo

## Instalación

Requisitos:
- Node.js v18+
- npm v9+

```bash
# Clonar repositorio
git clone https://github.com/JorgeTrip/Agregar_mueble_actualizacion_precio.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Netlify.

1. Conecta tu repositorio de GitHub con Netlify
2. Netlify detectará automáticamente que es un proyecto Vite
3. La configuración de build ya está definida en `netlify.toml`

## Tecnologías

- React
- Material UI
- XLSX
- Vite
