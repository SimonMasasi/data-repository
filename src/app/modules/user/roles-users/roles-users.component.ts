import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-roles-users',
  templateUrl: './roles-users.component.html',
  styleUrl: './roles-users.component.scss'
})
export class RolesUsersComponent {
  userId='';
  rolePermissions: any;
  availableUsers: any;  
  roleId: any;
  users: any;
  isAddRoleUserModalOpen=false;
  constructor(
    // private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute, 
    private userService: UserService
    ){}


    addRoleUser() {
      if(this.userId==''){
        return
      }
    this.route.paramMap.subscribe(params => {
      this.roleId = params.get('roleId');

      const roleData = {
        userId: this.userId,
        roleId: this.roleId
      };

      this.userService.addRoleUser(roleData)
    .subscribe(response => {
      window.location.reload();
    });
    });
    }

    closeModal() {
      this.isAddRoleUserModalOpen = false;
    }

    openAddRoleUserModal() {
      this.userService.getAllUsers().subscribe(users =>{
        this.availableUsers = users;
      })
      this.isAddRoleUserModalOpen = true;
      // Additional logic can be added here if needed
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roleId = params.get('roleId');
      this.userService.getRoleUsers(this.roleId)
    .subscribe(users => {
      this.users = users;
    });
    });
    
  }
}
