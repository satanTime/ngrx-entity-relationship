import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {CompanyActionTypes, UpdateCompany, UpsertCompany} from './company.actions';
import {Company} from './company.model';

export interface State extends EntityState<Company> {
    selectedId: string;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: State = adapter.getInitialState({
    selectedId: 'company3',
});

export function reducer(state: State | undefined = initialState, action: Action): State {
    switch (action.type) {
        case CompanyActionTypes.UPSERT:
            return adapter.upsertOne((<UpsertCompany>action).payload.company, state);
        case CompanyActionTypes.UPDATE:
            return adapter.updateOne((<UpdateCompany>action).payload.company, state);
    }

    return state;
}
