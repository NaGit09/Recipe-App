import { useCallback, useState } from "react";

export function useSnackbar() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    const showSnackbar = useCallback((msg: string) => {
        setMessage(msg);
        setVisible(true);
    }, []);

    const hideSnackbar = useCallback(() => {
        setVisible(false);
    }, []);

    return {
        visible,
        message,
        showSnackbar,
        hideSnackbar,
    };
}
