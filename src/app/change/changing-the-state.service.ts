import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangingTheStateService {

  public updateComponentStaff = new BehaviorSubject('false');
  public updateComponentTechnic = new BehaviorSubject('false');
  public updateComponentTypeOfEquipment = new BehaviorSubject('false');
  public updateComponentEmployeeEquipment = new BehaviorSubject('false');

  public dataAboutTheRemovalOfAnEmployee = new BehaviorSubject('');
  public dataOnTheRemovalOfEquipment = new BehaviorSubject('');
  public dataOnTheRemovalOfTheTypeOfEquipment = new BehaviorSubject('');
  public dataOnTheRemovalOfTheEmployeeTechnicianBundle = new BehaviorSubject({});

  public employeeEditingData = new BehaviorSubject(0);
  public informationAboutEditingEquipment = new BehaviorSubject(0);
  public informationAboutEditingTheTypeOfEquipment = new BehaviorSubject(0);
  public dataOnEditingTheEmployeeTechnicianBundle = new BehaviorSubject(0);

  constructor() { }
}
