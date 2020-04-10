import {of, Subject} from 'rxjs';

import {relationships} from '../../src';
import {HANDLER_ROOT_ENTITY, UNKNOWN} from '../../src/types';

describe('operators/relationships', () => {
    type Entity = {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string | number;
    };

    it('returns undefined on undefined', doneFn => {
        const store$ = new Subject();
        const store = {
            select: jasmine.createSpy().and.returnValue(store$),
        };
        const selector: HANDLER_ROOT_ENTITY<UNKNOWN, Entity, UNKNOWN> = <any>jasmine.createSpy();
        selector.ngrxEntityRelationship = 'spy';

        of(undefined)
            .pipe(relationships(store, selector))
            .subscribe(actual => {
                expect(actual).toBeUndefined();
                doneFn();
            });
    });

    it('returns result of the selector for a single entity', doneFn => {
        const store$ = new Subject();
        const store = {
            select: jasmine.createSpy().and.returnValue(store$),
        };
        const selector: HANDLER_ROOT_ENTITY<UNKNOWN, Entity, UNKNOWN> = <any>jasmine.createSpy();
        selector.ngrxEntityRelationship = 'spy';

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };
        const expected = Symbol();

        of(entity)
            .pipe(relationships(store, selector))
            .subscribe(actual => {
                expect(actual).toBe(expected as any);
                expect(store.select).toHaveBeenCalledWith(selector, 'id1');
                store$.complete();
                doneFn();
            });

        store$.next(expected);
    });

    it('returns result of the selector for an array of entities', doneFn => {
        const store$ = new Subject();
        const store = {
            select: jasmine.createSpy().and.returnValue(store$),
        };
        const selector: HANDLER_ROOT_ENTITY<UNKNOWN, Array<Entity>, UNKNOWN> = <any>jasmine.createSpy();
        selector.ngrxEntityRelationship = 'spy';

        const entity1: Entity = {
            id: 'id1',
            name: 'name1',
        };
        const entity2: Entity = {
            id: 'id2',
            name: 'name2',
        };
        const expected = [Symbol(), Symbol()];

        of([entity1, entity2])
            .pipe(relationships(store, selector))
            .subscribe(actual => {
                expect(actual).toBe(expected as any);
                expect(store.select).toHaveBeenCalledWith(selector, ['id1', 'id2']);
                store$.complete();
                doneFn();
            });

        store$.next(expected);
    });
});
