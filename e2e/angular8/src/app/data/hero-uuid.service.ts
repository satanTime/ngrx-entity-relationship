import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {HeroUuid} from './data';

@Injectable({providedIn: 'root'})
export class HeroUuidService extends EntityCollectionServiceBase<HeroUuid> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('HeroUuid', serviceElementsFactory);
    }
}
