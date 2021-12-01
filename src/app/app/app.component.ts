import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ComponentType} from "@angular/cdk/overlay";
import {FormControl, FormGroup, Validators} from "@angular/forms";

interface IFullName {
    firstName: string,
    lastName: string
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(public dialog: MatDialog) {
    }

    fullName: IFullName = {
        firstName: '',
        lastName: ''
    }

    occupation = ''

    onClickEditBtn(value: string) {
        let component!: ComponentType<any>
        let data
        if (value === 'name') {
            component = DialogOverviewEditNameDialog
            data = this.fullName
        } else if (value === 'occupation') {
            component = DialogOverviewEditOccupationDialog
            data = this.occupation
        }

        const dialogRef = this.dialog.open(component, {
            panelClass: 'edit-modal',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (value === 'name' && result) {
                this.fullName = result
            } else if (value === 'occupation') {
                this.occupation = result
            }
        });
    }
}


@Component({
    selector: 'dialog-overview-edit-name-dialog',
    template: `
        <button class="close btn" [mat-dialog-close]="">&times;</button>
        <form [formGroup]="nameEditForm" (submit)="saveForm()">
            <div mat-dialog-content>
                <div class="material-textfield" [ngClass]="{'invalid': nameEditForm.controls['firstName'].invalid}">
                    <input placeholder=" " type="text" formControlName="firstName">
                    <label>Имя</label>
                </div>
                <div class="material-textfield" [ngClass]="{'invalid': nameEditForm.controls['lastName'].invalid}">
                    <input placeholder=" " type="text" formControlName="lastName">
                    <label>Фамилия</label>
                </div>
            </div>

            <div mat-dialog-actions>
                <button class="primary-btn btn" type="submit" [disabled]="nameEditForm.invalid">Сохранить</button>
                <button class="secondary-btn btn" [mat-dialog-close]="" type="button">Отмена</button>
            </div>
        </form>
    `,
    styles: [`:host {
      display: block;
      overflow: auto
    }`],
    styleUrls: ['app.component.scss']
})
export class DialogOverviewEditNameDialog {

    nameEditForm = new FormGroup({
        firstName: new FormControl('', [
            Validators.pattern('[A-Za-zА-Яа-я\-]+')
        ]),
        lastName: new FormControl('', [
            Validators.pattern('[A-Za-zzА-Яа-я\-]+')
        ]),
    })

    constructor(public dialogRef: MatDialogRef<DialogOverviewEditNameDialog>,
                @Inject(MAT_DIALOG_DATA) public data: IFullName) {
    }

    saveForm() {
        if (this.nameEditForm.valid) {
            this.dialogRef.close(this.nameEditForm.value)
        }
    }
}


@Component({
    selector: 'dialog-overview-edit-occupation-dialog',
    template: `
        <button class="close btn" [mat-dialog-close]="">&times;</button>
        <form mat-dialog-content>
            <div class="material-radio-container custom-scrollbar">
                <p *ngIf="occupations.length == 0">Загрузка...</p>
                <div class="material-radio"
                     *ngFor="let occupation of occupations; index as i">
                    <input type="radio" name="radio" id="radio{{i}}" [value]="occupation"
                           [(ngModel)]="selectedOccupation">
                    <label for="radio{{i}}">{{occupation | titlecase}}</label>
                </div>
            </div>
        </form>
        <div mat-dialog-actions>
            <button class="primary-btn btn" [mat-dialog-close]="selectedOccupation" [disabled]="!selectedOccupation">
                Сохранить
            </button>
            <button class="secondary-btn btn" [mat-dialog-close]="">Отмена</button>
        </div>
    `,
    styles: [`:host {
      display: block;
      overflow: auto
    }`],
    styleUrls: ['app.component.scss']
})
export class DialogOverviewEditOccupationDialog {
    selectedOccupation!: string
    occupations: Array<string> = []

    constructor(public dialogRef: MatDialogRef<DialogOverviewEditOccupationDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        setTimeout(() => {
            this.occupations = [
                'программист',
                'бухгалтер',
                'учитель',
                'инженер',
                'архитектор',
                'сантехник',
                'плотник',
                'руководитель',
                'менеджер',
                'другая'
            ]
        }, 2000)
    }
}
