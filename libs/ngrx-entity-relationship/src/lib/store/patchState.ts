import {UNKNOWN} from '../types';
import {isObject, objectKeys} from '../utils';

const func = <T>(state: T, source: UNKNOWN, destination: UNKNOWN): T => {
    if (source === destination) {
        return state;
    }
    if (!isObject(state)) {
        return state;
    }

    for (const key of objectKeys(state)) {
        if (!isObject(state[key])) {
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
