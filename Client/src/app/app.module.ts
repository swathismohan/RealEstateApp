import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { StartComponent } from './start/start.component';
import { CustomeronboardingComponent } from './customeronboarding/customeronboarding.component';
import { BuyeronboardingComponent } from './buyeronboarding/buyeronboarding.component';
import { CustomerprofileComponent, DialogLegalCustomer } from './customerprofile/customerprofile.component';
import { BuyerprofileComponent, DialogLegalBuyer } from './buyerprofile/buyerprofile.component';
import { PropertyComponent } from './property/property.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { DialogContactDetails } from './buyerprofile/buyerprofile.component';
import { DialogBuyerDetails } from './property/property.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StartComponent,
    CustomeronboardingComponent,
    BuyeronboardingComponent,
    CustomerprofileComponent,
    BuyerprofileComponent,
    PropertyComponent,
    AdminComponent,
    AdminPageComponent,
    DialogLegalCustomer,
    DialogLegalBuyer,
    EditPropertyComponent,
    DialogContactDetails,
    DialogBuyerDetails
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    HttpClientModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
