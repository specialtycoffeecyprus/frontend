import {Loader} from '@googlemaps/js-api-loader';
import {MarkerClusterer} from "@googlemaps/markerclusterer";

import Map from './src/Map';
import './src/Map.css';

import Controls from "./src/Controls";


new Map(Loader, new Controls(), MarkerClusterer);
