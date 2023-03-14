import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{

  public packages:string[]=["Monthly", "Quarterly","yearly"]
  public Gender:string[] =['Male','Female']
  public importantList:string[]=[
    "Toxic Fat Reduction",
    "Energy and Endurance",
    "Building  Lean Muscle",
    "Six pack",
    "Girlfriend",
    "Love Failure"

  ]
  public isUpdateActive:boolean=false
  public registrationForm!:FormGroup
  public userIdtoUpdate!:number
  constructor(private myfb:FormBuilder,private router:Router, private myser:ApiService, private activatedroute:ActivatedRoute, private toastr: ToastrService){}

  ngOnInit(): void {
    this.registrationForm=this.myfb.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      mobile:[''],
      weight:[''],
      height:[''],
      bmi:[''],
      bmiResult:[''],
      requireTrainer:[''],
      gender:[''], 
      Package:[''],
      important:[''],
      haveGymBefore:[''],
      enquiryDate:['']
    })
    this.registrationForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res)
    })

    this.activatedroute.params.subscribe(val=>{
         this.userIdtoUpdate=val['id']
         this.myser.getRegisteredUserId(this.userIdtoUpdate).subscribe(res=>{
              this.isUpdateActive=true
              this.fillFormToUpdate(res)
         })
    })
  }

  submit(){
   this.myser.postRegistration(this.registrationForm.value).subscribe(res=>{
     this.toastr.success("success","Enquiry added successfully" ,{timeOut:5000})
     this.registrationForm.reset();
   })
  }

  update(){
    this.myser.updateRegisteredUser(this.registrationForm.value,this.userIdtoUpdate).subscribe(res=>{
      this.toastr.success("success","Enquiry updated" ,{timeOut:5000})
      this.registrationForm.reset();
      this.router.navigate(['list'])
    })
  }

  calculateBmi(heightValue:any){
    const weight=this.registrationForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue("underweight");
        
        break;
      
        case (bmi >= 18.5 && bmi < 25):
        this.registrationForm.controls['bmiResult'].patchValue("Normal");
        break;
        case ( bmi >=25 && bmi < 30):
          this.registrationForm.controls['bmiResult'].patchValue("overweight")
          break;
      default:
        this.registrationForm.controls['bmiResult'].patchValue("obese")
        break;
    }
  }

  fillFormToUpdate(user:User){
    this.registrationForm.setValue({
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      mobile:user.mobile,
      weight:user.weight,
      height:user.height,
      bmi:user.bmi,
      bmiResult:user.bmiResult,
      requireTrainer:user.requireTrainer,
      gender:user.gender,
      Package:user.Package,
      important:user.important,
      haveGymBefore:user.haveGymBefore,
      enquiryDate:user.enquiryDate
    })
  }

}
