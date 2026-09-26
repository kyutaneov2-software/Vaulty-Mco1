import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

import { Modal, Pressable, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { noticeStyles as styles } from "../styles/notice.styles";
import { colors } from "../constants/theme";

type NoticeType = "success";

type Notice = {
    type: NoticeType;
    title: string;
    message: string;
    buttonLabel?: string;
};

type NoticeContextValue = {
    showSuccessNotice: (
        title: string,
        message: string,
        buttonLabel?: string,
    ) => void;
    hideNotice: () => void;
};

type NoticeProviderProps = {
    children: ReactNode;
};

const NoticeContext = createContext<NoticeContextValue | undefined>(undefined);

/* =========================================================
   COMPONENT: NoticeProvider

   Provides a global Vaulty success popup that remains
   visible even when Expo Router changes screens.
========================================================= */
export function NoticeProvider({ children }: NoticeProviderProps) {
    const [notice, setNotice] = useState<Notice | null>(null);

    /* =========================================================
       FUNCTION: showSuccessNotice

       Displays a Vaulty-styled success popup.
    ========================================================= */
    const showSuccessNotice = useCallback(
        (title: string, message: string, buttonLabel = "Continue") => {
            setNotice({
                type: "success",
                title,
                message,
                buttonLabel,
            });
        },
        [],
    );

    /* =========================================================
       FUNCTION: hideNotice

       Closes the currently displayed notice.
    ========================================================= */
    const hideNotice = useCallback(() => {
        setNotice(null);
    }, []);

    return (
        <NoticeContext.Provider
            value={{
                showSuccessNotice,
                hideNotice,
            }}
        >
            {children}

            <Modal
                visible={!!notice}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={hideNotice}
            >
                <View style={styles.overlay}>
                    <View style={styles.card} accessibilityViewIsModal>
                        <View style={styles.iconWrapper}>
                            <Ionicons
                                name="checkmark"
                                size={30}
                                color={colors.white}
                            />
                        </View>

                        <Text style={styles.eyebrow}>VAULTY</Text>

                        <Text style={styles.title}>{notice?.title}</Text>

                        <Text style={styles.message}>{notice?.message}</Text>

                        <Pressable
                            onPress={hideNotice}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {notice?.buttonLabel ?? "Continue"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </NoticeContext.Provider>
    );
}

/* =========================================================
   FUNCTION: useNotice

   Provides access to the global Vaulty notification system.
========================================================= */
export function useNotice() {
    const context = useContext(NoticeContext);

    if (!context) {
        throw new Error("useNotice must be used inside a NoticeProvider.");
    }

    return context;
}
