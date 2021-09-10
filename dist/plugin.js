"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-mscolab",
  "version": "0.1.2",
  "author": "May Bär",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Marilyth/windy-plugins"
  },
  "description": "Enables users to connect to and interact with an mscolab server.",
  "displayName": "Mscolab",
  "hook": "menu",
  "dependencies": ["https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"],
  "className": "plugin-lhpane plugin-mobile-fullscreen"
},
/* HTML */
'<b>Mscolab Windy Interface</b> <div class="plugin-content"> <div class="tab"> <button class="tablinks active" id="login_link">Login</button> <button class="tablinks" id="project_link">Projects</button> </div> <div id="login_tab" class="tabcontent" style="display: block;"> Please enter credentials <br> <input type="text" id="mscolab_url" value="" placeholder="Mscolab URL"><br> <input type="text" id="mscolab_email" value="" placeholder="Your Email"><br> <input type="password" id="mscolab_password" value="" placeholder="Your Password"><br> <button id="mscolab_login">Login</button><br> <div id="status"></div> <div id="http-auth" style="display: none;"> The server requested additional http authentication<br> <input type="text" id="mscolab_http_user" value="" placeholder="HTTP Auth Username"><br> <input type="password" id="mscolab_http_password" value="" placeholder="HTTP Auth Password"> </div> </div> <div id="project_tab" class="tabcontent"> <div id="project_username"></div><br> <div id="project_list"></div><br> Waypoints<br> <ul id="waypoint_list"></ul> </div> </div>',
/* CSS */
'.onwindy-plugin-mscolab .left-border{left:400px}.onwindy-plugin-mscolab #search{display:none}#windy-plugin-mscolab{width:400px;height:100%}#windy-plugin-mscolab .plugin-content{padding:20px 15px 15px 15px;font-size:14px;line-height:1.6;color:white;background:rgba(0,0,0,0.5)}.tab{overflow:hidden;border:1px solid #5c5c5c;background-color:#353535}.tab button{background-color:#3535356e;color:whitesmoke;float:left;border:none;outline:none;cursor:pointer;padding:14px 16px;transition:.3s;font-size:17px}.tab button:hover{background-color:#5c5c5c}.tab button.active{background-color:#707070}.tabcontent{display:none;padding:6px 12px;-webkit-animation:fadeEffect 1s;animation:fadeEffect 1s}.tabcontent::after{content:"";clear:both;display:block;float:none}@-webkit-keyframes fadeEffect{from{opacity:0}to{opacity:1}}@keyframes fadeEffect{from{opacity:0}to{opacity:1}}select{appearance:none;color:whitesmoke;background-color:rgba(0,0,0,0.5);border:#000;padding:0 1em 0 0;margin:0;width:100%;font-family:inherit;font-size:inherit;cursor:inherit;line-height:inherit}ul{list-style-type:none;margin:0;padding:0}li{color:whitesmoke;border-bottom:1px solid #5c5c5c;transition:font-size .3s ease,background-color .3s ease}li:last-child{border:none}li:hover{background:#5c5c5c}',
/* Constructor */
function () {
  var bcast = W.require('broadcast');

  var map = W.require('map');

  var websocket = null;
  var token = null;
  var projects = null;
  var userId = null;
  var msc_url = "";
  var waypoints = [];
  var markers = [];
  var socket = null;
  var icon = L.divIcon({
    className: 'weather-at-city',
    iconSize: [80, 40],
    iconAnchor: [40, 20]
  });

  function openTab(tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName.replace("tab", "link")).className += " active";
  }

  function requestMsc() {
    var endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Get";
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      "token": token
    };
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    document.getElementById("status").innerHTML = "";
    document.getElementById("http-auth").style.display = "none";
    var httpUser = document.getElementById("mscolab_http_user").value;
    var httpPass = document.getElementById("mscolab_http_password").value;
    var headers = new Headers();
    headers.set("Authorization", "Basic " + btoa(httpUser + ":" + httpPass));
    var url = msc_url + "/" + endpoint;
    var request_data = {};

    if (method == "Get") {
      var start_char = "?";

      for (var key in data) {
        url += start_char + key + "=" + data[key];
        start_char = "&";
      }

      request_data = {
        method: method,
        headers: headers
      };
    } else {
      var formdata = new FormData();

      for (var key in data) {
        formdata.append(key, data[key]);
      }

      request_data = {
        method: method,
        body: formdata,
        headers: headers
      };
    }

    if (callback == null) {
      return fetch(url, request_data).then(function (response) {
        return response;
      });
    } else {
      fetch(url, request_data).then(function (response) {
        if (response.ok) return response.json();else throw Error(response.statusText);
      }).then(function (r_data) {
        return callback(r_data);
      })["catch"](function (error) {
        console.log(error);
        document.getElementById("status").innerHTML = error.toString().fontcolor("red");
        if (error.toString().toLowerCase().includes("unauthorized")) document.getElementById("http-auth").style.display = "block";
      });
    }
  }

  function updateProject() {
    var xmlEnd = "</ListOfWaypoints></FlightTrack>";
    var xmlBegin = "<?xml version=\"1.0\" ?><FlightTrack version=\"4.0.4.\"><ListOfWaypoints>";
    var xmlWaypoint = "<Waypoint flightlevel=\"ALTITUDE\" lat=\"LATITUDE\" location=\"LOCATION\" lon=\"LONGITUDE\"><Comments>COMMENT</Comments></Waypoint>";
    var xmlWaypoints = [];

    var _iterator = _createForOfIteratorHelper(waypoints),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var waypoint = _step.value;
        var lat = waypoint["lat"],
            lon = waypoint["lon"],
            alt = waypoint["alt"],
            loc = waypoint["name"],
            com = "";
        xmlWaypoints.push(xmlWaypoint.replace("ALTITUDE", alt).replace("LATITUDE", lat).replace("LONGITUDE", lon).replace("COMMENT", com).replace("LOCATION", name));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var file = xmlBegin + xmlWaypoints.join() + xmlEnd;
    socket.emit("file-save", {
      "token": token,
      "p_id": parseInt(getSelectedProject()),
      "content": file,
      "comment": "Updated through Windy."
    });
  }

  function projectUpdated(event) {
    event = JSON.parse(event);
    var p_id = event["p_id"];
    var u_id = event["u_id"];

    if (p_id == getSelectedProject() && u_id != userId) {
      console.log('Updating project ' + p_id);
      projectSelected();
    }
  }

  function moveWaypoint(event) {
    if (waypoints.length > 0) {
      var wp_index = event["target"]["options"]["title"] - 1;
      var new_lat = event["target"]["_latlng"]["lat"];
      var new_lon = event["target"]["_latlng"]["lng"];
      console.log(wp_index, " was moved to ", new_lat, new_lon);
      waypoints[wp_index]["lat"] = new_lat;
      waypoints[wp_index]["lon"] = new_lon;
      waypoints[wp_index]["name"] = "";
      drawWaypoints();
      updateProject();
    }
  }

  function addWaypoint(event) {
    if (waypoints.length > 0) {
      var latlon = event.latlng;
      console.log("New waypoint added at ", latlon);
      waypoints.push({
        "lat": latlon["lat"],
        "lon": latlon["lng"],
        "alt": 0,
        "name": "",
        "zoom": function zoom() {
          return map.setView({
            lat: latlon["lat"],
            lng: latlon["lng"]
          });
        }
      });
      drawWaypoints();
      updateProject();
    }
  }

  function removeWaypoint(index) {
    if (waypoints.length > 2) {
      var latlon = event.latlng;
      console.log("Waypoint ".concat(index, " removed"));
      waypoints.splice(index, 1);
      drawWaypoints();
      updateProject();
    }
  }

  function popupOpened(event) {
    if (waypoints.length > 0) {
      var wp_index = parseInt(event["target"]["_popup"]["_content"].split(".")[0] - 1);

      document.getElementById("WP_RM").onclick = function () {
        return removeWaypoint(wp_index);
      };
    }
  }

  function drawWaypoints() {
    if (markers) {
      markers.forEach(function (m) {
        return map.removeLayer(m);
      });
      markers = [];
    }

    var latlons = waypoints.map(function (x) {
      return [x["lat"], x["lon"]];
    });
    var line = L.polyline(latlons, {
      color: "rgb(20, 20, 140)",
      weight: 4
    }).addTo(map);
    markers.push(line);
    document.getElementById("waypoint_list").innerHTML = "";

    for (var i = 0; i < waypoints.length; i++) {
      var waypoint = waypoints[i];
      document.getElementById("waypoint_list").innerHTML += "<li id=\"WP_".concat(i, "\">").concat(i + 1, ". (").concat(waypoint["lat"], ", ").concat(waypoint["lon"], ") ").concat(waypoint["name"], "</li>");
      var marker = L.marker([waypoint["lat"], waypoint["lon"]], {
        "draggable": true,
        "title": i + 1
      }).addTo(map);
      marker.bindPopup("".concat(i + 1, ". ").concat(waypoint["name"], "<br><button id=\"WP_RM\">Remove</button>"));
      marker.on("moveend", moveWaypoint);
      markers.push(marker);
    }

    for (var i = 0; i < waypoints.length; i++) {
      document.getElementById("WP_" + i).onclick = waypoints[i]["zoom"];
    }
  }

  function projectSelected() {
    var id = getSelectedProject();

    function loadProject(response_data) {
      var parser = new DOMParser();
      var project = parser.parseFromString(response_data.content, "text/xml");
      var xml_waypoints = project.getElementsByTagName("Waypoint");
      waypoints = [];
      var max_lat = -1000;
      var min_lat = 1000;
      var max_lon = -1000;
      var min_lon = 1000;

      var _iterator2 = _createForOfIteratorHelper(xml_waypoints),
          _step2;

      try {
        var _loop = function _loop() {
          waypoint = _step2.value;
          var lat = waypoint.getAttribute("lat");
          var lon = waypoint.getAttribute("lon");
          var alt = waypoint.getAttribute("flightlevel");
          var name = waypoint.getAttribute("location");
          max_lat = max_lat < lat ? lat : max_lat;
          max_lon = max_lon < lon ? lon : max_lon;
          min_lat = min_lat > lat ? lat : min_lat;
          min_lon = min_lon > lon ? lon : min_lon;
          waypoints.push({
            "lat": lat,
            "lon": lon,
            "alt": alt,
            "name": name,
            "zoom": function zoom() {
              return map.setView({
                lat: lat,
                lng: lon
              });
            }
          });
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var waypoint;

          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var southWest = L.latLng(min_lat, min_lon),
          northEast = L.latLng(max_lat, max_lon),
          bounds = L.latLngBounds(southWest, northEast);
      map.fitBounds(bounds);
      drawWaypoints();
    }

    var data = {
      "token": token,
      "p_id": id
    };
    requestMsc("get_project_by_id", "Get", data, loadProject);
  }

  function getSelectedProject() {
    return document.getElementById("selected_project").value;
  }

  function postLogin(response_data) {
    token = response_data["token"];
    var data = {
      "token": token
    };
    var username = response_data["user"]["username"];
    userId = response_data["user"]["id"];
    var test = document.getElementById("project_username");
    test.innerHTML = "Logged in as " + username;
    socket = io.connect(msc_url);
    socket.on('connect', function () {
      console.log('Client has connected to the server!');
      socket.emit("start", data);
    });
    socket.on('file-changed', projectUpdated);
    socket.on('disconnect', function () {
      console.log('The client has disconnected!');
      socket.disconnect();
      openTab("login_tab");
    });
    openTab("project_tab");

    function listProjects(response_data) {
      projects = response_data["projects"];
      document.getElementById("project_list").innerHTML = "Projects: <select name=\"projects\" id=\"selected_project\"></select>";

      for (var project_index in projects) {
        var project = projects[project_index];
        document.getElementById("selected_project").innerHTML += "<option value=\"".concat(project['p_id'], "\">").concat(project["path"], "</option>");
      }

      document.getElementById("selected_project").onchange = projectSelected;
      projectSelected();
    }

    requestMsc("projects", "Get", data, listProjects);
  }

  function loginMsc() {
    msc_url = document.getElementById("mscolab_url").value;
    msc_url = msc_url.includes("localhost") || msc_url.includes("127.0.0.1") ? msc_url : msc_url.replace("http://", "https://");
    var email = document.getElementById("mscolab_email").value;
    var password = document.getElementById("mscolab_password").value;
    var data = {
      "password": password,
      "email": email
    };
    requestMsc("token", "Post", data, postLogin);
  }

  document.getElementById("mscolab_login").onclick = loginMsc;

  document.getElementById("login_link").onclick = function () {
    return openTab("login_tab");
  };

  document.getElementById("project_link").onclick = function () {
    return openTab("project_tab");
  };

  map.on("click", addWaypoint);
  map.on("popupopen", popupOpened);

  this.onclose = function () {
    waypoints = [];
    drawWaypoints();
    socket.disconnect();
    token = "";
  };
});