import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
    DialogLegalBuyer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    HttpClientModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
