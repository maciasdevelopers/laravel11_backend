// src/theme/material-light-preset.ts
import { definePreset } from '@primeuix/themes';
import MaterialLight from '@primeuix/themes/material';

const MyMaterialLight = definePreset(MaterialLight, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          color: '#3b82f6',       // azul clarito
          hoverColor: '#2563eb',
          activeColor: '#1d4ed8',
          inverseColor: '#ffffff'
        },
        accent: {
          color: '#f59e0b',       // naranja suave
          hoverColor: '#d97706',
          activeColor: '#b45309',
          inverseColor: '#ffffff'
        },
        background: {
          color: '#ffffff',       // fondo principal blanco
          secondaryColor: '#f9f9f9'
        },
        surface: {
          color: '#ffffff',       // superficies y tarjetas
          borderColor: '#e5e7eb'  // borde gris clarito
        },
        text: {
          color: '#1f2937',       // gris oscuro (no negro duro)
          secondaryColor: '#6b7280'
        },
        highlight: {
          background: '#e0f2fe',  // selección muy suave
          color: '#1e3a8a'
        },
        focusRing: {
          color: '#90caf9'
        }
      }
    }
  }
});

export default MyMaterialLight;
