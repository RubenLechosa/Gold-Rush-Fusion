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
  }

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
  }

  checkGameState(): void {
    // Check rows
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

    // Check columns
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

    // Check diagonals
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

    // Check for a tie
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

    // If no winner or tie, the game is still in progress
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
  }
}
