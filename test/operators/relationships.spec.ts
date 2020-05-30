import {HANDLER_ROOT_ENTITIES, HANDLER_ROOT_ENTITY, relationships} from 'ngrx-entity-relationship';
import {UNKNOWN} from 'ngrx-entity-relationship/dist/types';
import {of, Subject} from 'rxjs';

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
        const selector: HANDLER_ROOT_ENTITY<UNKNOWN, Entity, Entity, UNKNOWN> = <any>jasmine.createSpy();
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
        const selector: HANDLER_ROOT_ENTITY<UNKNOWN, Entity, Entity, UNKNOWN> = <any>jasmine.createSpy();
        selector.ngrxEntityRelationship = 'spy';
        selector.idSelector = jasmine.createSpy('idSelector').and.returnValue('hello');

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };
        const expected = Symbol();

        of(entity)
            .pipe(relationships(store, selector))
            .subscribe(actual => {
                expect(actual).toBe(expected as any);
                expect(selector.idSelector).toHaveBeenCalledWith(entity);
                expect(store.select).toHaveBeenCalledWith(selector, 'hello');
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
        const selector: HANDLER_ROOT_ENTITIES<UNKNOWN, Entity, Entity, UNKNOWN> = <any>jasmine.createSpy();
        selector.ngrxEntityRelationship = 'spy';
        selector.idSelector = jasmine.createSpy('idSelector').and.returnValues('hello1', 'hello2');

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
                expect(selector.idSelector).toHaveBeenCalledWith(entity1);
                expect(selector.idSelector).toHaveBeenCalledWith(entity2);
                expect(store.select).toHaveBeenCalledWith(selector, ['hello1', 'hello2']);
                store$.complete();
                doneFn();
            });

        store$.next(expected);
    });
});
