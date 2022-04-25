import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emailKey, pinKey } from './constants/constants';
import SignUp from './signUp';
import SignIn from './signIn';

const Login = ({ navigation }: any): JSX.Element => {

    const [isSignUp, setIsSignUp] = useState<boolean>(true);

    useEffect(() => {
        AsyncStorage.clear();
        retrieveData();
    }, [])

    const retrieveData = async () => {
        try {
            const values = await AsyncStorage.multiGet([emailKey, pinKey]);
            if (values[0][1] !== null && values[1][1] !== null) {
                console.log(values[0][1]);
                console.log(values[1][1]);
                setIsSignUp(false);
            }
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    return <>{isSignUp ? <SignUp navigation={navigation} /> : <SignIn navigation={navigation} />}</>
}

export default Login;
