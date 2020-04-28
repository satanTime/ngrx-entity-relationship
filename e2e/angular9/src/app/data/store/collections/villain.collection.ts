import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';

import {Villain} from '../models';

@Injectable()
export class VillainCollection extends EntityCollectionServiceBase<Villain> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Villain', serviceElementsFactory);
    }
}
