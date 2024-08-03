import React from 'react';

function Submit({ children, className, ...rest }: React.HTMLAttributes<HTMLButtonElement>): React.ReactNode {
    return (
        <button
            type="submit"
            className={`luminix-form-submit ${className ?? ''}`.trim()}
            {...rest}
        >
            {children}
        </button>
    );
}

Submit.displayName = 'Submit';

export default Submit;