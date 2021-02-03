import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent } from "angular-bootstrap-md";
import { FamilyService } from '../../../services/family.service';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-family',
  templateUrl: './table-family.component.html'
})
export class TableFamilyComponent implements OnInit, AfterViewInit {

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  public families: Array<any> = [];
  public searchText: string = '';

  elements: any = [];
  headElements = ['Codigo Familia', 'Padre', 'Madre', '# Estudiantes', 'Acciones'];

  constructor(
    private cdRef: ChangeDetectorRef,
    private familyService: FamilyService,
    private router: Router
    //private route: ActivatedRoute
  ) { }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit(): void {
    this.getFamiliesForTable();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(8);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Metodo que obtiene las familias
   */
  private getFamiliesForTable() {
    // Obtener Familias    
		this.familyService.getFamiliesForTable().subscribe(
			response => {
        this.families = response.families;
        this.mdbTable.setDataSource(this.families);
        this.elements = this.mdbTable.getDataSource();
			},
			error => {
				console.log(error);
			}
		)
  }

  public editFamily(family: any): void {
    this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['edit-family', family.codigoFamilia] } }]);
  }

  /**
   * Metodo que permite buscar en la tabla por codigo de familia
   */

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
        this.mdbTable.setDataSource(this.elements);
        this.families = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
        this.families = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['codigoFamilia', 'apellidoPadre']);
        this.mdbTable.setDataSource(prev);
    }
}

  /**
   * Metodo que permite eliminar familia
   * @param family familia
   */
  public deleteFamily(family: any): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara la familia y todos sus datos asociados!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.familyService.deleteFamily(family._id).subscribe(
          response => {
            if(response.status) {
              Swal.fire({
                title: 'Exitoso!',
                text: 'Familia ' + response.family + ' eliminada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.getFamiliesForTable();
            }
          },
          error => {
            console.log(error);
          }
        )        
      }
    })
    
  }

  // public goCuenta(family: any):void {
  //   //let ultimoEstadoCuenta = family.estadoCuenta[family.estadoCuenta.length - 1];
  //   this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['edit-cuenta', family.codigoFamilia] } }]);
  // }

}
