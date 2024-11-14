import { Component, OnInit, ViewChild } from '@angular/core';
import { AlumnosService } from '../alumnos.service';
import { FacadeService } from '../facade.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})


export class AlumnosScreenComponent implements OnInit{
  public name_user:string = "";
  public rol:string = "";
  public token : string = "";
  public lista_alumnos: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'curp', 'edad', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  constructor(
    public facadeService: FacadeService,
    public alumnosServices: AlumnosService,
    private router: Router,
    public dialog: MatDialog
  ){ }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    //Obtener alumnos
    this.obtenerAlumnos();
    //Para paginador
    this.initPaginator();


  }

  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  //Obtener alumnos
  public obtenerAlumnos(){
    this.alumnosServices.obtenerListaAlumnos().subscribe(
      (response)=>{
        this.lista_alumnos = response;
        console.log("Lista users: ", this.lista_alumnos);
        if(this.lista_alumnos.length > 0){
          //Agregar datos del nombre e email
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Alumnos: ", this.lista_alumnos);

          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }

  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/alumno/"+idUser]);
  }

  public delete(idUser: number){
     //console.log("User:", idUser);
     const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'alumno'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });
    //Esta se ejecuta después de un evento que cierra el modal
    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Alumno eliminado");
        //Recargar página
        alert("Alumno eliminado correctamente");
        window.location.reload();
      }else{
        alert("Alumno no eliminado ");
        console.log("No se eliminó el alumno");
      }
    });
  }




}//fin de la clase

//interface
export interface DatosUsuario {
  id: number,
  matricula: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  telefono: string,
  rfc: string,
  curp: string,
  edad: number,
  ocupacion: string
}
