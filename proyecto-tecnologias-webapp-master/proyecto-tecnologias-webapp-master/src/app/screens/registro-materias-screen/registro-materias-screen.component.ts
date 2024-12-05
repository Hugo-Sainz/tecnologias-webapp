import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MateriaService } from 'src/app/services/materia.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit{
  @Input() rol: string = "";
  @Input() datos_user: any = {};
  public lista_maestros: any[] = [];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_maestros as DatosUsuario[]);


  constructor(
    private materiaService:MateriaService,
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    public maestrosService: MaestrosService,
    private facadeService: FacadeService
  ){}
  public maestros= [];
  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información'}
  ];




  public materias:any[] = [
    {value: '1', nombre: 'Lunes'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miércoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
    {value: '6', nombre: 'Sábado'},
  ];



  public obtenerMaestros(){
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response)=>{
        this.lista_maestros = response.map(maestro=>{
          return{
            first_name :maestro.user.first_name,
            last_name: maestro.user.last_name,
            email: maestro.user.email

          }
        });
        console.log("Lista users: ", this.lista_maestros);
        /*if(this.lista_maestros.length > 0){
          //Agregar datos del nombre e email
          this.lista_maestros.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });*/
          console.log("Maestros: ", this.lista_maestros);

        //}
      }, (error)=>{
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  public materia:any = {};
  public errors:any={};
  public editar:boolean = false;
  public token:string = "";
  public idUser: Number = 0;

  

  ngOnInit(): void {
    this.obtenerMaestros();
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.materia = this.datos_user;
    }else{
      this.materia = this.materiaService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Materia: ", this.materia);

  }


  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia);
  }


  public revisarSeleccion(nombre: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }



  public regresar(){

  }

  public registrar(){
    //Validar
    
    this.errors = [];

    this.errors = this.materiaService.validarMateria(this.materia, this.editar);
   console.log(this.materia);
    this.materiaService.registrarMateria({
      ...this.materia,
      dias_json: JSON.stringify(this.materia.dias_json)
    }).subscribe(
      (response)=>{
        //Aquí va la ejecución del servicio si todo es correcto
        alert("Materia registrada correctamente");
        console.log("Materia registrado: ", response);
        if(this.token != ""){
          this.router.navigate(["home"]);
        }else{
          this.router.navigate(["/"]);
        }
      }, (error)=>{
        //Aquí se ejecuta el error
        alert("No se pudo registrar materia");
      }
    );
  }
  public actualizar(){
    //Validación
    /*
    this.errors = [];

    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.administradoresService.editarAdmin(this.admin).subscribe(
      (response)=>{
        alert("Administrador editado correctamente");
        console.log("Admin editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el administrador");
      }
    );
    */
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}

export interface DatosUsuario {
  first_name: string;
  last_name: string;
}