import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-paper-rock',
  templateUrl: './paper-rock.component.html',
  styleUrls: ['./paper-rock.component.css']
})
export class PaperRockComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any = {role: "student"};

  // Game
  game_init: boolean = false;
  coin_choosed?: number|null = null;
  coin_won?: number|null = null;
  won: boolean = false;
  draw: boolean = false;

  activePoints: number = 50;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe(
    (response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;

        this.dataLoaded = Promise.resolve(true);

      }
    },
    error => {
      this.router.navigate(['/login']);
    });
  }

  chooseCoin(coin: number) {
    this.coin_choosed = (coin == 1 || coin == 0 || coin == 2 ? coin : 0);
    this.user_data.pepas -= this.activePoints;

    this.userService.addGems(Number(localStorage.getItem('id')), this.activePoints, "res").subscribe(
      (response: any) => {
        if(response.status == 200) {
          this.chooseRandomNumber();
        }
      },
      error => {
        this.user_data.pepas += this.activePoints;
    });
  }

  chooseRandomNumber() {
    this.game_init = true;
    setTimeout(() => {
      this.coin_won = Math.floor(Math.random() * 2);
      this.game_init = false;
      this.checkIfWon();
    }, 3000);
  }

  setActivePoints(qty: number) {
    this.activePoints = qty;
  }

  replay() {
    this.coin_won = null;
    this.coin_choosed = null;
    this.won = false;
    this.draw = false;
  }

  checkIfWon() {
    if(
      (this.coin_won === 1 && this.coin_choosed === 0) ||
      (this.coin_won === 0 && this.coin_choosed === 2) ||
      (this.coin_won === 2 && this.coin_choosed === 1)
    ) {
      this.won = true;
      this.userService.addGems(Number(localStorage.getItem('id')), this.activePoints * 2).subscribe(
        (response: any) => {
          if(response.status == 200) {
            this.user_data.pepas += this.activePoints * 2;
          }
        },
        error => {
          
        });
    } else if(this.coin_won === this.coin_choosed) {
      this.draw = true;

      this.userService.addGems(Number(localStorage.getItem('id')), this.activePoints).subscribe(
        (response: any) => {
          if(response.status == 200) {
            this.user_data.pepas += this.activePoints;
          }
        },
        error => {
          
      });
    } else {
      this.won = false;
    }
  }
}