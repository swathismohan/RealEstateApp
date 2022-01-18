import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyeronboardingComponent } from './buyeronboarding/buyeronboarding.component';
import { CustomeronboardingComponent } from './customeronboarding/customeronboarding.component';
import { StartComponent } from './start/start.component';
import { CustomerprofileComponent } from './customerprofile/customerprofile.component';
import { BuyerprofileComponent } from './buyerprofile/buyerprofile.component';


const routes: Routes = [
{ path: '', component: StartComponent},
{ path: 'customeronboarding', component: CustomeronboardingComponent },
{ path: 'buyeronboarding', component: BuyeronboardingComponent },
{ path: 'customerprofile', component: CustomerprofileComponent },
{ path: 'buyerprofile', component: BuyerprofileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

