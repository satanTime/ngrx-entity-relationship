import {iif, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {HANDLER_ROOT_ENTITY, STORE_INSTANCE} from '../types';

export function relationships<STORE, ENTITY>(
    store: STORE_INSTANCE<STORE>,
    selector: HANDLER_ROOT_ENTITY<STORE, Array<ENTITY>, any>,
): (next: Observable<Array<ENTITY>>) => Observable<Array<ENTITY>>;

export function relationships<STORE, ENTITY>(
    store: STORE_INSTANCE<STORE>,
    selector: HANDLER_ROOT_ENTITY<STORE, ENTITY, any>,
): (next: Observable<ENTITY>) => Observable<ENTITY>;

export function relationships<STORE, SET, TYPES>(
    store: STORE_INSTANCE<STORE>,
    selector: HANDLER_ROOT_ENTITY<STORE, SET, TYPES>,
): (next: Observable<SET>) => Observable<SET> {
    return (next: Observable<SET>): Observable<SET> =>
        next.pipe(
            switchMap(input => {
                const result = of(input);
                return iif(
                    () => input === undefined,
                    result,
                    result.pipe(
                        map(set => {
                            if (Array.isArray(set)) {
                                return (set.map(item => item.id) as any) as TYPES;
                            }
                            return (<any>set).id as TYPES;
                        }),
                        switchMap(id => store.select(selector, id)),
                        map(output => (output ? output : input)),
                    ),
                );
            }),
        );
}
