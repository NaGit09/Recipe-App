import { useMemo, useState } from "react";

export function useLocalSearch<T>(
    data: T[],
    filterFn: (item: T, query: string) => boolean,
) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((item) => filterFn(item, searchQuery));
    }, [data, searchQuery, filterFn]);

    return {
        searchQuery,
        setSearchQuery,
        filteredData,
    };
}
