import { Component, OnInit } from '@angular/core';

import { Marcador } from 'src/app/classes/marcador.class';

import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapaEditarComponent } from './mapa-editar.component';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  marcadores: Marcador[] = []

  lat: number = -34.809040;
  lon: number = -58.492193;

  constructor( public snackBar: MatSnackBar,
               public dialog: MatDialog ) {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    if (localStorage.getItem ( 'marcadores')) {
      this.marcadores = JSON.parse ( localStorage.getItem ('marcadores') );
    } else {
      const marcador = new Marcador ( this.lat, this.lon );
      this.marcadores.push (marcador);
    }
  }

  ngOnInit() {}

  public agregarMarcador ( event ) {
    const marcador = new Marcador ( event.coords.lat, event.coords.lng );
    this.marcadores.push (marcador);

    this.guardarMarcadores ();
    this.snackBar.open('Marcador agregado', 'Cerrar', {duration:3000});
  }

  guardarMarcadores () {
    localStorage.setItem ( 'marcadores', JSON.stringify (this.marcadores) );
  }


  public borrarMarcador ( index: number ) {
    this.marcadores.splice ( index, 1 );
    this.guardarMarcadores();
    this.snackBar.open('Marcador borrado', 'Cerrar', {duration:3000});
  }

  public editarMarcador ( item: Marcador, index:number ) {

    const dialogRef = this.dialog.open( MapaEditarComponent, {
      width: '250px',
      data: { titulo: item.titulo, desc: item.desc }
    });
   
    dialogRef.afterClosed().subscribe(result => {

      if ( !result ) {
        return;
      }

      item.titulo = result.titulo;
      item.desc = result.desc
      this.guardarMarcadores ();
      this.snackBar.open('Marcador actualizado', 'Cerrar', {duration:3000});
    });
  }


}
