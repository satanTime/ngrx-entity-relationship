import {createReducer, Dictionary} from '@reduxjs/toolkit';

import {updateCompany, upsertCompany} from './company.actions';
import {Company} from './company.model';

export interface CompanyState {
    ids: Array<string> | Array<number>;
    entities: Dictionary<Company>;
    selectedId: string;
}

export const initialState: CompanyState = {
    ids: [],
    entities: {},
    selectedId: 'company3',
};

export const companyReducer = createReducer(initialState, builder => {
    builder
        .addCase(upsertCompany, (state, action) => {
            return {
                ...state,
                id: [...state.ids],
                entities: {
                    ...state.entities,
                    [action.payload.company.id]: action.payload.company,
                },
            };
        })
        .addCase(updateCompany, (state, action) => {
            const entity: Company = {
                ...state.entities[action.payload.company.id],
                ...action.payload.company.changes,
            } as any;

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.company.id]: entity,
                },
            };
        });
});
