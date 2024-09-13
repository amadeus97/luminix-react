import React from 'react';
import { GridLoader } from 'react-spinners';

import logo from '../assets/logo.png';

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
                src={logo}
                alt="Luminix"
            />
            <GridLoader color="#1d9798" />
            
        </div>
    )
};


export default Fallback;