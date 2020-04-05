import {Component, OnInit} from '@angular/core';
import {HeroService} from './hero.service';
import {VillainService} from './villain.service';
import {SelectorService} from './selector.service';

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
    constructor(
        public readonly heroService: HeroService,
        public readonly villainService: VillainService,
        public readonly selector: SelectorService,
    ) {}

    ngOnInit() {
        this.heroService.add({
            id: '11',
            heroName: 'Hero 1',
            villainId: '13',
        });
        this.heroService.add({
            id: '12',
            heroName: 'Hero 2',
            villainId: '13',
        });
        this.villainService.add({
            id: '13',
            villainName: 'Villain 3',
        });
        this.villainService.add({
            id: '14',
            villainName: 'Villain 4',
        });
        this.heroService.getAll();
    }
}
