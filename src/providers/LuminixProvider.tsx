import React from 'react';

import _ from 'lodash';
import { Model, Plugin, app } from '@luminix/core';
import { AppFacade, InitEvent } from '@luminix/core/dist/types/App';
import { AppConfiguration } from '@luminix/core/dist/types/Config';
import { Event } from '@luminix/core/dist/types/Event';


export type LuminixProviderProps = {
    config?: AppConfiguration,
    onInit?: (e: InitEvent) => void,
    onBooting?: (e: Event<AppFacade>) => void,
    onBooted?: (e: Event<AppFacade>) => void,
    plugins?: Plugin[],
};


export type LuminixContextState = {
    auth: {
        user: Model | null,
    },
    booted: boolean,
    config: AppConfiguration,
    errors: Record<string, string>,
    models: Record<string, typeof Model>,

};

const INITIAL_STATE: LuminixContextState = {
    auth: {
        user: null,
    },
    booted: false,
    config: {},
    errors: {},
    models: {},
};


export const LuminixContext = React.createContext<LuminixContextState>(INITIAL_STATE);

const LuminixProvider: React.FunctionComponent<LuminixProviderProps> = ({
    children, config = {}, plugins = [],
    onInit, onBooting, onBooted, 
}) => {

    const [state, setState] = React.useState<LuminixContextState>(INITIAL_STATE);

    React.useEffect(() => {

        app().on('init', (e) => {
            plugins.forEach((plugin) => {
                e.register(plugin);
            });

            if (onInit) {
                onInit(e);
            }
        });

        app().on('booting', (e) => {
            app('route').reducer('replaceRouteParams', (prevUrl: string) => {
                // remove leading and trailing slashes
                const url = prevUrl.replace(/^\/+|\/+$/g, '');
                const regex = /{([^}]+)}/g;

                return `/${url.replace(regex, ':$1')}`;
            });

            if (onBooting) {
                onBooting(e);
            }
        });

        app().on('booted', (e) => {
            const { auth, config: configFacade, error, repository } = app().make();
            setState({
                auth: {
                    user: auth.user(),
                },
                booted: true,
                config: configFacade.all(),
                errors: error.all(),
                models: repository.make(),
            });

            if (onBooted) {
                onBooted(e);
            }
        });

        app().boot(config);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (state.booted) {
            const unsubConfig = app('config').on('change', (e) => {
                setState((state) => {
                    return {
                        ...state,
                        config: e.source.all(),
                    };
                });
            });

            const unsubError = app('error').on('change', (e) => {
                setState((state) => {
                    return {
                        ...state,
                        errors: Object.entries(e.source.all()).reduce((acc, [key, value]) => {
                            return {
                                ...acc,
                                [`${_.camelCase(key)}Error`]: value
                            };
                        }, {}),
                    };
                });
            });

            return () => {
                unsubConfig();
                unsubError();
            };
        }
    }, [state.booted]);

    return (
        <LuminixContext.Provider value={state}>
            {children}
        </LuminixContext.Provider>
    );
};


export default LuminixProvider;

