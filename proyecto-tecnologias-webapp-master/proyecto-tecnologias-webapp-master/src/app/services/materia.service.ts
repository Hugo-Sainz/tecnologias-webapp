import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

const httpOptions={
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }



  public esquemaMateria(){
    return {
      'nrc':'',
      'nombre_materia': '',
      'seccion': '',
      'dias_json': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa': '',
      'profesor': '',
      'creditos': ''
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia... ", data);
    let error: any = [];

    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["nombre_materia"])){
      error["nombre_materia"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["dias_json"])){
      error["dias_json"] = "Debes elegir dias para impartir la materia";
    }


    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["hora_fin"])){
      error["hora_fin"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["programa"])){
      error["programa"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["profesor"])){
      error["profesor"] = this.errorService.required;
    }
    if(!this.validatorService.required(data["creditos"])){
      error["creditos"] = this.errorService.required;
    }

     //Return arreglo
      return error;

  }

  //Aquí van los servicios HTTP
  //Servicio para registrar un nuevo usuario
  public registrarMateria (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materias/`,data, httpOptions);
  }

  public obtenerListaMaterias (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, {headers:headers});
  }

  //Obtener un solo maestro dependiendo su ID
  public getMateriaByID(idUser: Number){
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idUser}`,httpOptions);
  }

  //Servicio para actualizar un usuario
  public editarMateria (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materia-edit/`, data, {headers:headers});
  }

  //Eliminar Maestro
  public eliminarMateria(idUser: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materia-edit/?id=${idUser}`,{headers:headers});
  }




}
