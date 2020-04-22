import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EntityDataModule} from '@ngrx/data';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {entityConfig} from './data/data';
import {DataComponent} from './data/data.component';
import {EntityComponent} from './entity/entity.component';
import {EntitiesEffects} from './store/entities.effects';
import {EntitiesService} from './store/entities.service';
import {reducers} from './store/reducers';

@NgModule({
    declarations: [AppComponent, DataComponent, EntityComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        EntityDataModule.forRoot(entityConfig),
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([EntitiesEffects]),
    ],
    bootstrap: [AppComponent],
    providers: [EntitiesService],
})
export class AppModule {}
