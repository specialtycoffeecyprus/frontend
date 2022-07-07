import "./src/Sentry";

import {Loader} from '@googlemaps/js-api-loader';
import {MarkerClusterer} from "@googlemaps/markerclusterer";

import Map from './src/Map';
import './src/Map.css';

import Controls from "./src/Controls";
import Analytics from "./src/Analytics";


new Map(Loader, new Controls(), MarkerClusterer, new Analytics());
