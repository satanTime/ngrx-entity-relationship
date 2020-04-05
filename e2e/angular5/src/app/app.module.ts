import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {StoreModule} from '@ngrx/store';
import {addressReducerFunc} from 'src/app/store/address/address.reducer';
import {companyReducerFunc} from 'src/app/store/company/company.reducer';
import {userReducerFunc} from 'src/app/store/user/user.reducer';

import {AppComponent} from './app.component';
import {EntityComponent} from './entity/entity.component';

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
