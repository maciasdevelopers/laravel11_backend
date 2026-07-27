# Estructura Optimizada del Módulo SSIC - TecInfo

## Análisis de Estructura Actual

### Problemas Identificados:
1. **Componentes sobrecargados:**
   - `soporte.component.ts`: 1,857 líneas (múltiples responsabilidades)
   - `teci-perfiles-usuarios.component.ts`: 3,340 líneas (lógica de permisos mezclada)

2. **Falta de separación de responsabilidades:**
   - Lógica de negocio en componentes en lugar de servicios
   - Validaciones duplicadas
   - Código de permisos repetitivo

3. **Estructura desorganizada:**
   - Mezcla de funcionalidades empresariales, soporte y usuarios
   - Falta de servicios específicos por dominio

## Nueva Estructura por Sectores

```
modulo_ssic_tecinfo/
├── core/                          # Núcleo del módulo
│   ├── tecinfo.module.ts         # Módulo principal (actualizado)
│   ├── tecinfo.routing.ts        # Rutas organizadas por sector
│   └── tec_info.css              # Estilos globales
│
├── sectores/                      # Organizados por dominio
│   │
│   ├── usuarios/                 # Sector: Gestión de Usuarios
│   │   ├── components/
│   │   │   ├── perfiles/         # Perfiles de usuario
│   │   │   └── permisos/         # Gestión de permisos
│   │   ├── services/
│   │   │   ├── teci-usuarios.service.ts
│   │   │   └── teci-permisos.service.ts
│   │   └── models/
│   │       └── usuario.model.ts
│   │
│   ├── empresas/                 # Sector: Gestión Empresarial
│   │   ├── components/
│   │   │   ├── catalogos/        # Catálogo de empresas
│   │   │   └── registro/         # Registro de empresas
│   │   ├── services/
│   │   │   └── teci-empresas.service.ts
│   │   └── models/
│   │       └── empresa.model.ts
│   │
│   ├── soporte/                  # Sector: Soporte
│   │   ├── components/
│   │   │   ├── solicitudes/      # Solicitudes de registro
│   │   │   └── autorizaciones/   # Registros para autorizar
│   │   ├── services/
│   │   │   └── teci-soporte.service.ts
│   │   └── models/
│   │       └── solicitud.model.ts
│   │
│   ├── catalogos/                # Sector: Catálogos
│   │   ├── dispositivos/         # Dispositivos de medición
│   │   ├── plataformas/          # Plataformas digitales
│   │   └── services/
│   │       └── teci-catalogos.service.ts
│   │
│   ├── comunicacion/             # Sector: Comunicación
│   │   ├── components/
│   │   │   ├── lista/
│   │   │   └── registro/
│   │   └── services/
│   │       └── teci-comunicacion.service.ts
│   │
│   └── publicaciones/            # Sector: Publicaciones
│       ├── components/
│       │   ├── lista/
│       │   └── registro/
│       └── services/
│           └── teci-publicaciones.service.ts
│
└── shared/                       # Recursos compartidos
    ├── components/              # Componentes reutilizables
    ├── directives/              # Directivas comunes
    ├── pipes/                   # Pipes personalizados
    ├── utils/                   # Utilidades
    │   ├── validadores.ts
    │   └── helpers.ts
    └── constants/
        └── constantes.ts
```

## Beneficios de la Nueva Estructura

### 1. **Separación por Dominios**
- Cada sector tiene su propia carpeta con servicios, componentes y modelos
- Fácil localización de funcionalidades
- Mantenimiento independiente por sector

### 2. **Servicios Especializados**
- `TeciUsuariosService`: Gestión de usuarios
- `TeciPermisosService`: Gestión de permisos por módulo
- `TeciEmpresasService`: Lógica empresarial
- `TeciSoporteService`: Solicitudes y autorizaciones
- `TeciCatalogosService`: Catálogos generales

### 3. **Componentes Pequeños y Enfocados**
- Componentes < 300 líneas
- Una responsabilidad por componente
- Fácil testing y mantenimiento

### 4. **Código Reutilizable**
- Shared module para componentes comunes
- Utilidades centralizadas
- Constantes compartidas

## Plan de Migración

### Fase 1: Crear nueva estructura
- [x] Crear carpetas por sector
- [ ] Crear servicios base
- [ ] Crear modelos TypeScript

### Fase 2: Refactorizar componentes grandes
- [ ] Extraer lógica de `teci-perfiles-usuarios.component.ts`
- [ ] Extraer lógica de `soporte.component.ts`
- [ ] Crear componentes pequeños

### Fase 3: Actualizar módulo y rutas
- [ ] Actualizar `tecinfo.module.ts`
- [ ] Reorganizar `tecinfo.routing.ts`
- [ ] Actualizar imports

### Fase 4: Limpieza
- [ ] Eliminar código duplicado
- [ ] Eliminar código comentado
- [ ] Actualizar estilos

## Principios Aplicados

1. **Single Responsibility Principle (SRP)**
   - Cada componente/servicio tiene una única responsabilidad

2. **Don't Repeat Yourself (DRY)**
   - Servicios reutilizables
   - Componentes shared

3. **Separation of Concerns (SoC)**
   - Separación clara entre UI, lógica de negocio y datos

4. **Domain-Driven Design (DDD)**
   - Organización por dominios de negocio