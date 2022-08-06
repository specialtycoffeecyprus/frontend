import "./src/components/Sentry";

import {Loader} from '@googlemaps/js-api-loader';
import {MarkerClusterer} from "@googlemaps/markerclusterer";

import Map from './src/components/Map';
import './src/components/Map.css';

import Controls from "./src/components/Controls";
import Analytics from "./src/components/Analytics";


new Map({
    loader: Loader,
    controls: new Controls(),
    markerClusterer: MarkerClusterer,
    analytics: new Analytics()
});
