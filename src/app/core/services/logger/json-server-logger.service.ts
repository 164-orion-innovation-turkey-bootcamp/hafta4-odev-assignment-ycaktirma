import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Logger } from '../../abstract/logger';
import { Log } from '../../models/Log';
import { BaseLoggerService } from '../baseLogger/base-logger.service';

@Injectable({
  providedIn: 'root'
})
export class JsonServerLoggerService extends BaseLoggerService implements Logger{

  private logTableName='logs';
  private targetApiEndpoint = environment.baseApiUrl + this.logTableName;

  constructor(private httpClient:HttpClient) {
    super();
  }
  log(message:string): void {
    let log = new Log(message,new Date());

    this.httpClient.post(this.targetApiEndpoint, log).subscribe();
  }
}
