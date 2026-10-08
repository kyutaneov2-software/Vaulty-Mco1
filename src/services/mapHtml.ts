/* =========================================================
   Map HTML

   Self-contained Leaflet map rendered inside a WebView.
   No API keys, no native modules. Communicates with RN
   via postMessage and injectJavaScript.
========================================================= */

import { Vault } from "./vaultService";

export function buildMapHtml(
    vaults: Vault[],
    center: { latitude: number; longitude: number },
): string {
    const markerData = JSON.stringify(
        vaults.map((v) => ({
            id: v.id,
            lat: v.latitude,
            lng: v.longitude,
            code: v.code,
            price: v.priceHour,
            online: v.online,
        })),
    );

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<style>
    * { box-sizing: border-box; }

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        background: #000;
        -webkit-tap-highlight-color: transparent;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    #map {
        width: 100%;
        height: 100%;
        background: #0A0A0D;
    }

    /* ------------------------------------------------------
       TILE STYLING
       Invert OSM light tiles → dark. Slight hue rotation and
       desaturation give the clean, muted look.
    ------------------------------------------------------ */
    .leaflet-tile-pane {
        filter: invert(1) hue-rotate(200deg) brightness(0.85)
                contrast(0.95) saturate(0.4);
    }

    .leaflet-container {
        background: #0A0A0D !important;
        outline: none;
    }

    /* ------------------------------------------------------
       AMBIENT GLOW — subtle purple at top of the map
    ------------------------------------------------------ */
    .leaflet-container::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(139, 92, 246, 0.06) 0%,
            rgba(139, 92, 246, 0) 30%
        );
        pointer-events: none;
        z-index: 400;
    }

    /* ------------------------------------------------------
       VAULT PINS — SVG teardrops with glow
    ------------------------------------------------------ */

    .vault-pin-wrap {
        position: relative;
        width: 34px;
        height: 44px;
        transform-origin: bottom center;
    }

    .vault-pin-wrap svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.55))
                drop-shadow(0 0 10px rgba(139, 92, 246, 0.45));
        transition: filter 0.2s ease, transform 0.2s ease;
    }

    .vault-pin-wrap.selected {
        z-index: 1000;
    }

    .vault-pin-wrap.selected svg {
        filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.65))
                drop-shadow(0 0 22px rgba(139, 92, 246, 0.95));
        transform: scale(1.15);
    }

    /* Pulse ring for online vaults */
    .vault-pin-wrap.online::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 6px;
        width: 44px;
        height: 44px;
        margin-left: -22px;
        margin-top: -22px;
        border-radius: 50%;
        border: 2px solid rgba(139, 92, 246, 0.55);
        animation: pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        pointer-events: none;
    }

    @keyframes pulse {
        0%   { transform: scale(0.6); opacity: 0.8; }
        70%  { transform: scale(1.9); opacity: 0; }
        100% { transform: scale(1.9); opacity: 0; }
    }

    /* ------------------------------------------------------
       TOOLTIP — matches the app's dark cards
    ------------------------------------------------------ */
    .leaflet-tooltip {
        background: rgba(11, 11, 14, 0.95) !important;
        border: 1px solid #2A2A31 !important;
        border-radius: 12px !important;
        color: #F5F5F7 !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        letter-spacing: -0.1px;
        padding: 6px 10px !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55) !important;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .leaflet-tooltip-top::before {
        border-top-color: #2A2A31 !important;
    }

    /* ------------------------------------------------------
       ATTRIBUTION — compact pill, bottom-right
    ------------------------------------------------------ */
    .leaflet-control-attribution {
        background: rgba(0, 0, 0, 0.65) !important;
        color: #5A5A5F !important;
        font-size: 9px !important;
        padding: 3px 8px !important;
        border-radius: 8px !important;
        margin: 0 10px 10px 0 !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .leaflet-control-attribution a {
        color: #A78BFA !important;
        text-decoration: none !important;
    }

    /* ------------------------------------------------------
       ZOOM CONTROLS — custom pill buttons, top-right
    ------------------------------------------------------ */
    .leaflet-top.leaflet-right {
        top: 12px;
        right: 12px;
    }

    .leaflet-control-zoom {
        border: none !important;
        box-shadow: none !important;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .leaflet-control-zoom a {
        width: 42px !important;
        height: 42px !important;
        line-height: 42px !important;
        border-radius: 14px !important;
        background: rgba(11, 11, 14, 0.92) !important;
        border: 1px solid #2A2A31 !important;
        color: #F5F5F7 !important;
        font-size: 22px !important;
        font-weight: 500 !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45) !important;
        transition: all 0.15s ease;
        display: flex !important;
        align-items: center;
        justify-content: center;
    }

    .leaflet-control-zoom a:hover,
    .leaflet-control-zoom a:active {
        background: rgba(139, 92, 246, 0.22) !important;
        border-color: #8B5CF6 !important;
        transform: scale(0.94);
    }

    .leaflet-bar {
        border: none !important;
    }

    /* ------------------------------------------------------
       SCALE BAR — small, bottom-left
    ------------------------------------------------------ */
    .leaflet-control-scale {
        margin-left: 14px !important;
        margin-bottom: 14px !important;
    }

    .leaflet-control-scale-line {
        background: rgba(0, 0, 0, 0.65) !important;
        border: 1px solid #2A2A31 !important;
        color: #8E8E93 !important;
        font-size: 9px !important;
        font-weight: 700 !important;
        padding: 2px 8px !important;
        border-radius: 8px !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
</style>
</head>
<body>
<div id="map"></div>

<script>
    var vaults = ${markerData};

    /* ------------------------------------------------------
       INIT MAP
    ------------------------------------------------------ */
    var map = L.map("map", {
        center: [${center.latitude}, ${center.longitude}],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
    });

    /* ------------------------------------------------------
       TILES — OpenStreetMap, free, no key
    ------------------------------------------------------ */
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
    }).addTo(map);

    /* Custom controls */
    L.control.zoom({ position: "topright" }).addTo(map);

    L.control.scale({
        position: "bottomleft",
        imperial: false,
        maxWidth: 100,
    }).addTo(map);

    /* ------------------------------------------------------
       SVG PIN BUILDERS
    ------------------------------------------------------ */
    function buildPinSvg(online) {
        var fill = online ? "#8B5CF6" : "#5A5A5F";
        var dot = online ? "#FFFFFF" : "#8E8E93";

        return (
            '<svg viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">' +
            '  <path d="M17 1 ' +
            '           C8.16 1 1 8.16 1 17 ' +
            '           C1 24.5 7.5 32.5 17 43 ' +
            '           C26.5 32.5 33 24.5 33 17 ' +
            '           C33 8.16 25.84 1 17 1 Z" ' +
            '        fill="' + fill + '" ' +
            '        stroke="#FFFFFF" ' +
            '        stroke-width="2" ' +
            '        stroke-linejoin="round"/>' +
            '  <circle cx="17" cy="17" r="5.5" fill="' + dot + '"/>' +
            '</svg>'
        );
    }

    /* ------------------------------------------------------
       MARKERS
    ------------------------------------------------------ */
    var markers = {};
    var latLngs = [];
    var selectedId = null;

    vaults.forEach(function (v) {
        var wrapperClass = "vault-pin-wrap " + (v.online ? "online" : "offline");

        var icon = L.divIcon({
            className: "",
            html:
                '<div class="' + wrapperClass + '" data-vault-id="' + v.id + '">' +
                buildPinSvg(v.online) +
                '</div>',
            iconSize: [34, 44],
            iconAnchor: [17, 44],
        });

        var m = L.marker([v.lat, v.lng], { icon: icon }).addTo(map);

        m.bindTooltip(v.code + " · ₱" + v.price + "/hr", {
            direction: "top",
            offset: [0, -46],
        });

        m.on("click", function () {
            selectMarker(v.id);
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: "marker_tap", id: v.id })
            );
        });

        markers[v.id] = m;
        latLngs.push([v.lat, v.lng]);
    });

    /* ------------------------------------------------------
       SELECTION HELPERS
    ------------------------------------------------------ */
    function applySelectedClass(id, on) {
        if (!markers[id]) return;
        var el = markers[id].getElement();
        if (!el) return;
        var wrap = el.querySelector(".vault-pin-wrap");
        if (!wrap) return;

        if (on) wrap.classList.add("selected");
        else wrap.classList.remove("selected");
    }

    function selectMarker(id) {
        if (selectedId && selectedId !== id) {
            applySelectedClass(selectedId, false);
        }
        selectedId = id;
        applySelectedClass(id, true);
    }

    function clearSelection() {
        if (selectedId) {
            applySelectedClass(selectedId, false);
            selectedId = null;
        }
    }

    /* ------------------------------------------------------
       INITIAL FIT
    ------------------------------------------------------ */
    if (latLngs.length > 0) {
        var bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 18,
            animate: false,
        });
    }

    /* ------------------------------------------------------
       PUBLIC API — called from React Native
    ------------------------------------------------------ */

    /* Focus a single vault, optionally highlighting the pin */
    window.setCenter = function (lat, lng, id) {
        map.setView([lat, lng], 18, { animate: true });
        if (id) selectMarker(id);
    };

    /* Reset to the fitted bounds and clear selection */
    window.resetView = function () {
        clearSelection();
        if (latLngs.length > 0) {
            var bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, {
                padding: [80, 80],
                maxZoom: 18,
                animate: true,
            });
        } else {
            map.setView([${center.latitude}, ${center.longitude}], 15, {
                animate: true,
            });
        }
    };

    /* Signal readiness to RN */
    setTimeout(function () {
        window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: "map_ready" })
        );
    }, 300);
</script>
</body>
</html>
    `.trim();
}
