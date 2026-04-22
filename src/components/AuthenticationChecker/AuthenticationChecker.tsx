import React, {FC, ReactElement, useContext} from 'react';

import { MainContext } from '../../contexts/MainContext';
import Login from '../../pages/Login/Login.tsx';

interface AuthenticationCheckerProps {
    targetComponent: ReactElement
}

const AuthenticationChecker: FC<AuthenticationCheckerProps> = ({ targetComponent }) => {
    const { isLoggedIn } = useContext(MainContext);

    if (isLoggedIn()) {
        return targetComponent;
    } else {
        return <Login />
    }
};

export default AuthenticationChecker;

