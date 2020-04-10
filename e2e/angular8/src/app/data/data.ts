import {EntityMetadataMap} from '@ngrx/data';

const data: EntityMetadataMap = {
    Hero: {},
    Villain: {},
    HeroUuid: {
        selectId: entity => entity.uuid,
    },
    VillainUuid: {
        selectId: entity => entity.uuid,
    },
};

export interface Hero {
    id: string;
    heroName: string;
    villain?: Villain;
    villainId?: string;
}

export interface Villain {
    id: string;
    villainName: string;
    heroes?: Hero[];
}

export interface HeroUuid {
    uuid: string;
    heroName: string;
    villain?: VillainUuid;
    villainId?: string;
}

export interface VillainUuid {
    uuid: string;
    villainName: string;
    heroes?: HeroUuid[];
    hero?: HeroUuid;
}

const pluralNames = {Hero: 'Heroes'};

export const entityConfig = {
    entityMetadata: data,
    pluralNames,
};
