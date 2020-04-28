import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';

import {Hero} from '../models';

@Injectable()
export class HeroCollection extends EntityCollectionServiceBase<Hero> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Hero', serviceElementsFactory);
    }
}
