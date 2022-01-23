export const undefinedSafe = <T>(object: T | undefined, defaultOpt: T): T => {
    if (object === null || object === undefined) {
        return defaultOpt;
    }
    return object;
};
