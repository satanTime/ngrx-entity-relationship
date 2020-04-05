import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {EntityComponent} from './entity/entity.component';
import {addressReducerFunc} from './store/address/address.reducer';
import {companyReducerFunc} from './store/company/company.reducer';
import {userReducerFunc} from './store/user/user.reducer';

@NgModule({
    declarations: [AppComponent, EntityComponent],
    imports: [
        BrowserModule,
        StoreModule.forRoot({
            addresses: addressReducerFunc,
            companies: companyReducerFunc,
            users: userReducerFunc,
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
