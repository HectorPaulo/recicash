# 🌱 RECICASH - Plataforma de Reciclaje Inteligente

## 📋 Descripción

RECICASH es una plataforma innovadora que transforma los hábitos de reciclaje en recompensas tangibles. Nuestra aplicación conecta a usuarios, empresas y administradores en un ecosistema sostenible donde el reciclaje genera beneficios para todos.

## ✨ Características Principales

- **🔄 Sistema de Puntos**: Los usuarios acumulan puntos por sus actividades de reciclaje
- **🎫 Cupones y Recompensas**: Canjea puntos por descuentos y beneficios en empresas asociadas
- **📊 Seguimiento Detallado**: Visualiza estadísticas y monitorea tu impacto ambiental
- **👥 Múltiples Roles**: Funcionalidades específicas para clientes, empresas y administradores
- **🔒 Autenticación Segura**: Sistema de registro y acceso protegido con Firebase
- **💫 Interfaz Atractiva**: Diseño moderno con animaciones y efectos visuales

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19.0.0, React Router DOM 7.5.0
- **Estilos**: Tailwind CSS 4.1.3
- **Animaciones**: GSAP 3.12.7, Three.js 0.167.1, OGL 1.0.11
- **Gráficos**: Chart.js 4.4.9, React-Chartjs-2 5.3.0
- **Backend**: Firebase 11.6.0 (Autenticación, Base de datos, Hosting)
- **Herramientas de Desarrollo**: Vite 6.2.0, ESLint 9.21.0
- **Interfaz de Usuario**: SweetAlert2 11.22.0, Lucide React 0.511.0

## 🚀 Instalación y Uso

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/recicash.git
   cd recicash
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crea un archivo `.env.local` basado en `.env.example` con tus credenciales de Firebase

4. **Iniciar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 🌐 Estructura del Proyecto

- **/src**: Código fuente de la aplicación
  - **/assets**: Imágenes y recursos estáticos
  - **/Backgrounds**: Componentes para fondos animados
  - **/Components**: Componentes reutilizables
  - **/contexts**: Contextos de React (Auth, Puntos)
  - **/layouts**: Estructuras de layout (Protected)
  - **/lib**: Funciones y utilidades
  - **/pages**: Páginas principales organizadas por función

## 👥 Roles de Usuario

- **Cliente**: Acumula puntos, canjea cupones y monitorea su actividad de reciclaje
- **Empresa**: Gestiona cupones y promociones, y verifica transacciones de puntos
- **Administrador**: Administra usuarios, empresas y supervisa toda la plataforma

Construido con pasión por la sostenibilidad y el medio ambiente 🌎
