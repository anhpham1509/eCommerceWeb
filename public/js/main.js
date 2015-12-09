/*scroll to top*/

$(document).ready(function () {
    $(function () {
        $.scrollUp({
            scrollName: 'scrollUp', // Element ID
            scrollDistance: 300, // Distance from top/bottom before showing element (px)
            scrollFrom: 'top', // 'top' or 'bottom'
            scrollSpeed: 300, // Speed back to top (ms)
            easingType: 'linear', // Scroll to top easing (see http://easings.net/)
            animation: 'fade', // Fade, slide, none
            animationSpeed: 200, // Animation in speed (ms)
            scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
            //scrollTarget: false, // Set a custom target element for scrolling to the top
            scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
            scrollTitle: false, // Set a custom <a> title if required.
            scrollImg: false, // Set true to use image
            activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
            zIndex: 2147483647 // Z-Index for the overlay
        });
    });
});


function initMap() {
    map = new google.maps.Map(document.getElementById('gmap'), {
        center: {lat: 60.222, lng: 24.805},
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: {lat: 60.2215, lng: 24.8078},
        map: map,
        title: 'aStore Inc.'
    });
    marker.setMap(map);

    var contentString = '<b>aStore Inc.</b>' +
        '<p>aStore is a leading online retailer committed<br>' +
        'to becoming the most loved and trusted marketplace<br>' +
        'on the web.</p>' +
        '<p>Address: Vanha maantie 6 - 02650 Espoo - Finland<br>' +
        'Tel: Mr. Anh Pham 012-3456789</p>';
    var infoWindows = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindows.open(map, marker);
}