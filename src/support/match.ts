
export default function match<T = unknown>(value: string, directives: Record<string, () => T>): T | null {
    return directives[value] ? directives[value]() : null;
}