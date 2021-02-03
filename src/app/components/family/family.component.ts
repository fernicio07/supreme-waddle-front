import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamilyService } from '../../services/family.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-family',
	templateUrl: './family.component.html'
})
export class FamilyComponent implements OnInit {


	constructor(
		private router: Router,
		private familyService: FamilyService
	) { }

	ngOnInit(): void {
	}

	/**
	 * Metodo que permite cambiar de vista para registrar una nueva familia
	 */
	public createFamily(): void {
		this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['create-family'] } }]);	
	}

	public crearRecargoFamily(): void {
		Swal.fire({
			title: '¿Estas seguro?',
			text: "Se crearan recargos",
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!'
		}).then((result) => {
			if (result.value) {
				this.familyService.crearRecargoFamily().subscribe(
					response => {
						if(response.status) {
							Swal.fire({
								title: 'Exitoso!',
								text: 'Se han creado recargos',
								icon: 'success',
								confirmButtonText: 'Aceptar'
							});
						}
					},
					error => {
						console.log(error);
					}
				)
			}
		})
	}
}
