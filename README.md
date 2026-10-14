# 🛠️ Ferretería FERROMAX PRO - Catálogo de Materiales & Web API

Sistema web y API REST en **.NET 9 (ASP.NET Core)** para la gestión y visualización de catálogo de ferretería (cementos, palas, herramientas, pinturas y materiales de construcción).

---

## 🚀 Características Principales

1. **Catálogo Web Dinámico**:
   - Tarjetas de productos con imagen, categoría, precio, unidad de medida, stock y descripción.
   - Buscador en tiempo real por nombre, descripción o categoría (ej. *cemento*, *pala*, *pintura*).
   - Filtros por categorías (Construcción, Herramientas, Pintura, Herramientas Eléctricas, etc.).
   - Métricas KPI en vivo: Total de Materiales, Categorías activas, Valor monetario del inventario y Alerta de Stock Crítico.
   - Ordenamiento por: Más recientes, Menor precio, Mayor precio, Nombre (A-Z).
   - Modal interactivo con presets rápidos para registrar nuevos materiales al catálogo.
   - Modal de detalle para visualizar especificaciones técnicas completas y eliminar productos.

2. **Backend & API ASP.NET Core**:
   - Controladores RESTful (`ProductosController.cs`).
   - Base de datos **SQLite** (`ferreteria.db`) con **Entity Framework Core**.
   - Auto-migración y sembrado automático de datos iniciales (*Cemento Portland, Palas de corazón y cuadradas, Martillos, Arena gruesa, Pintura látex, Varillas de acero, etc.*).
   - Documentación interactiva de la API con **Swagger / OpenAPI** en `/swagger`.

---

## 📁 Estructura del Proyecto

```text
├── Controllers/
│   └── ProductosController.cs      # Endpoints REST (GET, POST, PUT, DELETE, Resumen, Categorías)
├── Models/
│   └── Producto.cs                 # Modelo de datos con validaciones (Data Annotations)
├── Data/
│   ├── AppDbContext.cs             # Contexto de base de datos EF Core (SQLite)
│   └── DbInitializer.cs            # Datos semilla iniciales (cemento, palas, etc.)
├── wwwroot/
│   ├── css/
│   │   └── styles.css              # Estilos modernos con modo oscuro industrial y glassmorphism
│   ├── js/
│   │   └── app.js                  # Lógica del cliente SPA y consumo de la API REST
│   └── index.html                  # Interfaz de usuario principal
├── appsettings.json                # Cadena de conexión SQLite
├── Program.cs                      # Configuración de pipeline, middleware y Swagger
└── FerreteriaCatalogo.csproj       # Configuración del proyecto .NET 9
```

---

## 🔌 Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/productos` | Obtiene la lista de materiales (acepta parámetros opcionales `?q=...&categoria=...&ordenar=...`) |
| **GET** | `/api/productos/{id}` | Obtiene los detalles de un producto por su ID |
| **GET** | `/api/productos/categorias` | Lista las categorías únicas registradas |
| **GET** | `/api/productos/resumen` | Estadísticas (total productos, total categorías, valor monetario inventario, stock crítico) |
| **POST** | `/api/productos` | Agrega un nuevo material al catálogo |
| **PUT** | `/api/productos/{id}` | Actualiza un material existente |
| **DELETE** | `/api/productos/{id}` | Elimina un material del catálogo |

---

## 💻 Cómo Ejecutar el Proyecto

### Requisitos:
- [.NET 9.0 SDK](https://dotnet.microsoft.com/) instalado en el sistema.

### Pasos:
1. Abrir la terminal en la carpeta del proyecto:
   ```bash
   cd "d:\tarea_6toS\Proyecto de sistemas 2\prueba XP ferreteria y catalogo"
   ```

2. Ejecutar la aplicación:
   ```bash
   dotnet run --launch-profile http
   ```

3. Abrir en tu navegador web:
   - **Catálogo Web**: [http://localhost:5079](http://localhost:5079)
   - **Documentación Swagger / API**: [http://localhost:5079/swagger](http://localhost:5079/swagger)
