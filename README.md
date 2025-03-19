# Procesador de Precios con Muebles

Aplicación web para procesar archivos Excel y agregar información de muebles a listas de precios.

## Características

- Carga de archivos Excel mediante drag & drop o selector de archivos
- Procesamiento automático de datos
- Ordenamiento por nombre de mueble
- Exportación en múltiples formatos (XLSX, XLS, ODS)
- Interfaz moderna y responsiva

## Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
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
