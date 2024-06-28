import { Injectable } from '@angular/core';
// import { ResponseCode } from '../interfaces/global.interface';

export interface ResponseCode {
  code: number;
  description: string;
}


@Injectable({
  providedIn: 'root',
})

export class ResponseCodeService {
  constructor() { }

  private responseCodes: ResponseCode[] = [
    {
      code: 9000,
      description: 'Success',
    },
    {
      code: 9001,
      description: 'Invalid Request',
    },
    {
      code: 9002,
      description: 'No Record Found',
    },
    {
      code: 9003,
      description: 'Unauthorized',
    },
    {
      code: 9004,
      description: 'Duplicate',
    },
    {
      code: 9005,
      description: 'Failure',
    },
    {
      code: 9006,
      description: 'Data in Use',
    },
    {
      code: 9007,
      description: 'Bad Request',
    },
    {
      code: 9010,
      description: 'Limit Reached',
    },
    {
      code: 9012,
      description: 'National Id (NIDA ID) is already exist',
    },
    {
      code: 9014,
      description: 'Null Argument',
    },
    {
      code: 9020,
      description: 'No response data fields',
    },
    {
      code: 9022,
      description: 'Email address is already exist',
    },
    {
      code: 9023,
      description: 'Age limit not reached minimum age allowed is 18',
    },
    {
      code: 9024,
      description: 'Current Job Already Exists',
    },
  ];

  getCodeDescription(code: number) {
    const result = [];
    for (let i = 0; i < this.responseCodes.length; i++) {
      if (this.responseCodes[i].code === code) {
        result.push(this.responseCodes[i]);
      }
    }
    return result;
  }
}
