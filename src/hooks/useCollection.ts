import React from 'react';
import { Collection } from '@luminix/core/dist/types/Collection';

/**
 * Hook to listen to the change event of a collection and update the state accordingly.
 * It returns a copy of the collection and updates the state when the collection changes.
 * **WARNING**: Both the collection and the transform function must be memoized using `React.useMemo` or `React.useCallback` to avoid unnecessary re-renders.
 * 
 * Usage:
 * ```tsx
 * import { collect } from '@luminix/core';
 * import { useCollection } from '@luminix/react';
 * 
 * const collection = collect([
 *     { name: 'iPhone 6', brand: 'Apple', type: 'phone', released: 2014 },
 *     { name: 'iPhone 5', brand: 'Apple', type: 'phone', released: 2012 },
 *     { name: 'Apple Watch', brand: 'Apple', type: 'watch', released: 2015 },
 *     { name: 'Galaxy S6', brand: 'Samsung', type: 'phone', released: 2015 },
 *     { name: 'Galaxy Gear', brand: 'Samsung', type: 'watch', released: 2013 },
 * ]);
 * 
 * const transform = (collection) => {
 *    return collection.where('released', '>', 2014);
 * };
 * 
 * const Component = () => {
 *     const items = useCollection(collection, transform);
 *
 *     return (
 *        <>
 *            <button
 *                onClick={() => {
 *                    collection.push({ name: 'Galaxy S7', brand: 'Samsung', type: 'phone', released: 2016 });
 *                }}
 *            >Add Galaxy S7</button>
 *            {items.map((item) => (
 *               <div key={item.name}>{item.name}</div>
 *            ))}
 *       </>
 * ```    
 * 
 * @param collection 
 * @param transform 
 * @returns 
 */
export default function useCollection<T>(collection: Collection<T>): Collection<T>;
export default function useCollection<T, V>(
    collection: Collection<T>,
    transform: (collection: Collection<T>) => V
): V;
export default function useCollection<T = unknown, V = T>(
    collection: Collection<T>,
    transform?: (collection: Collection<T>) => V
) {

    const [state, setState] = React.useState<Collection<T>|V>(
        transform 
            ? transform(collection.collect()) 
            : collection.collect()
    );

    const isMountingRef = React.useRef(false);

    // This is required for strict mode
    React.useEffect(() => {
        isMountingRef.current = true;
    }, []);

    React.useEffect(() => {
        if (!isMountingRef.current) {
            setState(
                transform 
                    ? transform(collection.collect())
                    : collection.collect()
            );
        } else {
            isMountingRef.current = false;
        }

        return collection.on('change', () => {
            setState(() => {
                return transform 
                    ? transform(collection.collect())
                    : collection.collect();
            });
        });
    }, [collection, transform]);

    return state;
}



