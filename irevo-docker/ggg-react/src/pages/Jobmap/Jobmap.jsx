import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Geocoder } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

import './Jobmap.css';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu.jsx';

export default function JobMap() {
  const ACCESS_TOKEN = 'pk.eyJ1IjoibWFoaTQyMCIsImEiOiJjbTlnbWZkN3kweTd6MmpzY2k3enJ4MWM0In0.0M7QoGlg2teshcSYkfr4Zg';
  mapboxgl.accessToken = ACCESS_TOKEN;

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // 地図上の文字を日本語優先にする処理
  const applyJapaneseLabels = (map) => {
    const style = map.getStyle();
    if (!style || !style.layers) return;
    style.layers.forEach(layer => {
      if (
        layer.type === 'symbol' &&
        layer.layout &&
        layer.layout['text-field']
      ) {
        
        map.setLayoutProperty(layer.id, 'text-field', [
          'coalesce',
          ['get', 'name_ja'],
          ['get', 'name_ja-Hani'],
          ['get', 'name_ja-Latn'],
          ['get', 'name']
        ]);
      }
    });
  };

  // 地図作成
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,

      style: 'mapbox://styles/mapbox/streets-v12',
      center: [139.6917, 35.6895],
      zoom: 10
    });

    // 地図が完全に読み込まれて準備ができのかを確認する
    map.on('load', () => {
      setMapReady(true);

      map.addControl(new MapboxLanguage({ defaultLanguage: 'ja' })); // マップのラベルに日本語を適用する
      map.addControl(new mapboxgl.NavigationControl(), 'top-right'); // マップに操作UIを追加する、拡大縮小など
      applyJapaneseLabels(map); 
    });
    
    // マップスタイルが変わったときにも日本語が適応できるようにする
    map.on('style.load', () => {
      applyJapaneseLabels(map);
    });

    // maprefに先ほど作った地図を保存する
    mapRef.current = map;

    // コンポーネントが削除されたときに呼ばれる処理、ページを閉じたときなど
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 地図が準備できているかを確認する、まだなら処理を終了
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    let cancelled = false;

    // サーバーからデータを取ってくる
    (async () => {
      try {
        // クエリパラメータを追加（work_locationを空文字で送信）
        const res = await axios.get('http://localhost:3030/company/Jobmap', {
          params: {
            work_location: '' // 空の場合は全件取得
          }
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setJobs(data);  // ReactのJobsにdetaをいれる

        const addresses = Array.from(new Set( // 住所だけをすべて取り出す、setを使って同じ住所があれば1つにまとめる
          data.map(d => d.work_location).filter(Boolean) // 空っぽの住所があった場合除外する
        ));

        console.log('住所件数(重複除去後):', addresses.length); // 住所を数えてconsole画面に件数を表示する

        //住所を1つずつ地図APIに渡して「この住所の座標を教えて」と聞く。
        // 返ってきた答え（feature）が「その場所の緯度と経度」。
        // もし失敗したら「この住所は変換できなかった」と記録。
        const geocodePromises = addresses.map(addr =>
          axios.get(
            'https://api.mapbox.com/search/geocode/v6/forward',
            {
              params: {
                q: addr, 
                access_token: ACCESS_TOKEN,
                language: 'ja',
                country: 'jp',
                limit: 1
              }
            }
          ).then(r => {
            const feature = r.data?.features?.[0];
            return { addr, feature };
          }).catch(err => {
            console.warn('Geocode失敗:', addr, err?.response?.status, err.message);
            return null;
          })
        );

        // すべての住所の緯度経度が終わるまで待つ
        // cancelledがtrueになったら終了
        const results = await Promise.all(geocodePromises);
        if (cancelled) return;

        // すでに地図にある古いピンをすべてけし、ピンのリストも空にする
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // 住所を緯度経度変換してできたものだけその場所にピンを置く
        let successCount = 0;
        results.forEach(r => {
          if (!r || !r.feature) return;

          const coords = r.feature.geometry?.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) {
            console.warn('座標なしスキップ:', r.addr, r.feature);
            return;
          }
          const [lng, lat] = coords;
          const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])  // ピンの場所を座標で指定する
            .setPopup(new mapboxgl.Popup().setText(r.addr)) // ピンをクリックすると住所が出る
            .addTo(mapRef.current); // そのピンをマップに表示
          markersRef.current.push(marker);
          successCount++; // ピンの件数を数える
        });
        
        // 「全部で何件の住所のうち、何件にピンを置けたか」を出力。
        console.log(`マーカー配置: ${successCount}/${addresses.length}`);
      } catch (e) {
        console.error('Jobmap fetch / geocode error (全体):', e);
      }
    })();

    return () => { cancelled = true; };
  }, [mapReady]);

  return (
    <>
      <div className="geomap-fullscreen">
        <HamburgerMenu />
        <div className="address-form">
          <Geocoder
                accessToken={ACCESS_TOKEN}
                map={mapRef.current}
                mapboxgl={mapboxgl}
                value={inputValue}
                onChange={(d) => {
                    setInputValue(d);
                }}
                marker
                options={
                    { country: 'jp', language: 'ja'}
                }
          />
        </div>
        <div ref={mapContainerRef} className="map-container-fullscreen" />
      </div>
    </>
  );
}
