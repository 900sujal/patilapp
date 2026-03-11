import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function AppModal({
  visible,
  message,
  type = "success",
  onClose,
}) {
  const config = {
    success: {
      icon: "check-circle",
      color: "#16A34A",
      title: "Success",
    },
    error: {
      icon: "x-circle",
      color: "#DC2626",
      title: "Error",
    },
    warning: {
      icon: "alert-triangle",
      color: "#F59E0B",
      title: "Warning",
    },
  };

  const current = config[type] || config.success;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${current.color}20` },
            ]}
          >
            <Feather name={current.icon} size={34} color={current.color} />
          </View>

          <Text style={[styles.title, { color: current.color }]}>
            {current.title}
          </Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: current.color }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
  },
  button: {
    minWidth: 120,
    height: 46,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});