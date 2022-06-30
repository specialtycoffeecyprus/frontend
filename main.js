import {Loader} from '@googlemaps/js-api-loader';
import {MarkerClusterer} from "@googlemaps/markerclusterer";

import Map from './src/Map';
import './src/Map.css';

import Api from "./src/Api";

import Controls from "./src/Controls";


new Map(new Api(), Loader, new Controls(), MarkerClusterer);
