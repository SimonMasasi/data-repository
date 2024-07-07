import {Component} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

/**
 * @title Stepper that displays errors in the steps
 */
@Component({
  selector: 'stepper-errors-example',
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class UploadDatasetComponent {

  repo_name = '';
  scope = '';
  title = '';
  dataset_name = '';
  description = '';
  domain = '';
  file : File | undefined;

  firstFormGroup = this._formBuilder.group({
    firstCtrl1: ['', Validators.required],
    firstCtrl2: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl1: ['', Validators.required],
    thirdCtrl2: ['', Validators.required],
    thirdCtrl3: ['', Validators.required],
  });
  error = '';


  ngOnInit(): void {
    
  }

  onSubmit() {
    // Validate form data (since we're not using FormBuilder)
    if (!this.repo_name || !this.scope || !this.title || !this.dataset_name || !this.description || !this.domain || !this.file) {
      this.error = 'Please fill in all fields correctly.';
      return;
    }
  
    const formData = {
      email: this.repo_name,
      first_name: this.scope,
      last_name: this.title,
      password: this.dataset_name,
      description: this.description,
      file: this.file,
    };

  }
  
  constructor(private _formBuilder: FormBuilder) {}
  isFirstValid() {
    return this.firstFormGroup.pristine || this.firstFormGroup.valid;   
  }
  isSecondValid() {
    return this.secondFormGroup.pristine || this.secondFormGroup.valid;   
  }  
  isThirdValid() {
    return this.thirdFormGroup.pristine || this.thirdFormGroup.valid;   
  }

}
