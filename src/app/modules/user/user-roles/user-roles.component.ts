import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent {

    isAddUserModalOpen = false;
    roles:any;
    roleName='';
    rolePermissions='';
    isEditModalOpen = false;
    isDeleteModalOpen = false;
    isDeactivateModalOpen = false;
    constructor(
      private userService: UserService,
      public dialog: MatDialog
      ){}
    ngOnInit(): void {
      this.userService.getUserRoles().subscribe(roles =>{
        this.roles = roles
      })
    }
  
    openAddUserModal() {
        this.isAddUserModalOpen = true;
        // Additional logic can be added here if needed
    }
  
    addRole() {
      if(this.rolePermissions=='' || this.roleName==''){
        return
      }
      const roleData = {
        name: this.roleName,
        permissions: this.rolePermissions
      };
      this.userService.addRole(roleData).subscribe(
        response => {
          console.log('Role added successfully:', response);
          this.roleName = '';
          this.rolePermissions = '';
          window.location.reload();

        },
        error => {
          console.error('Error adding role:', error);
        }
      );
    }
    openEditModal(userId: number) {
      this.isEditModalOpen = true;
      // You can perform additional actions here such as fetching data based on user ID
  }

  openDeleteModal(userId: number) {
      this.isDeleteModalOpen = true;
      // You can perform additional actions here such as fetching data based on user ID
  }

  openDeactivateModal(userId: number) {
      this.isDeactivateModalOpen = true;
      // You can perform additional actions here such as fetching data based on user ID
  }

  closeModal() {
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.isDeactivateModalOpen = false;
    this.isAddUserModalOpen = false;
  }
}
