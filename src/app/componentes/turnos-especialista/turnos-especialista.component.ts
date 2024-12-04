import { Component, inject, OnInit } from '@angular/core';
import { ITurno } from '../../interfaces/iturno';
import { TurnosService } from '../../services/turnos.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Primitive, Timestamp } from '@angular/fire/firestore';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { EstadoTurno } from '../../enums/estadoTurno';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { IEspecialista } from '../../interfaces/iespecialista';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [FormsModule, CommonModule, SpinnerComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent {

  turnosService = inject(TurnosService);
  usuariosDB = inject(UsuarioService);
  auth = inject(AuthService);
  turnos : Array<ITurno> = [];
  todosLosTurnos : Array<ITurno> = [];

  mostrarSpinner : boolean = false;

  valorFiltro : string = '';

  protected credentials !: FormGroup;

  completarHistoriaClinica : boolean = false;


  constructor(private fb: FormBuilder){
    this.credentials = this.fb.group({
      altura: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      peso: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      temperatura: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      presion: ['',[Validators.required]],
    });
  }
  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = (await this.turnosService.traerTurnosEspecialista('Flop3kEUP22GCphjczuc'))
    resp.forEach(turno => {
      this.turnos.push(turno as ITurno);
    });

    this.turnos = this.turnos.map(turno => {
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia, // Convertir `Timestamp` a `Date`
      } as ITurno;
    })

    this.todosLosTurnos = this.turnos;

    this.mostrarSpinner = false;
  }

  get altura(){
    return this.credentials.get('altura');
  }

  get peso(){
    return this.credentials.get('peso');
  }

  get temperatura(){
    return this.credentials.get('temperatura');
  }

  get presion(){
    return this.credentials.get('presion');
  }

  filtrarTurno() : void
  {

    const regex = new RegExp(`^${this.valorFiltro}`, 'i');

    var primeraCopia = this.turnos;
    var segundaCopia = this.turnos;
    var tercerCopia  = this.turnos;
    var filtradoPrimerDatoDinamico : ITurno[] = [];
    var filtradoSegundoDatoDinamico : ITurno[] = []; 
    var filtradoTercerDatoDinamico : ITurno[] = [];

    this.turnos = this.turnos.filter(turno => regex.test(turno.nombrePaciente) || regex.test(turno.especialidad) || regex.test(turno.presion!) || 
                                      regex.test(turno.altura!.toString()) || regex.test(turno.peso!.toString()) || regex.test(turno.temperatura!.toString()));

    var arrayFiltrado : ITurno[] = primeraCopia.filter(turno => {
      if(turno.primerDatoDinamico)
      {
        var values = Object.values(turno.primerDatoDinamico);

        if(regex.test(values[0]))
        {
          filtradoPrimerDatoDinamico.push(turno);
        }
        
        var claves = Object.keys(turno.primerDatoDinamico);

        return claves.length > 0 && regex.test(claves[0]);
      }
      else
      {
        return false;
      }
    });

    var  segundoArrayFiltrado : ITurno[] = segundaCopia.filter(turno => {
      if(turno.segundoDatoDinamico)
      {

        var values = Object.values(turno.segundoDatoDinamico);

        if(regex.test(values[0]))
        {
          filtradoSegundoDatoDinamico.push(turno);
        }

        var claves = Object.keys(turno.segundoDatoDinamico);

        return claves.length > 0 && regex.test(claves[0]);
      }
      else
      {
        return false;
      }
    });

    var tercerArrayFiltrado : ITurno[] = tercerCopia.filter(turno => {
      if(turno.tercerDatoDinamico)
      {

        var values = Object.values(turno.tercerDatoDinamico);

        if(regex.test(values[0]))
        {
          filtradoTercerDatoDinamico.push(turno);
        }
        var claves = Object.keys(turno.tercerDatoDinamico);

        return claves.length > 0 && regex.test(claves[0]);
      }
      else
      {
        return false;
      }
    });

    var unionArrayBusqueda = [...this.turnos, ...arrayFiltrado, ...segundoArrayFiltrado, ...tercerArrayFiltrado, ...filtradoPrimerDatoDinamico, ...filtradoSegundoDatoDinamico, ...filtradoTercerDatoDinamico];

    this.turnos = unionArrayBusqueda.filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
    );

  }

  resetFiltro() : void
  {
    this.valorFiltro = '';
    this.turnos = this.todosLosTurnos;
  }

  async cancearTurno(turno : ITurno) : Promise<void>
  {
    var motivo;
    await Swal.fire({
      position: "center",
      icon: "warning",
      title: "¿Por que desea cancelar el turno?",
      input : "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showConfirmButton: true,
    }).then(result => {
      if(result.isConfirmed)
      {
        motivo = result.value;
      }
    });

    turno.motivoCancelacion = motivo
    turno.estado = EstadoTurno.CANCELADO;
    this.turnosService.actualizarTurno({...turno})

    const especialista =  await this.usuariosDB.traerEspecialista(turno.idEspecialista);

    switch (turno.dia.getDay().toString()) {
      case '1':
        especialista.lunes?.push(turno.hora);
        break;
      case '2':
        especialista.martes?.push(turno.hora);
        break;
      case '3':
        especialista.miercoles?.push(turno.hora);
        break;
      case '4':
        especialista.jueves?.push(turno.hora);
        break;
      case '5':
        especialista.viernes?.push(turno.hora);
        break;
    }

    this.usuariosDB.actualizarEspecialista(especialista);
  }

  async finalizarTurno(turno: ITurno) : Promise<void>
  {
    turno.estado = EstadoTurno.FINALIZADO;
    var reseña;
    await Swal.fire({
      position: "center",
      icon: "success",
      title: "A continuacion deje un comentario sobre el turno con el diagnostico realizado",
      input : "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showConfirmButton: true,
    }).then(result => {
      if(result.isConfirmed)
      {
        reseña = result.value;
      }
    });

    turno.resenia = reseña;

    const respuesta= await Swal.fire({
      title: "Complete los datos",
      confirmButtonText: 'Aceptar',
      html: `
      <div class="flex flex-col">
        <label> Altura</label>
        <input id="altura" placeholder="En centimetros" class="swal2-input">
        <label> Peso</label>
        <input id="peso" placeholder="En Kilogramos" class="swal2-input">
        <label> Temperatura</label>
        <input id="temperatura" placeholder="En celsius" class="swal2-input">
        <label> Presion</label>
        <input id="presion" class="swal2-input">
        <label>Datos dinamicos</label>
        <div class="flex w-full">
          <input id="clave1" placeholder="Primer clave" class="swal2-input w-1/2">
          <input id="valor1" placeholder="Primer valor" class="swal2-input w-1/2">
        </div>
        <div class="flex w-full">
          <input id="clave2" placeholder="Segunda clave" class="swal2-input w-1/2">
          <input id="valor2" placeholder="Segundo valor" class="swal2-input w-1/2">
        </div>
        <div class="flex w-full">
          <input id="clave3" placeholder="Tercera clave" class="swal2-input w-1/2">
          <input id="valor3" placeholder="Tercer valor" class="swal2-input w-1/2">
        </div>
      </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById("altura"))!.value,
          (<HTMLInputElement>document.getElementById("peso"))!.value,
          (<HTMLInputElement>document.getElementById("temperatura"))!.value,
          (<HTMLInputElement>document.getElementById("presion"))!.value,
          (<HTMLInputElement>document.getElementById("clave1"))!.value,
          (<HTMLInputElement>document.getElementById("clave2"))!.value,
          (<HTMLInputElement>document.getElementById("clave3"))!.value,
          (<HTMLInputElement>document.getElementById("valor1"))!.value,
          (<HTMLInputElement>document.getElementById("valor2"))!.value,
          (<HTMLInputElement>document.getElementById("valor3"))!.value,
        ];
      }
    });

    if(respuesta.value && Array.isArray(respuesta.value))
    {
      const array = respuesta.value;
      var primerClave;
      var primerValor;
      var segundaClave;
      var segundoValor;
      var tercerClave;
      var tercerValor;

      for (let i = 0; i < array.length; i++) {
        switch (i) {
          case 0:
            turno.altura = array[i];
            break;
          case 1:
            turno.peso = array[i];
            break;
          case 2:
            turno.temperatura = array[i];
            break;
          case 3:
            turno.presion = array[i];
            break;
          case 4:
            primerClave = array[i];
            break;
          case 5:
            segundaClave = array[i];
            break;
          case 6:
            tercerClave = array[i];
            break;
          case 7:
            primerValor = array[i];
            break;
          case 8:
            segundoValor = array[i];
            break;
          default:
              tercerValor = array[i];
              break;
        }
        
      }

      turno.historiaClinica = true;
      if(primerClave && primerValor)
      {
        var objetoMap = new Map<any,any>();
        objetoMap.set(primerClave!,primerValor!);
        const plainObject = Object.fromEntries(objetoMap);
        turno.primerDatoDinamico = plainObject;
      }

      if(segundaClave && segundoValor)
      {
        objetoMap = new Map<any,any>();
        objetoMap.set(segundaClave!,segundoValor!);
        const plainObject2 = Object.fromEntries(objetoMap);
        turno.segundoDatoDinamico = plainObject2;
      }

      if(tercerClave && tercerValor)
      {
        objetoMap = new Map<any,any>();
        objetoMap.set(tercerClave!,tercerValor!);
        const plainObject3 = Object.fromEntries(objetoMap);
        turno.tercerDatoDinamico = plainObject3;
      }
    }


    this.turnosService.actualizarTurno(turno);
  }


  verResenia(turno : ITurno) : void
  {
    Swal.fire({
      position: "center",
      title: turno.resenia!,
      showConfirmButton: true,
    });
  }

  async aceptarTurno(turno: ITurno) : Promise<void>
  {
    turno.estado = EstadoTurno.APROBADO;
    this.turnosService.actualizarTurno(turno);
  }
  

}
