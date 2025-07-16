// SearchUtils.ts

export type TreeNode = {
    [key: string]: any;
};

export function searchTree<T>(
    nodes: T[],
    query: string,
    getName: (node: T) => string,
    getId: (node: T) => string,
    getChildren: (node: T) => T[] | undefined
): Set<string> {
    const matchedIds = new Set<string>();

    const matchAndCollect = (node: T): boolean => {
        const name = getName(node);
        const children = getChildren(node);
        const matched = name.toLowerCase().includes(query.toLowerCase());

        if (matched) {
            matchedIds.add(getId(node));
        }

        children?.forEach((child) => {
            const childMatch = matchAndCollect(child);
            if (childMatch) {
                matchedIds.add(getId(node));
            }
        });

        return matched || (children?.some((child) => matchedIds.has(getId(child))) ?? false);
    };

    nodes.forEach(matchAndCollect);
    return matchedIds;
}
