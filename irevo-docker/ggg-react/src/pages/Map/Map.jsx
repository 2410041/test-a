import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { useRef, useEffect, useState } from 'react'
import axios from 'axios';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css'


export default function Map(props) {
    const work_location = props.work_location;  // 日本語の住所が保存される
    const ACCESS_TOKEN = 'pk.eyJ1IjoibWFoaTQyMCIsImEiOiJjbTlnbWZkN3kweTd6MmpzY2k3enJ4MWM0In0.0M7QoGlg2teshcSYkfr4Zg';
    const URL = 'https://api.mapbox.com/search/geocode/v6/forward?q=' + work_location + '&access_token=' + ACCESS_TOKEN + '&language=ja&country=jp&limit=1';

    const [items, setItems] = useState([]);
    const [latitude, setLatitude] = useState(null);    // 緯度
    const [longitude, setLongitude] = useState(null);  // 経度

    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        // 住所からMapboxのAPIを経由して緯度経度をGETで取得する
        axios.get(URL)
            .then(response => {
                setItems(response.data);
                // レスポンスに座標データがある場合、直接設定
                if (response.data.features && response.data.features.length > 0) {
                    const coords = response.data.features[0].properties.coordinates;
                    // console.log('Setting coordinates:', coords);
                    setLatitude(coords.latitude);
                    setLongitude(coords.longitude);
                }
            })
            .catch(error => {
                console.error('エラー:', error);
            });
    }, [work_location]);

    useEffect(() => {
        // 緯度経度が設定されていない場合は処理しない
        if (latitude === null || longitude === null) {
            // console.log('Coordinates not ready yet:', { latitude, longitude });
            return;
        }

        if(items.length != 0) {
            setLatitude(items.features[0].properties.coordinates.latitude);
            setLongitude(items.features[0].properties.coordinates.longitude);

            // console.log("緯度 : " + latitude);
            // console.log("経度 : " + longitude);
            
        } 

        mapboxgl.accessToken = ACCESS_TOKEN;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [longitude, latitude],
            zoom: 17,
            style: 'mapbox://styles/mapbox/streets-v11',
        });

        mapRef.current.addControl(new MapboxLanguage({
            defaultLanguage: 'ja'
        }));

        new mapboxgl.Marker({color:'red'})
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current);

        return () => {
            mapRef.current.remove();
        }
    }, [latitude, longitude]);

    return (
        <>
            <div id='map-container' ref={mapContainerRef}
            />
        </>
    )
};
