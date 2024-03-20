import React from 'react';
import { GridLoader } from 'react-spinners';

const Fallback: React.FunctionComponent = () => {

    React.useEffect(() => {
        document.body.style.margin = '0';
        return () => {
            document.body.style.margin = '';
        };
    }, []);

    return (
        <div
            style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}
            className="test"
        >
            <img 
                src="https://avatars.githubusercontent.com/u/158327540?s=100&v=4" 
                alt="Luminix"
            />
            <GridLoader color="#1d9798" />
        </div>
    )
};


export default Fallback;