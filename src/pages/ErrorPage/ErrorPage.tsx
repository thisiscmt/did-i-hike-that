import React, {useEffect} from 'react';

const ErrorPage = () => {
    useEffect(() => {
        document.title = 'Error - Did I Hike That?';
    });

    return (
        <main className='error-page'>
            <p>The page you are trying to reach can't be found</p>
        </main>
    )
}

export default ErrorPage;
