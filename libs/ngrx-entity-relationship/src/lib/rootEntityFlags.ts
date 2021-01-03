declare const window: any;
declare const global: any;

// istanbul ignore else
if (window) {
    window.global = window;
}

// istanbul ignore else
if (!global['ngrx-entity-relationship-rootEntityFlags']) {
    global['ngrx-entity-relationship-rootEntityFlags'] = {
        disabled: false,
    };
}

export const rootEntityFlags: {disabled: boolean} = global['ngrx-entity-relationship-rootEntityFlags'];
