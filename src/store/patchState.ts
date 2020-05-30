import {UNKNOWN} from '../types';

const func = <T extends any>(state: T, source: UNKNOWN, destination: UNKNOWN): T => {
    if (source === destination) {
        return state;
    }
    if (state === null) {
        return state;
    }
    if (typeof state !== 'object') {
        return state;
    }

    for (const key of Object.keys(state)) {
        if (typeof state[key] !== 'object' || state[key] === null) {
            continue;
        }

        if (state[key] === source) {
            return {
                ...state,
                [key]: destination,
            };
        }

        const patchedState = func(state[key], source, destination);
        if (patchedState !== state[key]) {
            return {
                ...state,
                [key]: patchedState,
            };
        }
    }

    return state;
};

export const patchState = {
    func,
};
