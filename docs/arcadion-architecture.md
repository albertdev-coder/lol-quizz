# Arcadion – Dirección técnica Fase 1

## Estructura propuesta (modular por dominio)

```txt
src/
  core/
    constants/
    types/
  domains/
    elo/
    xp/
    economy/
    streak/
    achievements/
    ranking/
  features/
    quiz/
    profile/
    leaderboard/
  db/
    schema/
  lib/
    competitive/
  ui/
```

## Decisiones clave

- **Lógica pura en `domains/*`**: cálculo ELO, ligas, streak y economía sin dependencias de React o DB.
- **Composición de caso de uso en `lib/competitive`**: `applyMatchResult` centraliza reglas del resultado competitivo.
- **Infraestructura aislada en `db/schema`**: schema Drizzle listo para migración sin acoplarse al quiz actual.
- **`features/*` como capa de presentación**: mapeos para perfil y leaderboards.

## Escalabilidad sin sobrecarga

- No se introduce websocket, tiempo real ni microservicios.
- Cálculo competitivo server-side (determinístico y barato).
- Tablas indexadas para ranking y lecturas por temporada.
- Compatible con extraer backend dedicado en una fase posterior porque los dominios son agnósticos.

## Notas de operación

- Iniciar con cron de leaderboard semanal/global fuera del request path.
- Mantener snapshot `user_stats` como fuente rápida de lectura para perfil y ranking.
- Guardar `matches` como event log para auditoría/rebuild del ranking.
