import { HttpClient } from '@angular/common/http';
import { Component,OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit{

  public dataSource!:MatTableDataSource<User>
  public users!:User[];
  @ViewChild(MatPaginator)paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns:string[]=['id','firstName','lastName','email','mobile','bmiResult','gender','Package','enquiryDate','action'];

  constructor(private myser:ApiService,private router:Router,private toastr: ToastrService,private ngconfirm:NgConfirmService){}
  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.myser.getRegisteredUser().subscribe(res=>{
      this.users=res;
      this.dataSource=new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  edit(id:number){
   this.router.navigate(['update',id])
  }
  userdetail(id:number){
    this.router.navigate(['detail',id])
  }
  
  delete(id:number){
    this.ngconfirm.showConfirm("Are you sure want to Delete?",()=>{
      this.myser.deleteRegisteredUser(id).subscribe(res=>{
        this.toastr.success("success","Enquiry Deleted" ,{timeOut:5000})
        this.getUsers()
      })
    },()=>{})
    
  }
  
}
