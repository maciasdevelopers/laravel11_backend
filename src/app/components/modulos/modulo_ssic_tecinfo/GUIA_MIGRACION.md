# Guía de Migración - Módulo TecInfo

## Resumen de Cambios

El módulo `modulo_ssic_tecinfo` ha sido reestructurado siguiendo principios de **Domain-Driven Design (DDD)** y **Separación de Responsabilidades**.

## Estructura Implementada

```
modulo_ssic_tecinfo/
├── core/                          # Núcleo del módulo (sin cambios)
│   ├── tecinfo.module.ts
│   ├── tecinfo.routing.ts
│   └── tec_info.css
│
├── sectores/                      # NUEVA ESTRUCTURA POR DOMINIOS
│   ├── shared/                    # Recursos compartidos
│   │   └── services/
│   │       └── teci-config.service.ts    # Configuración centralizada
│   │
│   ├── usuarios/                  # Sector: Gestión de Usuarios
│   │   └── services/
│   │       └── teci-usuarios.service.ts  # Servicio de usuarios y permisos
│   │
│   ├── empresas/                  # Sector: Gestión Empresarial
│   │   └── services/
│   │       └── teci-empresas.service.ts  # Servicio de empresas
│   │
│   └── soporte/                   # Sector: Soporte
│       └── services/
│           └── teci-soporte.service.ts   # Servicio de soporte y catálogos
│
├── README_ESTRUCTURA.md           # Documentación de arquitectura
└── GUIA_MIGRACION.md             # Este archivo
```

## Servicios Creados

### 1. TeciConfigService (Shared)
**Ubicación:** `sectores/shared/services/teci-config.service.ts`

**Propósito:** Configuración centralizada del módulo
- Construcción de URLs
- Manejo de headers
- Obtención de token de usuario
- Construcción de bodies para POST

**Uso:**
```typescript
constructor(
  private http: HttpClient,
  private config: TeciConfigService
) {
  // Usar config.buildUrl() para construir URLs
  // Usar config.buildPostBody() para construir bodies
}
```

### 2. TeciUsuariosService
**Ubicación:** `sectores/usuarios/services/teci-usuarios.service.ts`

**Propósito:** Gestión de usuarios y permisos
- Catálogo de usuarios
- Permisos por módulo (SSIC, Ingresos, Logística, etc.)
- Permisos de TecInfo
- Generación/revocación de credenciales

**Métodos principales:**
- `getCatalogoUsuarios()`
- `updateAccesoSsic()`
- `updateTecInfoPermAcceso()`
- `generarCredenciales()`

### 3. TeciEmpresasService
**Ubicación:** `sectores/empresas/services/teci-empresas.service.ts`

**Propósito:** Gestión empresarial
- Catálogo de empresas
- Registro de empresas
- Validación de RFC
- Vinculación empresa-usuario

**Métodos principales:**
- `listaEmpresasAll()`
- `empresaRegistrar()`
- `verificaExistsAllEmpresas()`
- `validarRfcNacional()`

### 4. TeciSoporteService
**Ubicación:** `sectores/soporte/services/teci-soporte.service.ts`

**Propósito:** Soporte y catálogos auxiliares
- Solicitudes de registro
- Catálogo de áreas
- Catálogo de países
- Regímenes fiscales
- Validaciones de formularios

**Métodos principales:**
- `getSolicitudesRegistroVigentes()`
- `getCatalogoAreasEmpresa()`
- `getRegimenFiscalAll()`
- `validarRfcNacional()`

## Cómo Migrar Componentes Existentes

### Paso 1: Actualizar imports en el componente

**ANTES:**
```typescript
import { EmpresasServService } from '../../../../../servicios/ssic/empresas-serv.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
```

**DESPUÉS:**
```typescript
import { TeciEmpresasService } from './sectores/empresas/services/teci-empresas.service';
import { TeciSoporteService } from './sectores/soporte/services/teci-soporte.service';
```

### Paso 2: Actualizar el constructor

**ANTES:**
```typescript
constructor(
  public emp_serv: EmpresasServService,
  private users: UsuariosService,
  private translate: TranslateService,
) { }
```

