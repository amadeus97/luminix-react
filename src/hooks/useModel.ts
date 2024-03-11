import { Model, model } from "@luminix/core";

export default function useModel(abstract: string): typeof Model;
export default function useModel(abstract: string[]): (typeof Model)[];
export default function useModel(abstract: string | string[]) {
    if (Array.isArray(abstract)) {
        return abstract.map((a) => model(a));
    }
    return model(abstract);
}
