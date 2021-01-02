import {createAction} from '@reduxjs/toolkit';

import {Company} from './company.model';

export enum CompanyActionTypes {
    UPSERT = '[Company] Upsert Company',
    UPDATE = '[Company] Update Company',
}

export const upsertCompany = createAction(CompanyActionTypes.UPSERT, (payload: {company: Company}) => ({payload}));

export const updateCompany = createAction(
    CompanyActionTypes.UPDATE,
    (payload: {company: {id: string; changes: Partial<Company>}}) => ({payload}),
);
