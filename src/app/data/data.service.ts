import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private staff: any = [];
  private technic: any = [];
  private type_of_equipment: any = [];
  private employee_equipment: any = [];

  gettingEmployeeData() {
      return this.staff;        
  }
  gettingInformationAboutTheEquipment() {
    return this.technic;
  }
  obtainingDataOnTheTypesOfEquipment() {
      return this.type_of_equipment;
  }
  gettingInformationAboutTheEquipmentOfEmployees() {
      return this.employee_equipment;
  }

  changingEmployeeData(data: any) {
      this.staff = data;
  }
  changingTechnologyData(data: any) {
      this.technic = data;
  }
  changingDataOnTypesOfEquipment(data: any) {
      this.type_of_equipment = data;
  }
  changingEmployeeEquipmentData(data: any) {
      this.employee_equipment = data;
  }
}
