import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent {

  first_name = '';
  last_name='';
  username='';
  email='';
  users: any;
  userId: number|any;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  isDeactivateModalOpen = false;
  isActivateModalOpen = false;
  currentUser: any;
  constructor(
    private userService: UserService,
    public dialog: MatDialog
    ){};
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(users =>{
      this.users = users;
    })
  }

  ConfirmEditUser() {
    console.log("submit");
    if(this.username==''||this.first_name==''||this.last_name==''||this.email==''){

    const userData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      username: this.username
    };
    console.log(userData);
      console.log("error");
      return
    }
    const userData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      username: this.username
    };
    this.userService.editUser(this.userId, userData).subscribe(response=>{
      window.location.reload();
    })
  }

  confirmDelete(){
    this.userService.deleteUser(this.userId).subscribe(response => {
      window.location.reload();
    })
  }

  confirmDeactivate(){
    this.userService.deactivateUser(this.userId).subscribe(response => {
      window.location.reload();
    })
  }

  confirmActivate(){
    this.userService.activateUser(this.userId).subscribe(response => {
      window.location.reload();
    })
  }

  openEditModal(userId: number) {
      this.userService.getUser(userId).subscribe(user=> {
        this.currentUser = user;
        this.first_name=user.first_name;
        this.last_name=user.last_name;
        this.email=user.email;
        this.username=user.username;
      })
      this.isEditModalOpen = true;
      this.userId=userId;
  }

  openDeleteModal(userId: number) {
      this.isDeleteModalOpen = true;
      this.userId=userId;
  }

  openDeactivateModal(userId: number) {
      this.isDeactivateModalOpen = true;
      this.userId=userId;
  }

  openActivateModal(userId: number) {
    this.isActivateModalOpen = true;
    this.userId=userId;
}
  closeModal() {
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.isDeactivateModalOpen = false;
    this.isActivateModalOpen = false;
  }

}
