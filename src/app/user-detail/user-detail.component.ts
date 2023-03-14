import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
   
 public userId!:number;
 userDetail!: User

  constructor(private activatedroute:ActivatedRoute,private myser:ApiService){}
  ngOnInit(): void {
    this.activatedroute.params.subscribe(val=>{
      this.userId=val['id'];
      this.fetchUserDetails(this.userId)
    })
  }

  fetchUserDetails(userId:number){
    this.myser.getRegisteredUserId(userId).subscribe(res=>{
      this.userDetail=res
      console.log(this.userDetail)
    })
  }
}
