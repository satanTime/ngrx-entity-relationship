export const selectByIds = <S, K, Props = any>(
    selector: (state: S, ids: Props) => K,
    ids: Props,
): ((state: S) => K) => state => selector(state, ids);
