import React from "react";
import { View, Modal as RNModal, ModalProps } from "react-native";

type CustomModalProps = ModalProps & {
  isOpen: boolean;
  children: React.ReactNode;
};

export default function CustomModal({
  children,
  isOpen,
  ...props
}: CustomModalProps) {
  return (
    <RNModal
      visible={isOpen}
      animationType="fade"
      statusBarTranslucent
      transparent
      {...props}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(255, 255, 255,0.1)", justifyContent: 'center', alignItems: "center" }}>
        {children}
      </View>
    </RNModal>
  );
}
