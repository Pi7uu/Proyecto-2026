# tools/

Scripts sueltos de mantenimiento y operación del backend
(seeds ad-hoc, verificaciones, migraciones de datos puntuales).

- Cada script debe ser ejecutable standalone con `python tools/<script>.py`
  desde `src/backend/` y documentar su uso en su cabecera.
- Lo que sea lógica de negocio va en `apps/`; lo que sea comando
  reutilizable de Django va como management command dentro del app
  (`apps/products/management/commands/`).
