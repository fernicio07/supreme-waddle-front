import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PriceGradeService } from '../../../services/price-grade.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FamilyService } from '../../../services/family.service';
import { StudentService } from '../../../services/student.service';
import Swal from 'sweetalert2';
import { StudentFamilyComponent } from '../../family/student-family/student-family.component';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-crear-estudiante',
  templateUrl: './crear-estudiante.component.html'
})
export class CrearEstudianteComponent implements OnInit {

  @ViewChild(StudentFamilyComponent, { static: false }) studentFamilyComponent;
  public priceGrades: Array<any> = [];
  public isModoEdit: boolean = false;
  public submitted: boolean = false;
  public studentForm: FormGroup;
  public codesFamily: Array<any> = [];
  public nameParents: any = {};
  public mostrarFormEstudiantes: boolean = false;
  public mostrarNameParents: boolean = false;

  filteredOptions: Observable<string[]>;

  constructor(
    private _priceGradeService: PriceGradeService,
    private formBuilder: FormBuilder,
    private familyService: FamilyService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private router: Router
    
  ) { }

  ngOnInit(): void {
    this.getGradePrices();
    this.getCodesFamily();
    this.studentForm = this.formBuilder.group({
			codigoFamilia: [null],
      formStudent: [null, Validators.required],
      namePadre: [null],
      nameMadre: [null]
    })
  }

  get f() {
		return this.studentForm.controls;
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let existCodigoIngresado = this.codesFamily.map(codigo => codigo.codigoFamilia.toLowerCase()).indexOf(filterValue);
    if(existCodigoIngresado >= 0) {
      this.mostrarFormEstudiantes = true;
      this.getParents(value.toUpperCase());
    } else {
      this.mostrarNameParents = false;
      this.mostrarFormEstudiantes = false;
    }
    return this.codesFamily.filter(option => option.codigoFamilia.toLowerCase().includes(filterValue));
  }

  /**
   * Metodo para obtener los grados
   */
  getGradePrices() {
		// Obtener Price for Grade
		this._priceGradeService.getPriceGrades().subscribe(
			response => {
				if (response.priceGrades) {
					this.priceGrades = response.priceGrades;
				} else {
					console.log("Error get data");
				}
			},
			error => {
				console.log(error);
			}
		)
  }

  getParents(code: any) {
    this.familyService.getNameParents(code).subscribe(
      response => {
        this.nameParents = response.parents;
        this.mostrarNameParents = true;
        this.f.namePadre.setValue(this.nameParents.dad.name + ' ' + this.nameParents.dad.lastName);
        this.f.nameMadre.setValue(this.nameParents.mom.name + ' ' + this.nameParents.mom.lastName);
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo para obtener los codigos de Familia
   */
  public getCodesFamily(): void {
    this.familyService.getCodesFamily().subscribe(
      response => {
        this.codesFamily = response.codeFamily;        
        this.filteredOptions = this.f.codigoFamilia.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        console.log(response);
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo para guardar la estudiantes en una familia
   */
  public saveStudents():void {
    this.submitted = true;
    this.studentFamilyComponent.familyStudentForm.updateValueAndValidity();
    //this.f.formMom.setValue(this.momComponent.familyMomForm);
    this.f.formStudent.setValue(this.studentFamilyComponent.familyStudentForm);    
    if (this.studentForm.invalid || this.studentFamilyComponent.familyStudentForm.invalid) {
      Swal.fire({
        title: 'warning!',
        text: 'Todos los campos son requeridos...',
        icon: 'warning'
      });
      return;
		}
		if (this.studentForm.valid) { 
      let datosStudents = this.construirDatosStudent();
			let studentForm = {
				studentForm: datosStudents,
      }
      // return;
			this.studentService.saveStudent(studentForm).subscribe(
				res => {					
					Swal.fire({
						title: 'Exitoso!',
						text: 'Estudiantes creado correctamente',
						icon: 'success',
						confirmButtonText: 'Aceptar'
					});
					this.setFormFamily();
				},
				err => {
					console.log(err);
				}
			)
    }    
  }

  /**
	 * Método que permite construir los datos de los estudiantes
	 * para ser enviados
	 */
	public construirDatosStudent() {
		let camposStudent = [ 
      "gradeStudent", 
      "nameStudent", 
      "lastNameStudent", 
      "birthdayDateStudent", 
      "birthdayPlaceStudent", 
      "ciudadaniaStudent", 
      "insuranceSocialStudent", 
      "livewithStudent", 
      "hijoMaestroStudent", 
      "instruccionAnualStudent",
      "meses",
      "instruccionMensualStudent",
      "matriculaStudent",
      "seguroStudent",
      "cuidoStudent",
      "librosDigitalesStudent",
      "_idStudent"
    ];
		//var objStudent = {};
		var listStudents = [];
		var valueFormStudent = [];
		const birthDayStudents = this.studentFamilyComponent.birthDayStudents;
		valueFormStudent.push(this.studentForm.value.formStudent.value);
		for (let index = 0; index < this.studentFamilyComponent.listStudent.length; index++) {
			var posicionesControl = this.studentFamilyComponent.posicionesControl;

			const element = this.studentFamilyComponent.listStudent[index];
			let objStudent = {};

			element['students' + posicionesControl[index]].forEach((a, indice) => {
				objStudent[camposStudent[indice]] = valueFormStudent[0][a.label];
				if(a.label.indexOf("birthdayDateStudent") >= 0) {
					objStudent[camposStudent[indice]] = birthDayStudents[a.label];
        }
        if(a.label.indexOf("instruccionAnualStudent") >= 0) {
					objStudent[camposStudent[indice]] = objStudent[camposStudent[indice]].replace(/,/g , '');
				}
      });
      objStudent['codigoFamilia'] = this.f.codigoFamilia.value;
			listStudents.push(objStudent);
		}
		return listStudents;
  }
  
  private setFormFamily() {
		this.cdr.detectChanges();
    this.submitted = false;
    this.mostrarFormEstudiantes = false;
    this.mostrarNameParents = false;
		if(this.studentFamilyComponent) {
			this.studentFamilyComponent.familyStudentForm.reset();
    }
    this.f.codigoFamilia.setValue('');
    this.f.formStudent.reset();
		//this.studentForm.reset();
		//setFormStudent
		if(this.studentFamilyComponent && this.studentFamilyComponent.submitted) {
			this.studentFamilyComponent.items = [0];
			this.studentFamilyComponent.posicionesControl = [0];
			this.studentFamilyComponent.listStudent.length = 1;
		}		
  }

  /**
	 * Metodo que permite cambiar de vista para registrar una nueva familia
	 */
	public volver(): void {
    this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['student'] } }]);
	}
}
