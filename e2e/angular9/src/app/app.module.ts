import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EntityDataModule} from '@ngrx/data';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {entityConfig} from './data/data';
import {DataComponent} from './data/data.component';
import {DataInterceptor} from './data/data.interceptor';
import {EntityComponent} from './entity/entity.component';
import {addressReducerFunc} from './store/address/address.reducer';
import {companyReducerFunc} from './store/company/company.reducer';
import {userReducerFunc} from './store/user/user.reducer';

@NgModule({
    declarations: [AppComponent, EntityComponent, DataComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot({
            addresses: addressReducerFunc,
            companies: companyReducerFunc,
            users: userReducerFunc,
        }),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot(entityConfig),
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: DataInterceptor, multi: true}],
    bootstrap: [AppComponent],
})
export class AppModule {}
