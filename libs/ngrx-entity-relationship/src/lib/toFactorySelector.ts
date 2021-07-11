export function toFactorySelector<S, K, Props = any>(selector: {
    (state: S, ids: Props): K;
    release?: () => void;
}): {
    (ids: Props): {
        (state: S): K;
        release(): void;
    };
    release(): void;
} {
    const release = () => {
        if (typeof selector.release === 'function') {
            selector.release();
        }
    };

    const callback = (ids: Props) => {
        const storeSelector = (state: S) => selector(state, ids);
        storeSelector.release = release;

        return storeSelector;
    };
    callback.release = release;

    return callback;
}
