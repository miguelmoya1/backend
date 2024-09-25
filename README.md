# Arquitectura del Proyecto: Clean Architecture

Este proyecto sigue los principios de Clean Architecture para lograr una estructura de código modular, mantenible y escalable. La arquitectura se divide en las siguientes capas:

## 1. `core` o `domain`

- **Propósito:** Contiene las reglas de negocio y las entidades fundamentales de la aplicación. Es independiente de cualquier detalle de implementación, como bases de datos o frameworks de interfaz de usuario.
- **Contenido:**
  - **Entidades:** Representan los conceptos clave del dominio del problema.
  - **Casos de uso:** Encapsulan la lógica de negocio y orquestan las interacciones entre las entidades y otros componentes del sistema.
  - **Interfaces:** Definen los contratos que deben cumplir las implementaciones en otras capas (por ejemplo, repositorios o servicios externos).

## 2. `infrastructure`

- **Propósito:** Implementa la interacción con el mundo exterior, como bases de datos, APIs, sistemas de archivos, etc.
- **Contenido:**
  - **Repositorios:** Implementan las interfaces definidas en la capa `core` para acceder y persistir datos.
  - **Servicios externos:** Encapsulan la comunicación con APIs o servicios de terceros.
  - **Adaptadores:** Convierten los datos entre el formato utilizado en la capa `core` y el formato requerido por la infraestructura externa.

## 3. `di`

- **Propósito:** Centraliza la configuración de la inyección de dependencias (DI) para facilitar la gestión de las dependencias entre las diferentes capas.
- **Contenido:**
  - **Módulos de DI:** Definen cómo se crean y proporcionan las instancias de los servicios y repositorios.
  - **Contenedores de DI:** Gestionan la creación y el ciclo de vida de las instancias de los servicios.

## 4. `presentation`

- **Propósito:** Se encarga de la interfaz de usuario y la interacción con el usuario.
- **Contenido:**
  - **Componentes:** Implementan la lógica de presentación y la visualización de datos.
  - **Controladores:** Manejan las solicitudes del usuario y coordinan la interacción con los casos de uso en la capa `core`.
  - **Vistas:** Definen la estructura y el diseño de la interfaz de usuario.

### Principios clave

- **Independencia del framework:** La capa `core` no depende de ningún framework específico, lo que facilita la adaptación a cambios tecnológicos o la migración a otras plataformas.
- **Inversión de dependencias:** Las capas de alto nivel (como `presentation`) dependen de abstracciones definidas en la capa `core`, lo que permite cambiar las implementaciones en las capas inferiores sin afectar la lógica de negocio.
- **Testeabilidad:** Cada capa se puede probar de forma aislada, lo que facilita la creación de pruebas unitarias y de integración.

### Cómo usar esta arquitectura

1. **Define tus entidades y reglas de negocio en la capa `core`.**
2. **Crea interfaces en `core` para los servicios que necesitarás en otras capas.**
3. **Implementa esas interfaces en la capa `infrastructure`.**
4. **Configura la inyección de dependencias en la capa `di`.**
5. **Crea tus componentes de interfaz de usuario y controladores en la capa `presentation`.**

**¡Importante!** Esta documentación es una guía general. Adapta la estructura y los nombres de las carpetas según las necesidades específicas de tu proyecto. ¡No dudes en experimentar y encontrar lo que mejor funcione para ti!

**¡Manos a la obra y a construir un proyecto limpio y mantenible!**

**Esquema en forma de árbol**

```
Proyecto
├── core/domain
│   ├── entities (opcional)
│   ├── reglas de negocio
│   ├── casos de uso
│   └── interfaces
├── infrastructure
│   ├── repositorios
│   ├── servicios externos
│   └── adaptadores
├── di
│   ├── módulos de DI
│   └── contenedores de DI
└── presentation
    ├── componentes
    ├── controladores
    └── vistas
```
