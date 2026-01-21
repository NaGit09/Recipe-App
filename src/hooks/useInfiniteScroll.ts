import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface UseInfiniteScrollProps {
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    threshold?: number;
}

export function useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore,
    threshold = 20,
}: UseInfiniteScrollProps) {
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

        const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - threshold;

        if (isCloseToBottom && hasMore && !isLoading) {
            onLoadMore();
        }
    };

    return { handleScroll };
}
