import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {VillainUuid} from './data';

@Injectable({providedIn: 'root'})
export class VillainUuidService extends EntityCollectionServiceBase<VillainUuid> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('VillainUuid', serviceElementsFactory);
    }
}
