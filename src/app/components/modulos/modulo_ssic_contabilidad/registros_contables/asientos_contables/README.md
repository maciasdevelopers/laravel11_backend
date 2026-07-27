# Módulo de Asientos Contables

## Descripción
Este módulo gestiona los asientos contables (pólizas) del sistema, permitiendo el registro, consulta, edición y autorización de pólizas contables.

## Estructura de Carpetas

```
asientos_contables/
├── lista/
│   ├── asientos_contables_lista.component.ts
│   ├── asientos_contables_lista.component.html
│   ├── asientos_contables_lista.component.css
│   └── asientos_contables_lista.component.spec.ts
├── registro/
│   ├── asientos_contables_registro.component.ts
│   ├── asientos_contables_registro.component.html
│   ├── asientos_contables_registro.component.css
│   └── asientos_contables_registro.component.spec.ts
├── consulta/
│   ├── asientos_contables_consulta.component.ts
│   ├── asientos_contables_consulta.component.html
│   ├── asientos_contables_consulta.component.css
│   └── asientos_contables_consulta.component.spec.ts
└── README.md
```

## Componentes

### 1. Lista de Asientos Contables
**Ruta:** `/asientos_contables`

**Funcionalidades:**
- Búsqueda de asientos por fecha y tipo de póliza
- Visualización de lista paginada de asientos
- Acciones: Ver detalle, Editar, Eliminar, Autorizar
- Filtros avanzados

**Archivo:** `lista/asientos_contables_lista.component.ts`

### 2. Registro/Edición de Asientos Contables
**Rutas:** 
- `/asientos_contables_registro` (nuevo)
- `/asientos_contables_registro/:token_asiento` (edición)

**Funcionalidades:**
- Creación de nuevas pólizas contables
- Edición de pólizas en estado BORRADOR
- Captura de movimientos (partidas) de debe y haber
- Validación automática de cuadrado (Débito = Crédito)
- Selección de cuentas contables del catálogo
- Cálculo automático de totales

**Archivo:** `registro/asientos_contables_registro.component.ts`

### 3. Consulta de Asientos Contables
**Ruta:** `/asientos_contables_consulta/:token_asiento`

**Funcionalidades:**
- Visualización detallada del asiento contable
- Consulta de movimientos (partidas)
- Información de totales y diferencias
- Función de impresión (preparada para implementar)

**Archivo:** `consulta/asientos_contables_consulta.component.ts`

## Servicio

### AsientosContablesService
**Ubicación:** `../../../../servicios/ssic/asientos-contables.service.ts`

**Métodos principales:**
- `listaAsientosContables()` - Obtiene lista de asientos con filtros
- `detalleAsientoContable()` - Consulta detalle de un asiento
- `registrarAsientoContable()` - Crea nuevo asiento
- `actualizarAsientoContable()` - Modifica asiento existente
- `eliminarAsientoContable()` - Elimina asiento en borrador
- `autorizarAsientoContable()` - Autoriza asiento para su uso
- `catalogoTiposPoliza()` - Catálogo de tipos de póliza
- `catalogoCuentasParaMovimientos()` - Catálogo de cuentas contables

## Rutas Configuradas

En `contabilidad.routing.ts`:

```typescript
{path:'asientos_contables', component: AsientosContablesListaComponent},
{path:'asientos_contables_registro', component: AsientosContablesRegistroComponent},
{path:'asientos_contables_registro/:token_asiento', component: AsientosContablesRegistroComponent},
{path:'asientos_contables_consulta/:token_asiento', component: AsientosContablesConsultaComponent},
```

## Integración con el Módulo

En `contabilidad.module.ts` se importaron:
- `AsientosContablesListaComponent`
- `AsientosContablesRegistroComponent`
- `AsientosContablesConsultaComponent`

## Tipos de Póliza Soportados

El sistema está preparado para trabajar con diferentes tipos de póliza:
- Diario
- Ingreso
- Egreso
- Nómina
- Depreciación
- Amortización
- Entre otros (definidos en el catálogo)

## Estados de Asientos

- **BORRADOR**: Asiento en edición, puede modificarse
- **AUTORIZADO**: Asiento validado y listo para usar
- **CANCELADO**: Asiento anulado

## Validaciones

1. **Campos obligatorios:**
   - Fecha
   - Tipo de póliza
   - Concepto
   - Al menos 2 movimientos

2. **Validación de cuadrado:**
   - Total Débito debe igualar Total Crédito
   - Diferencia permitida: ±0.01

3. **Validación de montos:**
   - Montos deben ser mayores a 0

## Dependencias PrimeNG Utilizadas

- `p-table` - Tabla de datos
- `p-calendar` - Selector de fecha
- `p-dropdown` - Listas desplegables
- `p-button` - Botones
- `p-tag` - Etiquetas de estado
- `p-autoComplete` - Búsqueda de cuentas contables
- `p-inputTextarea` - Áreas de texto

## Estilos

Cada componente cuenta con su propio archivo CSS:
- `asientos_contables_lista.component.css`
- `asientos_contables_registro.component.css`
- `asientos_contables_consulta.component.css`

Además utilizan estilos globales de:
- `contabilidad.css`
- Estilos compartidos del sistema (buscador, botones, cards, etc.)

## Próximos Pasos

1. **Backend:** Implementar los endpoints del API:
   - `contabilidad_asientos_contables_lista`
   - `contabilidad_asientos_contables_detalle`
   - `contabilidad_asientos_contables_registra`
   - `contabilidad_asientos_contables_actualiza`
   - `contabilidad_asientos_contables_elimina`
   - `contabilidad_asientos_contables_autoriza`
   - `contabilidad_catalogos_tipos_poliza`
   - `contabilidad_catalogos_cuentas_movimientos`

2. **Mejoras futuras:**
   - Exportación a PDF/Excel
   - Filtros avanzados de búsqueda
   - Validación de cuentas contables
   - Asientos automáticos desde otros módulos
   - Historial de cambios
   - Aprobación por niveles

## Notas de Desarrollo

- Los componentes usan `standalone: false` para integrarse con el módulo existente
- Se utiliza SweetAlert2 para confirmaciones y notificaciones
- El servicio usa RxJS para manejo de observables
- Se implementa manejo de errores en todas las peticiones HTTP
- Las rutas usan `useHash: true` para compatibilidad

## Autor
Desarrollado para el sistema SOS-México
Módulo de Contabilidad