export function selectByIds<S, K, Props = any>(selector: (state: S, ids: Props) => K, ids: Props): (state: S) => K {
    return state => selector(state, ids);
}
