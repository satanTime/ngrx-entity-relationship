import {Action} from '@ngrx/store';

import {Company} from './company.model';

export enum CompanyActionTypes {
    UPSERT = '[Company] Upsert Company',
}

export class UpsertCompany implements Action {
    readonly type = CompanyActionTypes.UPSERT;

    constructor(public payload: {company: Company}) {}
}

export type CompanyActionsUnion = UpsertCompany;
