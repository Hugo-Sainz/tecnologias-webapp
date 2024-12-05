import { Component, OnInit, ViewChild } from '@angular/core';
import { MateriaService } from '../materia.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacadeService } from '../facade.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatosUsuario } from '../alumnos-screen/alumnos-screen.component';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit{

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriaService,
    private router: Router,
    public dialog: MatDialog
  ){}

  public name_materia:string = "";
  public token : string = "";
  public lista_materias: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['nrc', 'nombre_materia', 'seccion', 'dias', 'hora_inicio', 'hora_fin', 'salon', 'programa', 'profesor', 'creditos'];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {

    this.name_materia = this.facadeService.getUserCompleteName();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate([""]);
    }
    //Obtener maestros
    this.obtenerMaterias();
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
  public obtenerMaterias(){
    this.materiasService.obtenerListaMaterias().subscribe(
      (response)=>{
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);
        if(this.lista_materias.length > 0){
          console.log("Materias: ", this.lista_materias);

          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  public goEditar(idMateria: number){
    this.router.navigate(["materias"+idMateria]);
  }

  public delete(idMateria: number){
    //console.log("User:", idUser);
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idMateria}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });
    //Esta se ejecuta después de un evento que cierra el modal
    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Materia eliminado");
        //Recargar página
        alert("Materia eliminado correctamente");
        window.location.reload();
      }else{
        alert("Materia no eliminado ");
        console.log("No se eliminó la materia");
      }
    });
  }
}//Fin de la clase

//Esto va fuera de la llave que cierra la clase
export interface DatosMateria {
  nrc: number,
  nombre_materia: string;
  seccion: number;
  dias_json: string;
  hora_inicio: string;
  hora_fin: string,
  salon: string,
  programa: string,
  profesor: string,
  creditos: number,
    
  }
