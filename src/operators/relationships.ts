import {iif, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {HANDLER_ROOT_ENTITIES, HANDLER_ROOT_ENTITY, ID_TYPES, STORE_INSTANCE} from '../types';

export function relationships<STORE, ENTITY>(
    store: STORE_INSTANCE<STORE>,
    selector: HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES>,
): (next: Observable<Array<ENTITY>>) => Observable<Array<ENTITY>>;

export function relationships<STORE, ENTITY>(
    store: STORE_INSTANCE<STORE>,
    selector: HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES>,
): (next: Observable<ENTITY>) => Observable<ENTITY>;

export function relationships<STORE, SET, TYPES>(
    store: STORE_INSTANCE<STORE>,
    selector: HANDLER_ROOT_ENTITY<STORE, SET, TYPES>,
): (next: Observable<SET>) => Observable<undefined | SET> {
    return next =>
        next.pipe(
            switchMap(input => {
                const result = of(input);
                return iif(
                    () => input === undefined,
                    result,
                    result.pipe(
                        map(set => {
                            if (Array.isArray(set)) {
                                return (set.map(entity => selector.idSelector(entity)) as any) as TYPES;
                            }
                            return (selector.idSelector(set) as any) as TYPES;
                        }),
                        switchMap(id => store.select(selector, id)),
                    ),
                );
            }),
        );
}
