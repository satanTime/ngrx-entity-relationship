export function selectId(entity: {uuid: string}): string {
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
