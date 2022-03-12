import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyeronboardingComponent } from './buyeronboarding/buyeronboarding.component';
import { CustomeronboardingComponent } from './customeronboarding/customeronboarding.component';
import { StartComponent } from './start/start.component';
import { CustomerprofileComponent } from './customerprofile/customerprofile.component';
import { BuyerprofileComponent } from './buyerprofile/buyerprofile.component';
import { PropertyComponent } from './property/property.component';
import { AdminComponent } from './admin/admin.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';


const routes: Routes = [
  { path: '', component: StartComponent},
  { path: 'customeronboarding', component: CustomeronboardingComponent },
  { path: 'customeronboarding/:customerId', component: CustomeronboardingComponent },
  { path: 'buyeronboarding', component: BuyeronboardingComponent },
  { path: 'buyeronboarding/:buyerId', component: BuyeronboardingComponent },
  { path: 'customer/:customerId', component: CustomerprofileComponent },
  { path: 'buyer/:buyerId', component: BuyerprofileComponent},
  { path: 'property/:propertyId/bids', component: PropertyComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'adminpage', component: AdminPageComponent},
  { path: 'edit/property/:propertyId', component: EditPropertyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

