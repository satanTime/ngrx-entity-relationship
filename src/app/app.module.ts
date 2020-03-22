import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {addressReducerFunc} from 'src/app/store/address/address.reducer';
import {companyReducerFunc} from 'src/app/store/company/company.reducer';
import {userReducerFunc} from 'src/app/store/user/user.reducer';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      addresses: addressReducerFunc,
      companies: companyReducerFunc,
      users: userReducerFunc,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
