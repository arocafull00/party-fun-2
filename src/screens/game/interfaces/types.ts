import { Player } from "../../../store/game-store";

export interface Teams {
  azul: { players: Player[] };
  rojo: { players: Player[] };
}

export type GamePhase = "battery" | "teams" | "summary";

export type TeamColor = "azul" | "rojo"; 