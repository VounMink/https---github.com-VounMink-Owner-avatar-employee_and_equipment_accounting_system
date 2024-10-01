import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemInterface } from './system_interface/system_interface.component';
import { FormsModule } from '@angular/forms';
import { DataService } from './data/data.service';
import { ChangingTheStateService } from './change/changing-the-state.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SystemInterface, FormsModule, HttpClientModule],
  providers: [DataService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app_style_dop.component.css'],
})
export class AppComponent implements OnInit {

  opening_the_modal_menu: string = "none";
  opening_the_modal_menu__staff: string = "none";
  opening_the_modal_menu__technic: string = "none";
  opening_the_modal_menu__type_of_equipment: string = "none";
  opening_the_modal_menu__employee_equipment: string = "none";

  data_employees_full_name: string = "";
  data_employees_office_number: any = "";

  data_name_of_the_equipment: string = "";
  data_name_of_the_selected_type_of_equipment: string = "";

  data_the_name_of_the_introduced_type_of_equipment: string = "";

  id_of_the_selected_employee: string = "";
  the_account_number_of_the_selected_employee: number = 0;
  id_of_the_selected_equipment: string = "";
  the_type_of_equipment_selected: string = "";

  an_array_of_technical_data: any = [];
  array_of_full_names_of_employees: any = [];
  array_of_equipment_names: any = [];

  employee_s_full_name: string = "";
  name_of_the_remote_equipment: string = "";
  remote_type_of_equipment: string = "";
  employee_technician_object: any = {};

  showing_the_employee_removal_window: string = "none";
  showing_the_modal_window_for_removing_equipment: string = "none";
  showing_a_modal_window_for_deleting_a_type_of_technique: string = "none";
  showing_the_modal_window_for_removing_the_technician_employee_bundle: string = "none";

  the_object_of_the_employee_being_edited: any = {};
  the_object_of_the_edited_technique: any = {};
  an_array_of_all_types_of_equipment: Array<string> = [];
  an_object_of_the_type_of_equipment_being_edited: any = {};
  the_object_of_editing_the_employee_technician_bundle: any = {};
  list_of_full_names_of_all_employees: Array<string> = [];
  list_of_names_of_all_equipment: Array<string> =  [];
  name_of_the_employee_s_current_equipment: String = "";

  showing_the_employee_editing_window: string = "none";
  showing_a_modal_window_for_changing_the_technique: string = "none";
  showing_a_modal_window_for_editing_a_type_of_technique: string = "none";
  showing_the_modal_window_for_removing_the_employee_technician_bundle: string = "none";

  call_counter_of_the_employee_editing_window: number = 0;

  constructor(private dataService: DataService, private CHTSS: ChangingTheStateService, private http: HttpClient) {}

  ngOnInit() {
    this.getEmployeeData();
    this.getTheseTechniques();
    this.getDataOnTypesOfEquipment();
    this.getDataBundles();

    this.CHTSS.dataAboutTheRemovalOfAnEmployee.subscribe((fcs: string) => {
      if (fcs != '') {
        this.employee_s_full_name = fcs;
        this.showing_the_employee_removal_window = "block";
        this.opening_the_modal_menu = "block";
      }
    });
    this.CHTSS.dataOnTheRemovalOfEquipment.subscribe((name: string) => {
      if (name != '') {
        this.name_of_the_remote_equipment = name;
        this.showing_the_modal_window_for_removing_equipment = "block";
        this.opening_the_modal_menu = "block";
      }
    });
    this.CHTSS.dataOnTheRemovalOfTheTypeOfEquipment.subscribe((name: string) => {
      if (name != '') {
        this.remote_type_of_equipment = name;
        this.showing_a_modal_window_for_deleting_a_type_of_technique = "block";
        this.opening_the_modal_menu = "block";
      }
    });
    this.CHTSS.dataOnTheRemovalOfTheEmployeeTechnicianBundle.subscribe((obj: any) => {
      if (Object.keys(obj).length != 0) {
        this.employee_technician_object = obj;
        this.showing_the_modal_window_for_removing_the_technician_employee_bundle = "block";
        this.opening_the_modal_menu = "block";
      }
    });

    this.CHTSS.employeeEditingData.subscribe((employee_index: number) => {
      if (this.call_counter_of_the_employee_editing_window > 0) {
        this.searchForAnEmployeeToEdit(employee_index);
        this.showing_the_employee_editing_window = "block";
        this.opening_the_modal_menu = "block";
      }
      if (employee_index == 0) {
        this.call_counter_of_the_employee_editing_window = this.call_counter_of_the_employee_editing_window + 1;
      }
    });
    this.CHTSS.informationAboutEditingEquipment.subscribe((technic_index: number) => {
      if (technic_index != 0) { 
        this.searchForAnEditablePieceOfEquipment(technic_index);
        this.selectionOfAllTypesOfEquipment();
        this.showing_a_modal_window_for_changing_the_technique = "block";
        this.opening_the_modal_menu = "block";
      }
    });
    this.CHTSS.informationAboutEditingTheTypeOfEquipment.subscribe((type_of_equipment_index: number) => {
      if (type_of_equipment_index != 0) {
        this.searchForAnEditableTypeOfEquipment(type_of_equipment_index);
        this.showing_a_modal_window_for_editing_a_type_of_technique = "block";
        this.opening_the_modal_menu = "block";
      }
    });
    this.CHTSS.dataOnEditingTheEmployeeTechnicianBundle.subscribe((employee_equipment_index: number) => {
      if (employee_equipment_index != 0) {
        this.searchForTheEditingObjectOfTheEmployeeTechnicianBundle(employee_equipment_index);
        this.selectionOfFullNamesOfAllEmployees();
        this.selectionOfAllTheNamesOfTheEquipment();
        this.name_of_the_employee_s_current_equipment = this.dataService.gettingInformationAboutTheEquipmentOfEmployees()[employee_equipment_index].name;
        this.showing_the_modal_window_for_removing_the_employee_technician_bundle = "block";
        this.opening_the_modal_menu = "block";
      }
    });
  }

