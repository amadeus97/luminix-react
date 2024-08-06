

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function match<T extends Record<string, () => any>, K extends keyof T>(
    value: K,
    directives: T,
): ReturnType<T[K]>
{
    return directives[value](); // ? directives[value]() : null;
}


