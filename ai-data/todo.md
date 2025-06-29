Quiero que generes la estructura completa de una app móvil estilo PartyFun en React Native con Expo y SQLite. La app debe tener las siguientes pantallas y funcionalidades:

### Tecnologías
- React Native con Expo
- SQLite para almacenamiento local
- Navegación con Expo routing
- UI adaptativa y responsiva

### Pantallas
1. **Pantalla Principal**:
   - Botón grande "JUGAR"
   - Botón "CREAR GRUPO DE PALABRAS"
   - Lista de baterías ya creadas (con opción de editar o eliminar)

2. **Pantalla Crear Batería**:
   - Campo para nombre de la batería
   - Input para añadir palabras una a una
   - Lista editable de palabras añadidas
   - Validar mínimo 1 palabra, sugerencia de 30
   - Botón "GUARDAR BATERÍA"

3. **Pantalla Nueva Partida**:
   - Selección de batería (dropdown o lista)
   - Gestión de equipos (equipo azul y rojo)
   - Añadir jugadores con nombre
   - Opción de mover jugador de un equipo a otro
   - Botón "EMPEZAR PARTIDA"

4. **Pantalla Turno de Juego**:
   - Mostrar palabra actual grande en el centro
   - Botones:
     - ✔ Acertada (verde a la derecha)
     - ✖ Fallada (rojo a la izquierda)
   - Timer de 30 segundos (cuenta regresiva con barra y número)
   - Cambio de turno automático cuando se acabe el tiempo

5. **Pantalla Resultado de Ronda**:
   - Lista de palabras acertadas y falladas por equipo
   - Botón "SIGUIENTE RONDA"

6. **Pantalla Fin del Juego**:
   - Tabla de puntuaciones por ronda y totales
   - Ganador destacado
   - Botón "FINALIZAR" para volver al inicio

### Lógica del Juego
- El juego tiene 3 rondas:
  - Ronda 1: pista libre (menos sinónimos)
  - Ronda 2: una sola palabra como pista
  - Ronda 3: solo mímica (texto no visible en la app)
- Cada turno es de 30 segundos por jugador
- Rota el turno entre jugadores de equipos alternos
- Cuando se terminen todas las palabras se avanza a la siguiente ronda
- Se reinicia el mismo pool de palabras en cada ronda

#### 7. Estadísticas
- Lista de partidas jugadas
  - Fecha
  - Equipos
  - Jugadores
  - Puntaje final
  - Equipo ganador
- Detalles expandibles

---

### SQLite: Esquema de Tablas

#### `baterias`
- `id INTEGER PRIMARY KEY`
- `nombre TEXT`

#### `palabras`
- `id INTEGER PRIMARY KEY`
- `bateria_id INTEGER`
- `texto TEXT`

#### `jugadores`
- `id INTEGER PRIMARY KEY`
- `nombre TEXT`
- `equipo_id INTEGER`

#### `equipos`
- `id INTEGER PRIMARY KEY`
- `nombre TEXT`

#### `partidas`
- `id INTEGER PRIMARY KEY`
- `fecha TEXT`
- `equipo_azul_id INTEGER`
- `equipo_rojo_id INTEGER`
- `puntaje_azul INTEGER`
- `puntaje_rojo INTEGER`
- `ganador TEXT`

#### `partida_jugadores`
- `id INTEGER PRIMARY KEY`
- `partida_id INTEGER`
- `jugador_id INTEGER`
- `equipo TEXT`  // 'azul' o 'rojo'

---

### Estado Persistente
- Guardar la partida actual (batería, equipos, jugadores, ronda, palabras restantes) en SQLite
- Al abrir la app, si hay una partida sin finalizar, mostrar botón "CONTINUAR PARTIDA"
- Si se finaliza, guardar en `partidas` y borrar de estado temporal


### UI
- Usar `react-native-paper` para los botones, inputs, listas y tarjetas
- Colores: azul para equipo azul, rojo para equipo rojo, botones llamativos (verde ✔, rojo ✖)
- Fuentes legibles y botones grandes para usar en grupo

Genera el código con navegación y estado global con Zustand, incluye funciones para manejar lógica de turnos, timer, puntuación, y almacenamiento SQLite.

