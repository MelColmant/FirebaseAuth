import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emailKey, pinKey, emailReg, pinReg } from './constants/constants';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const SignUp = ({ navigation }: any): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [secondStep, setSecondStep] = useState<boolean>(false);
    const [thirdStep, setThirdStep] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [confirmedCode, setConfirmedCode] = useState<string>('');
    const inputRef = useRef<TextInput>(null);
    const CODE_LENGTH = 6;

    const _focus = () => inputRef.current?.focus && inputRef.current?.focus();

    useEffect(() => {
        if (emailReg.test(email)) {
            setIsDisabled(false);
        } else setIsDisabled(true);
    }), [email];

    useEffect(() => {
        if (pinReg.test(code) && code.length === CODE_LENGTH) {
            setThirdStep(true);
        }
    }), [code];

    useEffect(() => {
        if (pinReg.test(confirmedCode) && confirmedCode.length === CODE_LENGTH && confirmedCode === code) {
            createAccount();
        }
    }), [confirmedCode];

    const moveNext = () => { setSecondStep(true); setIsDisabled(true); }

    const createAccount = async () => {
        await createUserWithEmailAndPassword(auth, email, code).then((userCredentials) => {
            console.log(userCredentials);
            storeData();
        }).catch((error) => {
            console.log(JSON.stringify(error));
        });
    }

    const storeData = async () => {
        await AsyncStorage.multiSet([[emailKey, email], [pinKey, code]]).then(() => {
            navigation.navigate('Home');
        }).catch((error) => {
            console.log(JSON.stringify(error));
        });
    }

    return (
        <View style={styles.container}>
            {!secondStep ? (
                <>
                    <Text style={styles.text}>Enter your email</Text>
                    <TextInput style={styles.textInput} onChangeText={setEmail} value={email} />
                    <Pressable onPress={moveNext} disabled={isDisabled} style={isDisabled ? styles.disabledButton : styles.button}>
                        <Text style={styles.buttonText}>Next</Text>
                    </Pressable>
                </>
            )
                :
                (
                    <>
                        <Text style={styles.text}>{!thirdStep ? 'Choose a pin code' : 'Confirm your pin code'}</Text>
                        <Pressable onPress={() => _focus()}>
                            <View style={styles.row}>
                                {[
                                    ...new Array(CODE_LENGTH).fill(null).map((_, i) => (
                                        <View key={i} style={!thirdStep ? { ...styles.pinElement, ...(code && i < code.length && styles.activePinElement) }
                                            : { ...styles.pinElement, ...(confirmedCode && i < confirmedCode.length && styles.activePinElement) }} />
                                    )),
                                ]}
                                <TextInput autoFocus style={styles.invisible} keyboardType='number-pad' maxLength={6} ref={inputRef} value={!thirdStep ? code : confirmedCode} onChangeText={!thirdStep ? setCode : setConfirmedCode} />
                            </View>
                        </Pressable>
                    </>
                )}
        </View>
    )
}

export default SignUp;

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
    textInput: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#5AA469',
        height: 35,
        borderWidth: 2,
        borderColor: '#D35D6E',
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    disabledButton: {
        width: '20%',
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#D3D3D3',
        textAlign: 'center',
    },
    button: {
        width: '20%',
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#D35D6E',
        textAlign: 'center',
    },
    buttonText: {
        textAlign: 'center',
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