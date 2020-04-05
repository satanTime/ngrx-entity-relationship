import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {Villain} from './data';

@Injectable({providedIn: 'root'})
export class DataVillainService extends EntityCollectionServiceBase<Villain> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Villain', serviceElementsFactory);
    }
}
