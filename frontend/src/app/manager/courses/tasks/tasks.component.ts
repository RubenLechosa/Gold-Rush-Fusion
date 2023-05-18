import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  @ViewChild('closeCategoryModal') closeCategoryModal!:any;
  @ViewChild('closeHomeModal') closeHomeModal!:any;
  @ViewChild('openModal') openModal!:any;

  alreadySubmit: boolean = false;
  dataLoaded!: Promise<boolean>;
  user_data: any;
  id_course?: number;
  course_data: any;
  tasks_list: any;
  submits_list: any;
  id_users_submits: any;
  submit_data: any;
  texto: string = '';

  markForm = new FormGroup({
    mark: new FormControl(null, Validators.required),
    comment: new FormControl(null)
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '300px',
      maxHeight: '500px',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ]
};

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private userService: UserService, private route: ActivatedRoute,  private router: Router, private courseService: CourseService, private tasksService: TaskService) { }

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id_course = params['id']; // (+) converts string 'id' to a number
  });


  this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
    if(response.status == 200 && response.data) {
      this.user_data = response.data;
      
      this.authService.checkPermissions(this.user_data.role, ["student", "college_manager", "teacher"]);

      this.courseService.getDetails(String(this.id_course)).subscribe((courses: any) => {
        if(courses.status == 200) {
          this.course_data = courses.data;
          this.texto = this.course_data.home_description;
          this.reloadTasks();
          this.reloadUploads();
          this.dataLoaded = Promise.resolve(true);
        }
      });

    } else {
      this.router.navigate(['/login']);
    }
  });
}

reloadTasks() {
  this.tasksService.getTasksList(Number(this.id_course)).subscribe((tasks: any) => {
    if(tasks.status == 200) {
      this.tasks_list = tasks.data;

      if(this.tasks_list.tasks) {
        this.tasks_list.tasks = JSON.parse(this.tasks_list.tasks);
      }
    }
  });
  this.alreadySubmit = false;
}

reloadUploads() {
  this.tasksService.getAllSubmitsByCourse(Number(this.id_course)).subscribe((tasks: any) => {
    if(tasks.status == 200) {
      this.submits_list = tasks.data;

      this.submits_list.forEach((_task: any, idx: any) => {
        this.submits_list[idx].created_at = formatDate(_task.created_at, 'yyyy-MM-dd', 'en');
      });
    }
  });
  
  this.alreadySubmit = false;
}

deleteTask(id_task: number) {
  if(confirm("Are you you sure you want to remove the task?")){
    this.alreadySubmit = true;
    this.tasksService.removeTask(id_task).subscribe((tasks: any) => {
      if(tasks.status == 200) {
        this.reloadTasks();
        Swal.fire({
          title: 'Task Removed',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}

deleteCategory(id_category: number) {
  if(confirm("Are you sure?")){
    this.alreadySubmit = true;
    this.tasksService.deleteCategory(id_category).subscribe((tasks: any) => {
      if(tasks.status == 200) {
        this.reloadTasks();
        Swal.fire({
          title: 'Category Removed',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}

openMarkModal(id_subm: number, id_task: number, id_user: number) {
  this.id_users_submits = id_subm;

  this.tasksService.getSubmitDetails(Number(id_task), Number(id_user)).subscribe((tasks: any) => {
    console.log(tasks);
    if(tasks.status == 200) {
      this.submit_data = tasks.data;
      this.submit_data.submit = JSON.parse(tasks.data.submit);
      this.openModal.nativeElement.click();
    }
  });
}

onsubmitMark() {
  this.tasksService.setMark(Number(this.id_users_submits),  Number(this.markForm.get("mark")?.value), String(this.markForm.get("comment")?.value)).subscribe((tasks: any) => {
    if(tasks.status == 200) {
      this.reloadUploads();
      this.closeCategoryModal.nativeElement.click();
      Swal.fire({
      title: 'Mark Submited',
      icon: 'success',
      confirmButtonText: 'OK'
      });
    }
  });

  this.alreadySubmit = false;
}

exportToExcel() {
  let tabla = document.getElementById("miTabla");

  if (tabla != null) {
    // Realiza una copia de la tabla original
    let tablaCopia = tabla.cloneNode(true) as HTMLElement;

    // Elimina la última columna de la copia de la tabla
    let rows = tablaCopia.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      rows[i].deleteCell(-1);
    }

    let worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tablaCopia);
    let workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks');
    XLSX.writeFile(workbook, 'marks.xlsx');

    Swal.fire({
      title: 'Marks Exported',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }
}


submitHomeContent() {
  console.log(this.texto);
  this.courseService.saveDescription(Number(this.id_course), this.texto).subscribe((tasks: any) => {
    console.log(tasks);
    if(tasks.status == 200) {
      this.course_data.home_description = this.texto;
      this.closeHomeModal.nativeElement.click();
      Swal.fire({
      title: 'Home Saved',
      icon: 'success',
      confirmButtonText: 'OK'
      });
    }
  });
}

mostrarContenidoHTML() {
  // Desinfectar y marcar el contenido HTML como seguro
  let contenidoSeguro = this.sanitizer.bypassSecurityTrustHtml(this.course_data.home_description);

  return contenidoSeguro;
}

}