import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {DataModule} from './data/data.module';
import {EntityModule} from './entity/entity.module';
import {EntityService} from './entity/store/entity.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),

        EntityModule,
        DataModule,
    ],
    bootstrap: [AppComponent],
    providers: [EntityService],
})
export class AppModule {}