**DESPUÉS:**
```typescript
constructor(
  private empresasService: TeciEmpresasService,
  private usuariosService: TeciUsuariosService,
  private soporteService: TeciSoporteService,
  private translate: TranslateService,
) { }
```

### Paso 3: Actualizar llamadas al servicio

**ANTES:**
```typescript
this.emp_serv.listaEmpresasAll().subscribe(...)
```

**DESPUÉS:**
```typescript
this.empresasService.listaEmpresasAll().subscribe(...)
```

## Ejemplo de Componente Refactorizado

### ANTES (soporte.component.ts - 1857 líneas)
```typescript
@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: [...]
})
export class SoporteComponent implements OnInit {
  // 50+ variables de estado
  // 1857 líneas de código
  // Múltiples responsabilidades mezcladas
}
```

### DESPUÉS (Enfoque por sectores)
```typescript
// Componente principal (más pequeño)
@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent implements OnInit {
  // Solo variables de estado de UI
  solicitudes: any[] = [];
  empresas: any[] = [];
  
  constructor(
    private soporteService: TeciSoporteService,
    private empresasService: TeciEmpresasService
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarEmpresas();
  }

  cargarSolicitudes() {
    this.soporteService.getSolicitudesRegistroVigentes()
      .subscribe(response => {
        if (response.status === 'success') {
          this.solicitudes = response.arrayEmpVig;
        }
      });
  }
}

// Componentes hijos especializados
@Component({
  selector: 'app-soporte-registro',
  templateUrl: './registro-empresa.component.html'
})
export class RegistroEmpresaComponent {
  // Solo lógica de registro
}

@Component({
  selector: 'app-soporte-usuarios',
  templateUrl: './registro-usuario.component.html'
})
export class RegistroUsuarioComponent {
  // Solo lógica de usuarios
}
```

## Beneficios de la Nueva Estructura

### 1. **Mantenibilidad**
- Componentes más pequeños (< 300 líneas)
- Responsabilidades claras
- Código más legible

### 2. **Testabilidad**
- Servicios fáciles de testear
- Componentes con una sola responsabilidad
- Mocks más simples

### 3. **Reutilización**
- Servicios compartidos entre componentes
- Lógica de validación centralizada
- Configuración única

### 4. **Escalabilidad**
- Fácil agregar nuevos sectores
- Estructura predecible
- Convenciones claras

## Próximos Pasos

### Fase 1: Completar servicios (EN PROGRESO)
- [x] TeciConfigService
- [x] TeciUsuariosService
- [x] TeciEmpresasService
- [x] TeciSoporteService
- [ ] TeciCatalogosService
- [ ] TeciComunicacionService
- [ ] TeciPublicacionesService

### Fase 2: Refactorizar componentes grandes
- [ ] `teci-perfiles-usuarios.component.ts` (3,340 líneas)
  - Extraer `PermisosTecInfoComponent`
  - Extraer `PermisosIngresosComponent`
  - Extraer `AccesosModulosComponent`
  
- [ ] `soporte.component.ts` (1,857 líneas)
  - Extraer `RegistroEmpresaComponent`
  - Extraer `RegistroUsuarioComponent`
  - Extraer `SolicitudesRegistroComponent`

### Fase 3: Actualizar módulo
- [ ] Actualizar `tecinfo.module.ts` con nuevos servicios
- [ ] Actualizar `tecinfo.routing.ts` con nuevas rutas
- [ ] Eliminar código comentado

### Fase 4: Limpieza
- [ ] Eliminar servicios antiguos
- [ ] Eliminar código duplicado
- [ ] Actualizar estilos

## Notas Importantes

1. **Rutas de importación:** Usar rutas relativas desde `sectores/`
2. **Configuración:** Todos los servicios usan `TeciConfigService` para URLs
3. **Tokens:** El token de usuario se obtiene de `sessionStorage.getItem('inside_session_code')`
4. **Errores:** Todos los servicios tienen manejo de errores centralizado

## Contacto

Para dudas sobre la migración, consultar:
- `README_ESTRUCTURA.md` - Arquitectura general
- Este archivo - Guía práctica de migración