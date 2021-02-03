
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing,module';
import { MDBBootstrapModule, CheckboxModule, WavesModule, ButtonsModule, InputsModule, CardsModule, InputUtilitiesModule  } from 'angular-bootstrap-md';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginAuthGuard } from './guards/loginAuth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FamilyComponent } from './components/family/family.component';
import { PriceGradeComponent } from './components/price-grade/price-grade.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentFamilyComponent } from './components/family/student-family/student-family.component';
import { DadComponent } from './components/family/dad/dad.component';
import { MomComponent } from './components/family/mom/mom.component';
import { GuardianComponent } from './components/family/guardian/guardian.component';
import { TableFamilyComponent } from './components/family/table-family/table-family.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { EditFamilyComponent } from './components/family/edit-family/edit-family.component';
import { CreateFamilyComponent } from './components/family/create-family/create-family.component';
import { StudentComponent } from './components/student/student.component';
import { AdmissionFeeComponent } from './components/admission-fee/admission-fee.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { NumberDirective } from './directives/numbers-only.directive';
import { PhoneMaskDirective } from './directives/phone.directive';
import { SeguroSocialMaskDirective } from './directives/seguroSocial.directive';
import { ZipCodeMaskDirective } from './directives/zipCode.directive';
import { ReportesComponent } from './components/reportes/reportes.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerLoadingInterceptor } from './services/spinnerLoading.service';
import { DonationFeeComponent } from './components/donation-fee/donation-fee.component';
import { GraduationFeeComponent } from './components/graduation-fee/graduation-fee.component';
import { CuentaFamilyComponent } from './components/cuenta-family/cuenta-family.component';

// Material
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatExpansionModule } from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { DepositoComponent } from './components/deposito/deposito.component';
import { EditarGradoComponent } from './components/price-grade/editar-grado/editar-grado.component';
import { EditarAdmissionFeeComponent } from './components/admission-fee/editar-admission-fee/editar-admission-fee.component';
import { EditarDonationFeeComponent } from './components/donation-fee/editar-donation-fee/editar-donation-fee.component';
import { EditarGraduationFeeComponent } from './components/graduation-fee/editar-graduation-fee/editar-graduation-fee.component';
import { CrearEstudianteComponent } from './components/student/crear-estudiante/crear-estudiante.component';
import { EditarEstudianteComponent } from './components/student/editar-estudiante/editar-estudiante.component';
import { CrearDepositoComponent } from './components/deposito/crear-deposito/crear-deposito.component';
import { EditarEstadoCuentaComponent } from './components/deposito/editar-estado-cuenta/editar-estado-cuenta.component';
import { EditarPagoComponent } from './components/pagos/editar-pago/editar-pago.component';
import { SetFechaPipe } from './pipes/setFecha.pipe';
import { SetTipoPagoPipe } from './pipes/set-tipo-pago.pipe';
import { StartAnioComponent } from './components/dashboard/start-anio/start-anio.component';
import { ArchivarStudentComponent } from './components/student/archivar-student/archivar-student.component';
import { EditarDepositoComponent } from './components/deposito/editar-deposito/editar-deposito.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    FamilyComponent,
    PriceGradeComponent,
    NavbarComponent,
    StudentFamilyComponent,
    DadComponent,
    MomComponent,
    GuardianComponent,
    TableFamilyComponent,
    HomeDashboardComponent,
    EditFamilyComponent,
    CreateFamilyComponent,
    StudentComponent,
    AdmissionFeeComponent,
    PagosComponent,
    NumberDirective,
    PhoneMaskDirective,
    SeguroSocialMaskDirective,
    ZipCodeMaskDirective,
    ReportesComponent,
    DonationFeeComponent,
    GraduationFeeComponent,
    CuentaFamilyComponent,
    DepositoComponent,
    EditarGradoComponent,
    EditarAdmissionFeeComponent,
    EditarDonationFeeComponent,
    EditarGraduationFeeComponent,
    CrearEstudianteComponent,
    EditarEstudianteComponent,
    CrearDepositoComponent,
    EditarEstadoCuentaComponent,
    EditarPagoComponent,
    SetFechaPipe,
    SetTipoPagoPipe,
    StartAnioComponent,
    ArchivarStudentComponent,
    EditarDepositoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    CheckboxModule,
    WavesModule.forRoot(),
    ButtonsModule.forRoot(),
    InputsModule.forRoot(),
    CardsModule.forRoot(),
    InputUtilitiesModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    //Material
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    PhoneMaskDirective,
    SeguroSocialMaskDirective,
    ZipCodeMaskDirective,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    AuthService, 
    AuthGuard, 
    LoginAuthGuard, 
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerLoadingInterceptor, multi: true},
    // {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }