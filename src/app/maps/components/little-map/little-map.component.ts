import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-little-map',
  templateUrl: './little-map.component.html',
  styleUrls: ['./little-map.component.css'],
})
export class LittleMapComponent implements OnInit, AfterViewInit {
  @Input() lngLat: [number, number] = [0, 0];
  @ViewChild('map') divMap!: ElementRef;

  map!: mapboxgl.Map;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom: 12,
      interactive: false,
    });

    new mapboxgl.Marker().setLngLat(this.lngLat).addTo(this.map);
  }
}
