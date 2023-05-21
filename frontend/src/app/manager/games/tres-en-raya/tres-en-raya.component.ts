import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

enum Player {
  None = '',
  X = 'X',
  O = 'O'
}

enum GameState {
  InProgress,
  Tie,
  Win
}

enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

@Component({
  selector: 'tres-en-raya',
  templateUrl: './tres-en-raya.component.html',
  styleUrls: ['./tres-en-raya.component.css']
})
export class TresEnRayaComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any = { role: 'student' };

  currentPlayer: Player = Player.X;
  board: Player[][] = [
    [Player.None, Player.None, Player.None],
    [Player.None, Player.None, Player.None],
    [Player.None, Player.None, Player.None]
  ];
  gameState: GameState = GameState.InProgress;
  winner: Player = Player.None;
  difficulties: Difficulty[] = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];
  selectedDifficulty: Difficulty | null = null;
  showDifficultySelection: boolean = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe(
      (response: any) => {
        if (response.status == 200 && response.data) {
          this.user_data = response.data;
          this.dataLoaded = Promise.resolve(true);
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
  }

  makeMove(row: number, col: number): void {
    if (this.board[row][col] === Player.None && this.gameState === GameState.InProgress) {
      this.board[row][col] = this.currentPlayer;
      this.checkGameState();

      if (this.gameState === GameState.InProgress) {
        this.switchPlayer();

        if (this.currentPlayer === Player.O) {
          this.playAIMove();
        }
      }
    }
  }

  playAIMove(): void {
    if (this.currentPlayer === Player.O) {
      if (this.selectedDifficulty === Difficulty.Easy) {
        this.playRandomMove();
      } else if (this.selectedDifficulty === Difficulty.Medium) {
        this.playMediumMove();
      } else if (this.selectedDifficulty === Difficulty.Hard) {
        this.playHardMove();
      }
    }
  }

  playRandomMove(): void {
    let availableMoves: [number, number][] = [];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === Player.None) {
          availableMoves.push([row, col]);
        }
      }
    }

    if (availableMoves.length > 0) {
      const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
      const [row, col] = availableMoves[randomMoveIndex];
      this.board[row][col] = this.currentPlayer;
      this.checkGameState();
      this.switchPlayer();
    }
  }

  playMediumMove(): void {
    const currentPlayer = this.currentPlayer;
    const opponentPlayer = currentPlayer === Player.X ? Player.O : Player.X;
  
    // Buscar movimiento ganador del oponente
    const blockingMove = this.findWinningMove(opponentPlayer);
    if (blockingMove) {
      const [row, col] = blockingMove;
      this.board[row][col] = currentPlayer;
      this.checkGameState();
      this.switchPlayer();
      return;
    }
  
    // Buscar movimiento ganador propio
    const winningMove = this.findWinningMove(currentPlayer);
    if (winningMove) {
      const [row, col] = winningMove;
      this.board[row][col] = currentPlayer;
      this.checkGameState();
      this.switchPlayer();
      return;
    }
  
    // Jugar aleatoriamente
    this.playRandomMove();
  }
  

  playHardMove(): void {
    // Buscar un movimiento ganador para la IA
    const winningMove = this.findWinningMove(Player.O);
    if (winningMove) {
      const [row, col] = winningMove;
      this.makeMove(row, col);
      return;
    }
  
    // Bloquear un movimiento ganador del jugador
    const blockingMove = this.findWinningMove(Player.X);
    if (blockingMove) {
      const [row, col] = blockingMove;
      this.makeMove(row, col);
      return;
    }
  
    // Jugar de manera estratégica
    if (this.board[1][1] === Player.None) {
      // Jugar en el centro si está disponible
      this.makeMove(1, 1);
      return;
    }
  
    // Jugar en las esquinas si están disponibles
    const corners: [number, number][] = [[0, 0], [0, 2], [2, 0], [2, 2]];
    const availableCorners = corners.filter(([row, col]) => this.board[row][col] === Player.None);
    if (availableCorners.length > 0) {
      const randomCornerIndex = Math.floor(Math.random() * availableCorners.length);
      const [row, col] = availableCorners[randomCornerIndex];
      this.makeMove(row, col);
      return;
    }
  
    // Jugar en cualquier posición disponible
    let availableMoves: [number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === Player.None) {
          availableMoves.push([row, col]);
        }
      }
    }
  
    if (availableMoves.length > 0) {
      const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
      const [row, col] = availableMoves[randomMoveIndex];
      this.makeMove(row, col);
      return;
    }
  }
  

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
  }

  checkGameState(): void {
    // Comprobar filas
    for (let row = 0; row < 3; row++) {
      if (
        this.board[row][0] !== Player.None &&
        this.board[row][0] === this.board[row][1] &&
        this.board[row][0] === this.board[row][2]
      ) {
        this.gameState = GameState.Win;
        this.winner = this.board[row][0];
        return;
      }
    }

    // Comprobar columnas
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] !== Player.None &&
        this.board[0][col] === this.board[1][col] &&
        this.board[0][col] === this.board[2][col]
      ) {
        this.gameState = GameState.Win;
        this.winner = this.board[0][col];
        return;
      }
    }

    // Comprobar diagonales
    if (
      this.board[0][0] !== Player.None &&
      this.board[0][0] === this.board[1][1] &&
      this.board[0][0] === this.board[2][2]
    ) {
      this.gameState = GameState.Win;
      this.winner = this.board[0][0];
      return;
    }

    if (
      this.board[0][2] !== Player.None &&
      this.board[0][2] === this.board[1][1] &&
      this.board[0][2] === this.board[2][0]
    ) {
      this.gameState = GameState.Win;
      this.winner = this.board[0][2];
      return;
    }

    // Comprobar empate
    let isTie = true;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === Player.None) {
          isTie = false;
          break;
        }
      }
      if (!isTie) {
        break;
      }
    }

    if (isTie) {
      this.gameState = GameState.Tie;
      this.winner = Player.None;
      return;
    }

    // Si no hay ganador ni empate, el juego sigue en progreso
    this.gameState = GameState.InProgress;
    this.winner = Player.None;
  }

  resetGame(): void {
    this.currentPlayer = Player.X;
    this.board = [
      [Player.None, Player.None, Player.None],
      [Player.None, Player.None, Player.None],
      [Player.None, Player.None, Player.None]
    ];
    this.gameState = GameState.InProgress;
    this.winner = Player.None;
    this.showDifficultySelection = true; // Mostrar los botones de selección de dificultad nuevamente
  }

  setDifficulty(difficulty: Difficulty): void {
    this.selectedDifficulty = difficulty;
    this.showDifficultySelection = false; // Ocultar los botones de selección de dificultad
    this.startGame(); // Iniciar el juego
  }

  startGame(): void {
    if (this.selectedDifficulty === Difficulty.Easy) {
      this.currentPlayer = Player.O; // La IA juega primero en dificultad fácil
      this.playAIMove();
    } else {
      this.currentPlayer = Player.X; // El jugador juega primero en dificultades media y difícil
    }
  }

  findWinningMove(player: Player): [number, number] | null {
    // Comprobar filas
    for (let row = 0; row < 3; row++) {
      if (
        this.board[row][0] === player &&
        this.board[row][1] === player &&
        this.board[row][2] === Player.None
      ) {
        return [row, 2];
      }
      if (
        this.board[row][0] === player &&
        this.board[row][1] === Player.None &&
        this.board[row][2] === player
      ) {
        return [row, 1];
      }
      if (
        this.board[row][0] === Player.None &&
        this.board[row][1] === player &&
        this.board[row][2] === player
      ) {
        return [row, 0];
      }
    }
  
    // Comprobar columnas
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] === player &&
        this.board[1][col] === player &&
        this.board[2][col] === Player.None
      ) {
        return [2, col];
      }
      if (
        this.board[0][col] === player &&
        this.board[1][col] === Player.None &&
        this.board[2][col] === player
      ) {
        return [1, col];
      }
      if (
        this.board[0][col] === Player.None &&
        this.board[1][col] === player &&
        this.board[2][col] === player
      ) {
        return [0, col];
      }
    }
  
    // Comprobar diagonales principales
    if (
      this.board[0][0] === player &&
      this.board[1][1] === player &&
      this.board[2][2] === Player.None
    ) {
      return [2, 2];
    }
    if (
      this.board[0][0] === player &&
      this.board[1][1] === Player.None &&
      this.board[2][2] === player
    ) {
      return [1, 1];
    }
    if (
      this.board[0][0] === Player.None &&
      this.board[1][1] === player &&
      this.board[2][2] === player
    ) {
      return [0, 0];
    }
  
    // Comprobar diagonal secundaria
    if (
      this.board[0][2] === player &&
      this.board[1][1] === player &&
      this.board[2][0] === Player.None
    ) {
      return [2, 0];
    }
    if (
      this.board[0][2] === player &&
      this.board[1][1] === Player.None &&
      this.board[2][0] === player
    ) {
      return [1, 1];
    }
    if (
      this.board[0][2] === Player.None &&
      this.board[1][1] === player &&
      this.board[2][0] === player
    ) {
      return [0, 2];
    }
  
    return null; // No se encontró un movimiento ganador
  }
  
}
