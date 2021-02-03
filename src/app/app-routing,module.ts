import {  NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginAuthGuard } from './guards/loginAuth.guard';
import { FamilyComponent } from './components/family/family.component';
import { PriceGradeComponent } from './components/price-grade/price-grade.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { EditFamilyComponent } from './components/family/edit-family/edit-family.component';
import { CreateFamilyComponent } from './components/family/create-family/create-family.component';
import { StudentComponent } from './components/student/student.component';
import { AdmissionFeeComponent } from './components/admission-fee/admission-fee.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DonationFeeComponent } from './components/donation-fee/donation-fee.component';
import { GraduationFeeComponent } from './components/graduation-fee/graduation-fee.component';
import { DepositoComponent } from './components/deposito/deposito.component';
import { CrearEstudianteComponent } from './components/student/crear-estudiante/crear-estudiante.component';
import { ArchivarStudentComponent } from './components/student/archivar-student/archivar-student.component';
import { EditarDepositoComponent } from './components/deposito/editar-deposito/editar-deposito.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent,        
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: HomeDashboardComponent, outlet: "procesoDashboard"},
            { path: 'edit-family/:code', component: EditFamilyComponent, outlet: "procesoDashboard"},
            { path: 'create-family', component: CreateFamilyComponent, outlet: "procesoDashboard"},
            { path: 'family', component: FamilyComponent, outlet: "procesoDashboard" },
            { path: 'priceGrade', component: PriceGradeComponent, outlet: "procesoDashboard"},
            { path: 'student', component: StudentComponent, outlet: "procesoDashboard"},
            { path: 'archivar-student', component: ArchivarStudentComponent, outlet: "procesoDashboard"},
            { path: 'create-student', component: CrearEstudianteComponent, outlet: "procesoDashboard"},
            { path: 'admission-fee', component: AdmissionFeeComponent, outlet: "procesoDashboard"},
            { path: 'donation-fee', component: DonationFeeComponent, outlet: "procesoDashboard"},
            { path: 'graduation-fee', component: GraduationFeeComponent, outlet: "procesoDashboard"},
            { path: 'pagos', component: PagosComponent, outlet: "procesoDashboard"},
            { path: 'depositos', component: DepositoComponent, outlet: "procesoDashboard"},
            { path: 'editar-deposito/:id', component: EditarDepositoComponent, outlet: "procesoDashboard"},
            { path: 'reportes', component: ReportesComponent, outlet: "procesoDashboard"}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }