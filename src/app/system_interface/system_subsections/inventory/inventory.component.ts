import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data/data.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'inventory',
    standalone: true,
    imports: [FormsModule, HttpClientModule],
    providers: [DataService],
    template: `
        <div
            class="div__component_field"
        >
            <div
                class="div__the_background_of_the_selection_list"
            >
                <select id="select" [(ngModel)]="selected_cabinet">
                    <option value="" selected disabled>Список кабинетов</option>
                    @for ( office of list_of_offices; track $index ) {
                        <option value="{{ office }}"> {{ office }}</option>
                    }
                </select>
            </div>
            <div
                class="div__the_background_of_the_report_generation_button"
            >
                <button (click)="goToTheReportGenerationPage()">Сформировать отчет</button>
            </div>
        </div>
    `,
    styles: `
        .div__component_field {
            width: 100%;
            height: 100%;
        }
        .div__the_background_of_the_selection_list {
            width: 100%;
            padding-top: 40px;
            padding-bottom: 20px;
            text-align: center;
        }
        select {
            width: 300px;
            line-height: 1.4;
            background-color: #EEF0F6;
            border: none;
            padding: 20px 20px 20px 20px;
            box-sizing: border-box;
            border-radius: 30px;
            font-family: "Inter", sans-serif;
            font-size: 14px;
            font-weight: 400;
            font-style: normal;
            color: #596EBD;
        }
        .div__the_background_of_the_report_generation_button {
            width: 100%;
            padding-top: 20px;
            text-align: center;
        }
        .div__the_background_of_the_report_generation_button button {
            height: 60px;
            width: 300px;
            border-radius: 40px;
            border: none;
            background-color: #596EBD;
            font-family: "Inter", sans-serif;
            font-size: 14px;
            font-weight: 400;
            font-style: normal;
            color: #FFFFFF;
        }
    `
})

export class Inventory implements OnInit {

    list_of_offices: Array<number> = [];
    selected_cabinet: any = "";

    constructor(private dataService: DataService, private http: HttpClient) {}

    ngOnInit() {
        this.http.get('http://localhost:3000/staff', {observe: 'response'}).subscribe((res: any) => {
            for ( let elem of res.body) {
                this.list_of_offices.push(elem.office);
            }
        });
    }

    goToTheReportGenerationPage() {

        window.open('http://localhost:3000/inventory?cabinet_number=203', '_blank');

    }

}