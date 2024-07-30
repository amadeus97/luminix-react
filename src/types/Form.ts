
import { HttpMethod } from '@luminix/core/dist/types/Route';
import { AxiosResponse } from 'axios';


export type UseFormOptions<T extends object> = {
    initialValues: T,
    preventDefault?: boolean,
    onSubmit?: (data: T) => false | void | Promise<false | void>,
    onChange?: (data: T) => void,
    onError?: (error: unknown) => void,
    onSuccess?: (response: AxiosResponse) => void,
    transformPayload?: (payload: T) => T,
    action?: string,
    method?: HttpMethod,
    errorBag?: string,

};

export type FormProps<T extends object> = Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & UseFormOptions<T>;

// export type InteractiveFormProps = {
//     onSubmit: React.FormHTMLAttributes<HTMLFormElement>['onSubmit'],
//     action: React.FormHTMLAttributes<HTMLFormElement>['action'],
//     method: React.FormHTMLAttributes<HTMLFormElement>['method'],
//     ref: React.RefObject<HTMLFormElement>,
// };

export type InteractiveFormProps = Pick<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'action' | 'method'> & {
    ref: React.RefObject<HTMLFormElement>,
};

export type InteractiveInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'>;

export type InteractiveCheckboxProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'checked' | 'onChange'>;

export type InteractiveRadioProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'checked' | 'onChange'>;

export type InteractiveTextareaProps = Pick<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'value' | 'onChange'>;

export type InteractiveSelectProps = Pick<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'value' | 'onChange'>;

export type UseForm<T extends object> = {
    /** The form data. */
    data: T,
    /** Sets a property in the form data. Could be used to set nested values by using dot notation, or set the whole state by using path = '.'. */
    setProp: (path: string, value: unknown) => void,
    /** A function that returns the props for the form. */
    formProps: () => InteractiveFormProps,
    /** A function that returns the props for an input or select. */
    inputProps: (name: string, sanitizeFn?: (event: React.ChangeEvent<HTMLInputElement>) => string) => InteractiveInputProps,
    /** A function that returns the props for a checkbox. */
    checkboxProps: (name: string) => InteractiveCheckboxProps,
    /** A function that returns the props for a radio. */
    radioProps: (name: string, value: string) => InteractiveRadioProps,
    /** A function that returns the props for a textarea. */
    textareaProps: (name: string, sanitizeFn?: (event: React.ChangeEvent<HTMLTextAreaElement>) => string) => InteractiveTextareaProps,
    /** A function that returns the props for a select. */
    selectProps: (name: string) => InteractiveSelectProps,
    /** Whether the form is currently submitting. */
    isSubmitting: boolean,
    /** The current form element. */
    form?: HTMLFormElement,
    /** The current error bag. */
    errorBag?: string,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
};

export type FormContextValue<T extends object> = {
    form: UseForm<T>,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanitizableInput<T = any, R = any> = {
    sanitize?: (e: T) => R,
}


export type InputPropTypeMap = {
    
    checkbox: React.InputHTMLAttributes<HTMLInputElement>,
    color: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    date: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    ['datetime-local']: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    email: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    file: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    hidden: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    image: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    month: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    number: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    password: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    radio: React.InputHTMLAttributes<HTMLInputElement> & {
        options: { value: string, label: string }[],
    },
    range: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    search: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    select: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
        options: { value: string, label: string }[],
    },
    tel: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    text: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    textarea: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> & SanitizableInput<React.ChangeEvent<HTMLTextAreaElement>>,
    // {
    //     sanitize?: (e: React.ChangeEvent<HTMLTextAreaElement>) => string,
    // },
    time: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    url: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,
    week: React.InputHTMLAttributes<HTMLInputElement> & SanitizableInput<React.ChangeEvent<HTMLInputElement>>,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
};

export type HTMLInputProps<T extends keyof InputPropTypeMap> = Omit<InputPropTypeMap[T], 'type' | 'children' | 'name' | 'value' | 'onChange' | 'checked'>;

export type InputProps<T extends keyof InputPropTypeMap> = HTMLInputProps<T> & {
    name: string,
    type: T,
    label?: string,
    // error?: string,
};

