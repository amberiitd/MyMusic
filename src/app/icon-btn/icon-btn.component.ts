import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-icon-btn',
  templateUrl: './icon-btn.component.html',
  styleUrls: ['./icon-btn.component.css']
})
export class IconBtnComponent implements OnInit {

  @Input()
  public hide: boolean = false;

  @Output()
  public action : EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

}
