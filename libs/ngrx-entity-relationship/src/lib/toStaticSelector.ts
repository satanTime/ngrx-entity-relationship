import {toFactorySelector} from './toFactorySelector';

export function toStaticSelector<S, K, Props = any>(
    selector: {
        (state: S, ids: Props): K;
        release?: () => void;
    },
    ids: Props,
): {
    (state: S): K;
    release(): void;
} {
    return toFactorySelector(selector)(ids);
}
