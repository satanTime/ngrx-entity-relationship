declare const window: unknown;
declare const global: unknown;

(window || (global as any))['ngrx-entity-relationship-rootEntityFlags'] = (window || (global as any))[
    'ngrx-entity-relationship-rootEntityFlags'
] || {
    disabled: false,
};

export const rootEntityFlags: {disabled: boolean} = (window || (global as any))[
    'ngrx-entity-relationship-rootEntityFlags'
];
