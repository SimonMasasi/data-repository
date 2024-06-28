import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
    userProfile: any;
    userId: any;
    constructor(
      private userService: UserService,
      private router: Router,
      private route: ActivatedRoute, 
      ){}

      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.userId = params.get('userId');
         this.getUserProfileData(this.userId);
        });
        
      }

      getUserProfileData(userId: number) {
        this.userService.getUserProfile(userId).subscribe(
          response => {
            console.log('User profile:', response);
            this.userProfile = response;
            console.log(this.userProfile);
          },
          error => {
            console.error('Error fetching user profile:', error);
          }
        );
      }
}