  getEmployeeData() {
    this.http.get('http://localhost:3000/staff', {observe: 'response'}).subscribe(res => {
      this.dataService.changingEmployeeData(res.body);
      this.gettingInformationAboutTheFullNameOfEmployees();
    });
  }
  getTheseTechniques() {
    this.http.get('http://localhost:3000/technic', {observe: 'response'}).subscribe(res => {
      this.dataService.changingTechnologyData(res.body);
      this.obtainingDataOnAllNamesOfEquipment();
    });
  }
  getDataOnTypesOfEquipment() {
    this.http.get('http://localhost:3000/type_of_equipment', {observe: 'response'}).subscribe(res => {
      this.dataService.changingDataOnTypesOfEquipment(res.body);
      this.gettingDataAboutTheTypeOfEquipment();
    });
  }
  getDataBundles() {
    this.http.get('http://localhost:3000/employee_equipment', {observe: 'response'}).subscribe(res => {
      this.dataService.changingEmployeeEquipmentData(res.body);
    });
  }

  gettingDataAboutTheTypeOfEquipment() {
    this.an_array_of_technical_data = this.dataService.obtainingDataOnTheTypesOfEquipment();
  }
  gettingInformationAboutTheFullNameOfEmployees() {
    this.array_of_full_names_of_employees = this.dataService.gettingEmployeeData();

  }
  obtainingDataOnAllNamesOfEquipment() {
    this.array_of_equipment_names = this.dataService.gettingInformationAboutTheEquipment();
  }

  upCase(modal: string) {
    this.opening_the_modal_menu = "block";
    if (modal == 'staff') {
      this.opening_the_modal_menu__staff = "block";
    }
    if (modal == 'technic') {
      this.getDataOnTypesOfEquipment();
      this.opening_the_modal_menu__technic = "block";
      console.log(this.an_array_of_technical_data);
    }
    if (modal == 'type_of_equipment') {
      this.opening_the_modal_menu__type_of_equipment = "block";
    }
    if (modal == 'employee_equipment') {
      this.getEmployeeData();
      this.getTheseTechniques();
      this.opening_the_modal_menu__employee_equipment = "block";
    }
  }

  hidingTheModalWindow(modal: string) {
    this.opening_the_modal_menu = "none";
    if (modal == 'staff') {
      this.opening_the_modal_menu__staff = "none";
      this.data_employees_full_name = "";
      this.data_employees_office_number = "";
    }
    if (modal == 'technic') {
      this.opening_the_modal_menu__technic = "none";
    }
    if (modal == 'type_of_equipment') {
      this.opening_the_modal_menu__type_of_equipment = "none";
    }
    if (modal == 'employee_equipment') {
      this.opening_the_modal_menu__employee_equipment = "none";
    }
  }

  sendingDataAboutTheCreationofANewEmployee() { 
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/staff');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({FCs: this.data_employees_full_name, office: Number(this.data_employees_office_number)}));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentStaff.next('true');
    this.data_employees_full_name = "";
    this.data_employees_office_number = "";
  }

  sendingDataAboutAddingEquipment() {
    
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/technic');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({name:this.data_name_of_the_equipment, type_of_equipment_id: Number(this.data_name_of_the_selected_type_of_equipment)}));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentTechnic.next('true');
    this.data_name_of_the_equipment = "";
    this.data_name_of_the_selected_type_of_equipment = "";
  }

  sendingDataAboutAddingATypeOfEquipment() {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/type_of_equipment');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({type: this.data_the_name_of_the_introduced_type_of_equipment}));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentTypeOfEquipment.next('true');
    this.data_the_name_of_the_introduced_type_of_equipment = "";
  }

