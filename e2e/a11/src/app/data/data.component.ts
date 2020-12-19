import {ChangeDetectionStrategy, Component} from '@angular/core';

import {EntityService} from './store/entity.service';
import {SelectorService} from './store/selector.service';

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent {
    constructor(public readonly selector: SelectorService, public readonly entitiesService: EntityService) {}
}
