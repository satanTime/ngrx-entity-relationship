import {EntityMetadataMap} from '@ngrx/data';

const data: EntityMetadataMap = {
    Hero: {},
    Villain: {},
};

export interface Hero {
    id: string;
    name: string;
    villain?: Villain;
    villainId?: string;
}

export interface Villain {
    id: string;
    name: string;
    heroes?: Hero[];
}

const pluralNames = {Hero: 'Heroes'};

export const entityConfig = {
    entityMetadata: data,
    pluralNames,
};
