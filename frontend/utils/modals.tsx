import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomAlertProps {
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type, title, message, onClose }) => {
    // Icon and color based on the alert type
    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'info';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return '#4CAF50'; // Green
            case 'error':
                return '#F44336'; // Red
            case 'warning':
                return '#FF9800'; // Orange
            case 'info':
                return '#2196F3'; // Blue
            default:
                return '#2196F3'; // Blue
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#d4edda'; // Light Green
            case 'error':
                return '#f8d7da'; // Light Red
            case 'warning':
                return '#fff3cd'; // Light Yellow
            case 'info':
                return '#d1ecf1'; // Light Blue
            default:
                return '#d1ecf1'; // Light Blue
        }
    };

    // Automatically close the alert after 4 seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);

            return () => clearTimeout(timer); // Clear the timer if the component unmounts or visibility changes
        }
    }, [visible, onClose]);

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.alertContainer, { backgroundColor: getBackgroundColor() }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                        <Icon name="close" size={20} color="#333" />
                    </TouchableOpacity>
                    <Icon name={getIconName()} size={40} color={getColor()} />
                    <Text style={[styles.title, { color: getColor() }]}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: getColor() }]}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
        width: 300,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 15,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomAlert;