  sendingDataToAddTheRatioOfAnEmployeeToATechnique() {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/employee_equipment');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        employee_id: Number(this.id_of_the_selected_employee),
        id_of_the_equipment: Number(this.id_of_the_selected_equipment)
      }));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentEmployeeEquipment.next('true');
    this.id_of_the_selected_employee = "";
    this.id_of_the_selected_equipment = "";
  }

  hidingTheModalWindowForDeletingEmployees() {
    this.showing_the_employee_removal_window = "none";
    this.opening_the_modal_menu = "none";
  }
  hidingTheModalWindowForDeletingEquipment() {
    this.showing_the_modal_window_for_removing_equipment = "none";
    this.opening_the_modal_menu = "none";
  }
  hidingTheModalWindowForDeletingATypeOfTechnique() {
    this.showing_a_modal_window_for_deleting_a_type_of_technique = "none";
    this.opening_the_modal_menu = "none";
  }
  hidingTheModalWindowForDeletingTheTechnicianEmployeeBundle() {
    this.showing_the_modal_window_for_removing_the_technician_employee_bundle = "none";
    this.opening_the_modal_menu = "none";
  }

  hidingTheChangeWindow(window_name: string) {
    if (window_name == 'staff') {
      this.showing_the_employee_editing_window = "none";
      this.opening_the_modal_menu = "none";
    }
    if (window_name == 'technic') {
      this.showing_a_modal_window_for_changing_the_technique = "none";
      this.opening_the_modal_menu = "none";
    }
    if (window_name == 'type_of_equipment') {
      this.showing_a_modal_window_for_editing_a_type_of_technique = "none";
      this.opening_the_modal_menu = "none";
    }
    if (window_name == 'employee_equipment') {
      this.showing_the_modal_window_for_removing_the_employee_technician_bundle = "none";
      this.opening_the_modal_menu = "none";
    }
  }

  searchForAnEmployeeToEdit(employee_index: number) {
    this.the_object_of_the_employee_being_edited = this.dataService.gettingEmployeeData()[employee_index];
  }
  searchForAnEditablePieceOfEquipment(technic_index: number) {
    this.the_object_of_the_edited_technique = this.dataService.gettingInformationAboutTheEquipment()[technic_index - 1];
  }
  searchForAnEditableTypeOfEquipment(type_of_equipment_index: number) {
    this.an_object_of_the_type_of_equipment_being_edited = this.dataService.obtainingDataOnTheTypesOfEquipment()[type_of_equipment_index - 1];
  }
  searchForTheEditingObjectOfTheEmployeeTechnicianBundle(employee_equipment_index: number) {
    this.the_object_of_editing_the_employee_technician_bundle = this.dataService.gettingInformationAboutTheEquipmentOfEmployees()[employee_equipment_index];
  }

  selectionOfAllTypesOfEquipment() {
    this.an_array_of_all_types_of_equipment = this.dataService.obtainingDataOnTheTypesOfEquipment().filter((obj: any) => obj.type);
  }
  selectionOfFullNamesOfAllEmployees() {
    this.list_of_full_names_of_all_employees = this.dataService.gettingEmployeeData().filter((obj: any) => obj.fcs);
  }
  selectionOfAllTheNamesOfTheEquipment() {
    this.list_of_names_of_all_equipment = this.dataService.gettingInformationAboutTheEquipment().filter((obj: any) => obj.name);
  }

  sendingChangesToTheEmployeesFullName() {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', 'http://localhost:3000/staff');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(this.the_object_of_the_employee_being_edited));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentStaff.next('true');
  }
  sendingDataAboutChangesInEquipment() {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', 'http://localhost:3000/technic');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(this.the_object_of_the_edited_technique));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentTechnic.next('true');
  }
  sendingAModifiedTypeOfEquipment() {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', 'http://localhost:3000/type_of_equipment');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(this.an_object_of_the_type_of_equipment_being_edited));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentTypeOfEquipment.next('true');
  }
  sendingAnEditedEmployeeTechnicianBundle() {
    let an_object_with_an_office = this.dataService.gettingEmployeeData().find((item: any) => {
      if (item.fcs == this.the_object_of_editing_the_employee_technician_bundle.fcs) {
        return item;
      }
    }).office;
    let theTypeOfEquipmentSelected: string = this.dataService.gettingInformationAboutTheEquipment().find((item: any) => {
      if (item.name == this.the_object_of_editing_the_employee_technician_bundle.technic) {
        return item;
      }
    }).type;
    this.the_object_of_editing_the_employee_technician_bundle = {
      id: this.the_object_of_editing_the_employee_technician_bundle.id,
      fcs: this.the_object_of_editing_the_employee_technician_bundle.fcs,
      office: an_object_with_an_office,
      technic: theTypeOfEquipmentSelected + " / " + this.the_object_of_editing_the_employee_technician_bundle.technic
    };
    try {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', 'http://localhost:3000/employee_equipment');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(this.the_object_of_editing_the_employee_technician_bundle));
    } catch (error) {
      console.log(error);
    }
    this.CHTSS.updateComponentEmployeeEquipment.next('true');
  }

}
