import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-detail-dialog',
  templateUrl: './error-detail-dialog.component.html',
  styleUrls: ['./error-detail-dialog.component.scss']
})
export class ErrorDetailDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ErrorDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    console.log({data: this.data});
  }

}
