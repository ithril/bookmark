//
// ESR Location settings plugin
//
//   Enables simple, extensible control over setting a current location on a page
//
//  derived from jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// http://stefangabos.ro/jquery/jquery-plugin-boilerplate-revisited/
// by Stefan Gabos

(function($) {

    $.esrlocation = function(element, options) {
        var defaults = {
            homeLat:'',
            homeLng:'',
            homeLocation:'',
            currentLat:'',
            currentLng:'',
            currentLocation:'',
            displayLocation:'',
            title: 'Not Set',
            callback: ''
        };

        var plugin = this;
        var mapinit = false;

        plugin.settings = {};

        var $element = $(element),
            element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            homeLat = plugin.settings.homeLat;
            homeLng = plugin.settings.homeLng;

            if (plugin.settings.homeLocation!= "") {
                var l = new ESRLocation();
                l.parseFromESR(JSON.parse(plugin.settings.homeLocation));
                homeLocation = l;
                homeLat = "";
                homeLng = "";
            }

            displayLocation = plugin.settings.displayLocation;

            if (plugin.settings.currentLat!='' ) currentLat = plugin.settings.currentLat; else currentLat ='';
            if (plugin.settings.currentLng!='' ) currentLng = plugin.settings.currentLng; else currentLng ='';

            if (plugin.settings.currentLocation!='') {
                var l = new ESRLocation();
                l.parseFromESR(plugin.settings.currentLocation);
                currentLocation = l;
                displayLocation = currentLocation.getGeneralLocation();
            } else if (currentLat!= '' && currentLng!='' ) {
                var l = new ESRLocation();
                l.reverseGeoCode(currentLat, currentLng, function() {
                   currentLocation =l;
                   displayLocation = currentLocation.getGeneralLocation();
                });
            } else {
                currentLocation = '';
                currentLat = "";
                currentLng = "";
                displayLocation ="";
            }

            title = plugin.settings.title;
            
            callback = plugin.settings.callback;

            //var e = jQuery(this);
            $element.click(function () {
                makeForm();
            });

        }

        var makeForm = function() {
            var curloc = 'Current Location: lat: ' + currentLat + ', lng: ' + currentLng + ", loc: " + currentLocation;
            var homeloc = 'Home Loc: lat: ' + homeLat + ', lng: ' + homeLng + ", loc: " + homeLocation;
            var setHome = '';
            var setCurrent = '';

            var title = 'CHOOSE LOCATION';
            if (currentLocation && currentLocation != '') {


                if (currentLocation.isSet()) displayLocation = currentLocation.getGeneralLocation();
            }
            if (homeLat && homeLng) {
                setHome = '<div class="actionLink"><a id="locChooseHome">Use Home Location</a></div>';
            }
            if (navigator && navigator.geolocation) {
                setCurrent = '<div class="actionLink"><a id="locChooseCurrent">Use Current Location</a></div>';
            }

            var setByMap = '<div class="actionLink"><a id="locChooseMap">Select Point on Map</a></div><div class="map" style="display:none;" ></div>' ;

            var setByAddress = '<div class="addressActions"><label for="address">Enter an address:</label><input type="text" class="enteraddress" id="addressCandidate" name="address" value=""/>'+

                '<input type="button" class="address button" id="locCheckAddress" value="go"/>' +
                '</div>' +
                '<div id="locAddressChoices" style="display:none;"></div>';

            var buttons = '<div class="form-row form-row-last"><label></label><div class="buttons"><button type="submit" id="locSetButton" class="button"><span>Set location</span></button>' +
                '<input type="reset" value="Remove" class=" cancel-post"></div>';

            if ( displayLocation != '') title = 'Current: ' +displayLocation;

            var html = '<div class="information">Please set your location using one of the following options</div>' +
                '<span id="curloc" style="display:none;">'+curloc+'</span><br/>' +
                '<span id="homeloc" style="display:none;">' + homeloc + '</span>';

            html += setHome;
            html += setCurrent;
            html += setByMap;
            html += setByAddress;

            html += buttons;

            $dlg = $("<div></div>");
            $dlg.attr('id', 'locationDialog')
                .html(html)
                .appendTo($element);

            // e.writeCurrentPosition();
            if (setHome!='') {
                $('#locChooseHome').click( function(e) {
                    setLocation(homeLat, homeLng, homeLocation);
                    //setLocationAsHome();
                });
            }

            if (setCurrent!='') {
                $('#locChooseCurrent').click( function(e) {
                    setLocationAsCurrent();
                });
            }

            $("#locChooseMap").click( function(e) {
                toggleMap();
            });

            $("#locCheckAddress").click( function(e){
                searchAddress();
            });

            $("#addressCandidate").focus( function() {
                this.select();
            });

            $("#locationDialog").dialog({
                autoOpen:true,
                title:title,
                resizable:false,
                modal:true,
                width: 450,
                show: {effect: 'drop', direction: 'up'},
                hide: {effect: 'drop', direction: 'down'}
            });

            $("#locSetButton").click( function(e) {
                closeDialog();
            });


            $("#locationDialog .cancel-post").click(function(e) {
                currentLocation = null;
                displayLocation = null;
                currentLat = null;
                currentLng = null;
                closeDialog();
            });

            $(".ui-dialog-titlebar-close").click(function(e) {
                if (callback) callback();
            });

        }

        var closeDialog = function(){
            $("#locationDialog").attr('alt', 'Close to set location').dialog('close');
            if (callback) callback();
        }

        var setLocation = function (lat, lng, location) {
            currentLat = lat;
            currentLng = lng;

            if (location && location.isSet() ) {
                currentLocation = location;
                displayLocation = location.getGeneralLocation();
                writeCurrentLocation();
            } else {
                var l = new ESRLocation();
                l.reverseGeoCode(currentLat, currentLng, function(){
                    var pt = new google.maps.LatLng(currentLat, currentLng);
                    $(".map").gmap3({
                        action:'panTo',
                        args: [pt]
                    });
                    currentLocation = l;
                    displayLocation = l.getGeneralLocation();
                    writeCurrentLocation();
                });
            }

        }

        var toggleMap = function() {
            $("#locationDialog  .map").toggle(400, function(){
                if (mapinit == false) {
                    mapinit = true;
                    showMap(this);
                }
            });
        }

        var showMap = function(map) {
            var tLat = 35.474531793460415;
            var tLng = -83.92022080321044;
            if (currentLat != '') tLat = currentLat;
            if (currentLng != '') tLng = currentLng;

            $(map).gmap3({
                action: 'init',
                options: {
                    zoom: 4,
                    mapTypeControl: false,
                    navigationControls: true,
                    scrollwheel: true,
                    streetViewControl: false,
                    center: [tLat , tLng]
                },
                events:{
                    click: function(map, event) {
                        currentLat = event.latLng.lat();
                        currentLng = event.latLng.lng();

                        setLocation(event.latLng.lat(), event.latLng.lng());
                        setMarker();
                    }
                },
                callback: function() {
                    if (currentLat!=''& currentLng!='') {
                        setLocation(currentLat, currentLng);
                        setMarker();
                    }
                }
            });
        }

        var setMarker = function() {
            var markers = $("#locationDialog .map").gmap3({action:'get', name:'marker', all:true});
            if (markers.length > 0 ) {
                // remove it ...
                $("#locationDialog .map").gmap3({
                    action: 'clear',
                    name: 'marker'
                });
            }

            // add a marker
            $("#locationDialog .map").gmap3({
                action: 'addMarker',
                tag: 'curloc',
                map: {
                    center:true,
                    zoom: 10
                },
                marker: {
                    options: {
                        draggable: true
                    },
                    events: {
                        click: function(marker) {
                            alert("current position is " + marker.position.lat() + ", " + marker.position.lng());
                        },
                        dragend: function(marker) {
                            setLocation(marker.position.lat(), marker.position.lng());
                        }
                    }
                },
                latLng: [currentLat, currentLng]
            });

        }

        var setLocationAsCurrent = function() {
            navigator.geolocation.getCurrentPosition(
                function(p) {
                    setLocation( p.coords.latitude, p.coords.longitude, null);
                    return false;
                },
                function() { //fail case - do nothing...
                    return false;
                }
            );
        }

        var searchAddress = function() {
            $("#locAddressChoices").hide().html("");
            var address = $("#addressCandidate").val();
            if (address == null || address== '') return false;

            address = encodeURI(address);
            var url= 'http://nominatim.openstreetmap.org/search?q='+address+'&format=json&addressdetails=1';
            $.getJSON(
                url,
                function(data) {
                    if (data.length == 1) {
                        var l = new ESRLocation();
                        l.parseFromOpenmap(data[0]);
                        toggleMap();
                        setLocation(l.getLat(), l.getLng(), l);
                        $("#addressCandidate").val("");
                        return false;
                    } else if (data.length > 1) {
                        $("#locAddressChoices").data('addresses', data);
                        var html ="Did you mean?<br />";
                        for (var i=0; i< data.length; i++) {
                            html+= '<a class="selectAddress" item="'+i+'" >' + data[i].display_name+'</a><br />';
                        }

                        $("#locAddressChoices").show(400).html(html);
                        $("a.selectAddress").click(function(e, data){
                            var d = $("#locAddressChoices").data('addresses');
                            var i = $(e.target).attr("item"); //item selected
                            var l = new ESRLocation();
                            l.parseFromOpenmap(d[i]);
                            toggleMap();
                            setLocation(l.getLat(), l.getLng(), l);
                            $("#locAddressChoices").hide(400).html("");
                            $("#addressCandidate").val("");
                        });
                    } else if (data.length == 0 ) {
                        var html = "<br />&nbsp;&nbsp;&nbsp;Please try and be more specific<br />";
                        $("#addressCandidate").focus( );
                        $("#locAddressChoices").show(400).html(html).delay(2000).hide(400);

                    }
                }
            );
        }

        var writeCurrentLocation = function() {
            var curloc = 'Current Location: lat' + currentLat + ', lng: ' + currentLng + ", loc: " + currentLocation;
            $("span#curloc").text(curloc);
            if ( displayLocation != '') title = 'Current: ' +displayLocation;
            $("#locationDialog").dialog({title: title})
        }

        plugin.getCurrentPosition = function() {
            return {"lat": currentLat, "lng":currentLng};
        }

        plugin.getCurrentGeneralLocation = function() {
            return displayLocation;
        }

        plugin.getFullLocation = function() {
            return currentLocation;
        }

        plugin.getHomeLocation = function() {
            return homeLocation;
        }

        plugin.getHomePosition = function() {
            return {"lat": homeLat, "lng": homeLng};
        }
        plugin.init();

    }

    $.fn.esrlocation = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('esrlocation')) {
                var plugin = new $.esrlocation(this, options);
                $(this).data('esrlocation', plugin);
            }
        });

    }

})(jQuery);