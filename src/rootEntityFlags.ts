declare const window: any;
declare const global: any;

if (window) {
    window.global = window;
}

if (!global['ngrx-entity-relationship-rootEntityFlags']) {
    global['ngrx-entity-relationship-rootEntityFlags'] = {
        disabled: false,
    };
}

export const rootEntityFlags: {disabled: boolean} = global['ngrx-entity-relationship-rootEntityFlags'];
