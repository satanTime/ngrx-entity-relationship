declare const window: any;
declare const global: any;

// tslint:disable-next-line:no-typeof-undefined
const local = typeof global === 'undefined' ? window : global;

local['ngrx-entity-relationship-rootEntityFlags'] = local['ngrx-entity-relationship-rootEntityFlags'] || {
    disabled: false,
};

export const rootEntityFlags: {disabled: boolean} = local['ngrx-entity-relationship-rootEntityFlags'];
