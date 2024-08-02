import React from 'react';

function Submit({ children, ...rest }: React.HTMLAttributes<HTMLButtonElement>): React.ReactNode {
    return (
        <button type="submit" {...rest}>
            {children}
        </button>
    );
}

Submit.displayName = 'Submit';

export default Submit;