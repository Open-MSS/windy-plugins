module.exports = {
    // Display name of your plugin, as it will appear in the menu
    displayName: 'Mscolab',

    // Place, where opening link to your plugin will appear. So far only
    // Allowed: 'contextmenu', 'menu'
    hook: 'menu',

    // List of external libraries, that should be loaded before
    // your plugin is even mounted to the page
    dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.0/socket.io.js'],

    // List of classnames that will be attached to your plugin upon mounting
    className: 'plugin-lhpane plugin-mobile-fullscreen',

    // If you want to apply different set of classes on mobile devices
    // classNameMobile: 'this-is-other-class',

    // Forces all other window panes with the same value to be closed
    // Allowed: 'lhpane', 'rhpane' and 'all'
    // exclusive: 'lhpane',

    // The place in page, where your plugin element will be mounted
    // to the page. By default all the plugins are attached to
    // #plugins div
    // attachPoint: '#map_container .leaflet-popup-pane',

    // If you want to apply different mounting point on mobile devices
    // attachPointMobile: '#plugins'
};
