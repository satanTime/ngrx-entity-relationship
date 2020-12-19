import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';

import {Fight} from '../models';

@Injectable()
export class FightCollection extends EntityCollectionServiceBase<Fight> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Fight', serviceElementsFactory);
    }
}
