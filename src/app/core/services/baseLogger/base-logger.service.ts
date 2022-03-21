import { Injectable } from '@angular/core';
import { Logger } from '../../abstract/logger';

/**
 * BaseLogger class. It is better to make all loggers extend this class.
 */

@Injectable({
  providedIn: 'root'
})
export class BaseLoggerService{

  constructor() { }
  
}
