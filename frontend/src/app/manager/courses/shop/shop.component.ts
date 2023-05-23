import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any = {college_name: "", role: "student"};
  course_data: any = {shop: []};
  id_course!: number;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private courseService: CourseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_course = params['id']; // (+) converts string 'id' to a number
    });

    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe(
    (response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;

        this.courseService.getDetails(String(this.id_course)).subscribe((college: any) => {
          if(college.status == 200) {
            this.course_data = college.data;
            this.course_data.shop = JSON.parse(this.course_data.shop);
            this.course_data.next_shop = formatDate(this.course_data.next_shop, 'dd-MM-yyyy', 'en');

            this.dataLoaded = Promise.resolve(true);
          }
        });
      }
    },
    error => {
      this.router.navigate(['/login']);
    });
  }

  buyItem(idx: string, precio: number) {
    this.userService.buyItem(Number(localStorage.getItem('id')), idx).subscribe((result: any) => {
      console.log(result);
      if(result.status == 200) {
        Swal.fire({
          title: 'You have bought the item',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        this.user_data.pepas -= precio;
      }
    },
    (error: any) => {
      Swal.fire({
        title: 'Error buying item',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }
}
