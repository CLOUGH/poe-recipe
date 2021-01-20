import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/models/stash-tab';

@Component({
  selector: 'app-item-popover',
  templateUrl: './item-popover.component.html',
  styleUrls: ['./item-popover.component.scss']
})
export class ItemPopoverComponent implements OnInit {
  @Input() 
  public item: Item;
  
  constructor() { }

  ngOnInit(): void {
  }

}
