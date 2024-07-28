import React from 'react';

import { Plugin, app } from '@luminix/core';
import { AppFacade, InitEvent } from '@luminix/core/dist/types/App';
import { AppConfiguration } from '@luminix/core/dist/types/Config';
import { Event } from '@luminix/core/dist/types/Event';

import Fallback from './Fallback';

import { RouteObject, RouterProvider, RouterProviderProps, createBrowserRouter } from 'react-router-dom';
import LuminixContext, { LuminixContextState, luminixInitialState } from '../contexts/LuminixContext';
import ReactPlugin from '../ReactPlugin';


export type LuminixProviderProps = Omit<RouterProviderProps, "router"> & {
    routes: (app: AppFacade) => RouteObject[],
    config?: AppConfiguration,
    onInit?: (e: InitEvent) => void,
    onBooting?: (e: Event<AppFacade>) => void,
    onBooted?: (e: Event<AppFacade>) => void,
    plugins?: Plugin[],
    fallbackElement?: React.ReactElement,
};


const LuminixProvider: React.FunctionComponent<LuminixProviderProps> = ({
    routes, config = {}, plugins = [],
    onInit, onBooting, onBooted,
    fallbackElement = <Fallback />,
    ...props
}) => {

    const [state, setState] = React.useState<LuminixContextState>(luminixInitialState);

    React.useEffect(() => {

        app().on('init', (e) => {
            e.register(new ReactPlugin());

            plugins.forEach((plugin) => {
                e.register(plugin);
            });

            if (onInit) {
                onInit(e);
            }
        });

        app().on('booting', (e) => {
            if (onBooting) {
                onBooting(e);
            }
        });

        app().on('booted', (e) => {
            const {
                route
            } = app().make();

            if (typeof route.routerOptions !== 'function') {
                throw new Error('Expect RouteFacade to be Reducible');
            }

            const options = route.routerOptions({});

            setState({
                booted: true,
                router: createBrowserRouter(routes(e.source), options)
            });

            if (onBooted) {
                onBooted(e);
            }
        });

        app().boot(config);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <LuminixContext.Provider value={state}>
            {state.router
                ? (
                    <RouterProvider
                        router={state.router}
                        fallbackElement={fallbackElement}
                        {...props}
                    />
                )
                : fallbackElement}
        </LuminixContext.Provider>
    );
};


export default LuminixProvider;

