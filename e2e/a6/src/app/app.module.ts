import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ngrxEntityRelationshipReducer} from 'ngrx-entity-relationship';

import {AppComponent} from './app.component';
import {EntityModule} from './entity/entity.module';
import {EntityService} from './entity/store/entity.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot(
            {},
            {
                metaReducers: [ngrxEntityRelationshipReducer],
            },
        ),
        EffectsModule.forRoot([]),
        EntityModule,
    ],
    bootstrap: [AppComponent],
    providers: [EntityService],
})
export class AppModule {}
