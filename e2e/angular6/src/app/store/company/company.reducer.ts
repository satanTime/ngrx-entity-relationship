import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {CompanyActionsUnion, CompanyActionTypes} from './company.actions';
import {Company} from './company.model';

export interface State extends EntityState<Company> {
    selectedId: string;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: State = adapter.getInitialState({
    selectedId: 'company3',
});

export function reducer(state: State = initialState, action: CompanyActionsUnion) {
    switch (action.type) {
        case CompanyActionTypes.UPSERT:
            return adapter.upsertOne(action.payload.company, state);
        case CompanyActionTypes.UPDATE:
            return adapter.updateOne(action.payload.company, state);
    }

    return state;
}
