import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View, StyleSheet, Text } from 'react-native';
import { emailKey, pinKey, pinReg } from './constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import * as LocalAuthentication from 'expo-local-authentication';

const SignIn = ({ navigation }: any): JSX.Element => {
    const inputRef = useRef<TextInput>(null);
    const [code, setCode] = useState<string>('');
    const CODE_LENGTH = 6;

    const _focus = () => inputRef.current?.focus && inputRef.current?.focus();

    useEffect(() => {
        const getEnrollment = async () => {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (isEnrolled) {
                const { success } = await LocalAuthentication.authenticateAsync({ promptMessage: 'Authenticate' });
                if (success) verifyPin(true);
            }
        };
        getEnrollment();
    }, [])

    useEffect(() => {
        if (pinReg.test(code) && code.length === CODE_LENGTH) {
            verifyPin();
        }
    }), [code];

    const verifyPin = async (bypassPin = false) => {
        try {
            const values = await AsyncStorage.multiGet([emailKey, pinKey]);
            if (values[0][1] !== null && values[1][1] !== null) {
                if (bypassPin) {
                    console.log(values[0][1]);
                    console.log(values[1][1]);
                    signIn(values[0][1], values[1][1]);
                } else if (values[1][1] === code) {
                    console.log(values[0][1]);
                    console.log(values[1][1]);
                    signIn(values[0][1], values[1][1]);
                }
            }
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    const signIn = async (email: string, pin: string) => {
        await signInWithEmailAndPassword(auth, email, pin).then((userCredentials) => {
            console.log(userCredentials);
            navigation.navigate('Home');
        }).catch((error) => {
            console.log(JSON.stringify(error));
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sign in with your pin</Text>
            <Pressable onPress={() => _focus()}>
                <View style={styles.row}>
                    {[
                        ...new Array(CODE_LENGTH).fill(null).map((_, i) => (
                            <View key={i} style={{ ...styles.pinElement, ...(code && i < code.length && styles.activePinElement) }} />
                        )),
                    ]}
                    <TextInput autoFocus style={styles.invisible} keyboardType='number-pad' maxLength={6} ref={inputRef} value={code} onChangeText={setCode} />
                </View>
            </Pressable>
        </View>
    )
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 15,
    },
    pinElement: {
        marginRight: 5,
        borderRadius: 12,
        width: 30,
        height: 35,
        backgroundColor: '#5AA469',
        borderWidth: 1,
        borderColor: '#D35D6E',
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        marginBottom: 15,
    },
    activePinElement: {
        backgroundColor: '#D35D6E',
    },
    row: {
        flexDirection: 'row',
    },
    invisible: {
        width: 0,
        height: 0,
    }
});