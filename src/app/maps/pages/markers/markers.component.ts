import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface CustomMarker {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.css'],
})
export class MarkersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-75.92101, 45.28722];

  markers: CustomMarker[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });
    this.getMarkers();
  }

  ngOnDestroy(): void {
    this.map.off('dragend', () => {});
  }

  ngOnInit(): void {}

  addMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const marker = new mapboxgl.Marker({ draggable: true, color })
      .setLngLat(this.center)
      .addTo(this.map);
    this.markers.push({
      color,
      marker,
    });
    this.saveMarkers();

    marker.on('dragend', () => {
      this.saveMarkers();
    });
  }

  goToMarker(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat(),
    });
  }

  saveMarkers() {
    const lngLatArr: CustomMarker[] = [];
    this.markers.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        center: [lng, lat],
      });
    });
    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  getMarkers() {
    if (!localStorage.getItem('markers')) {
      return;
    }

    const lngLatArr: CustomMarker[] = JSON.parse(
      localStorage.getItem('markers')!
    );

    lngLatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.center!)
        .addTo(this.map);

      this.markers.push({
        marker: newMarker,
        color: m.color,
      });

      newMarker.on('dragend', () => {
        this.saveMarkers();
      });
    });
  }

  deleteMarker(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkers();
  }
}
