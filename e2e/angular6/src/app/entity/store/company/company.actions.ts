import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';

import {Company} from './company.model';

export enum CompanyActionTypes {
    UPSERT = '[Company] Upsert Company',
    UPDATE = '[Company] Update Company',
}

export class UpsertCompany implements Action {
    readonly type = CompanyActionTypes.UPSERT;

    constructor(public payload: {company: Company}) {}
}

export class UpdateCompany implements Action {
    readonly type = CompanyActionTypes.UPDATE;

    constructor(public payload: {company: Update<Company>}) {}
}

export type CompanyActionsUnion = UpsertCompany | UpdateCompany;
