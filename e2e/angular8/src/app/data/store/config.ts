export function selectId(entity) {
    return entity.uuid;
}

export const entityConfig = {
    entityMetadata: {
        Hero: {
            selectId,
        },
        Villain: {
            selectId,
        },
        Fight: {},
    },
    pluralNames: {
        Hero: 'Heroes',
    },
};
