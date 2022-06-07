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
  "version": "0.2.11",
  "author": "May Bär",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Marilyth/windy-plugins"
  },
  "description": "Enables users to connect to and interact with an mscolab server.",
  "displayName": "Mscolab",
  "hook": "menu",
  "dependencies": ["https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.0/socket.io.js"],
  "className": "plugin-lhpane plugin-mobile-fullscreen"
},
/* HTML */
'<b>Mscolab Windy Interface</b> <div class="plugin-content"> <div class="tab"> <button class="tablinks active" id="login_link">Login</button> <div name="register" style="display: none;"> <button class="tablinks" id="register_link">Register</button> </div> <div name="logged_in" style="display: none;"> <button class="tablinks" id="operation_link">Operations</button> <div name="waypoints"> <button class="tablinks" id="chat_link">Chat</button> </div> </div> <div name="operation_admin" style="display: none;"> <button class="tablinks" id="manage_link">Manage</button> </div> </div> <div id="login_tab" class="tabcontent" style="display: block;"> Please enter credentials <br> <input type="text" id="mscolab_url" value="" placeholder="Mscolab URL"><br> <input type="text" id="mscolab_email" value="" placeholder="Your Email"><br> <input type="password" id="mscolab_password" value="" placeholder="Your Password"><br> <div id="register_tab" class="tabcontent" style="padding: 0px;"> <input type="password" id="mscolab_password_rpt" value="" placeholder="Repeat Your Password"><br> <input type="text" id="mscolab_name" value="" placeholder="Your Name"><br> <button id="mscolab_register">Register</button><br> </div> <div name="login"> <button id="mscolab_login">Login</button><br> </div> <div name="logged_in" style="display: none;"> <button id="mscolab_logout">Logout</button> <button id="mscolab_delete_user" style="float: right;">Delete Account</button><br> </div> <div id="status" style="font-size: large;"></div> <div id="http-auth" style="display: none;"> The server requested additional http authentication<br> <input type="text" id="mscolab_http_user" value="" placeholder="HTTP Auth Username"><br> <input type="password" id="mscolab_http_password" value="" placeholder="HTTP Auth Password"> </div> </div> <div id="operation_tab" class="tabcontent"> <div id="operation_username"></div><br> <div id="operation_list"></div><br> <div id="operation_create" style="display: none;"> <input type="text" id="operation_create_path" value="" placeholder="Operation Path"><br> <textarea id="operation_create_description" value="" placeholder="Operation Description"></textarea><br> <button id="operation_create_ok">Create</button> <div id="operation_status" style="font-size: large;"></div> </div> <div name="waypoints"> Waypoints<br> <ul id="waypoint_list"></ul> </div> </div> <div id="manage_tab" class="tabcontent"> <div name="operation_admin" style="display: none;"> Add a user to your operation:<br> <select id="operation_manage_user"></select> <select id="operation_manage_permission"> <option value="admin">Admin</option> <option value="collaborator">Collaborator</option> <option value="viewer">Viewer</option> </select><button id="operation_manage">Add</button><br> Users in this operation:<br> <ul id="operation_manage_user_list"></ul><br><br> <div name="operation_creator" style="display: none;"> Delete your operation:<br> <button id="operation_manage_delete">Delete</button><br> </div> </div> </div> <div id="chat_tab" class="tabcontent"> <ul id="chat_list"></ul> <textarea id="chat_message" value="" placeholder="Enter a message..." style="width: 100%;"></textarea><br> <button id="chat_send">Send</button><br> </div> </div>',
/* CSS */
'.onwindy-plugin-mscolab .left-border{left:400px}.onwindy-plugin-mscolab #search{display:none}#windy-plugin-mscolab{width:400px;height:100%}#windy-plugin-mscolab .plugin-content{padding:20px 15px 15px 15px;font-size:14px;line-height:1.6;color:white;background:rgba(0,0,0,0.5)}.tab{overflow:hidden;border:1px solid #5c5c5c;background-color:#353535}.tab button{background-color:#3535356e;color:whitesmoke;float:left;border:none;outline:none;cursor:pointer;padding:14px;transition:.3s;font-size:17px}.tab button:hover{background-color:#5c5c5c}.tab button.active{background-color:#707070}.tabcontent{display:none;padding:6px 12px;-webkit-animation:fadeEffect 1s;animation:fadeEffect 1s}.tabcontent::after{content:"";clear:both;display:block;float:none}@-webkit-keyframes fadeEffect{from{opacity:0}to{opacity:1}}@keyframes fadeEffect{from{opacity:0}to{opacity:1}}select{color:whitesmoke;background-color:rgba(0,0,0,0.5);border:#959595;border-style:solid;border-width:2px;padding:5px;margin:2px;width:100%;font-family:inherit;font-size:inherit;cursor:inherit;line-height:inherit}input{color:whitesmoke;background-color:rgba(0,0,0,0.5);border:#959595;border-style:solid;border-width:2px;padding:5px;margin:2px;font-family:inherit;font-size:inherit;cursor:inherit;line-height:inherit}button{color:whitesmoke;background-color:rgba(0,0,0,0.5);border:#959595;border-style:solid;border-width:2px;padding:5px;margin:2px;font-family:inherit;font-size:inherit;cursor:inherit;line-height:inherit;transition:font-size .3s ease,background-color .3s ease}button:hover{background:#5c5c5c}textarea{color:whitesmoke;background-color:rgba(0,0,0,0.5);border:#959595;border-style:solid;border-width:2px;padding:5px;margin:2px;font-family:inherit;font-size:inherit;cursor:inherit;line-height:inherit}ul{list-style-type:none;margin:0;padding:0}li{color:whitesmoke;border-bottom:1px solid #5c5c5c;background-color:rgba(0,0,0,0.3);transition:font-size .3s ease,background-color .3s ease}li:last-child{border:none}li:hover{background:#5c5c5c}',
/* Constructor */
function () {
  var _W$require = W.require('map'),
      map = _W$require.map;

  var token = null;
  var operations = null;
  var userId = null;
  var msc_url = "";
  var waypoints = [];
  var markers = [];
  var socket = null;
  var selectedOperation = -1;
  var icon = L.divIcon({
    className: 'weather-at-city',
    iconSize: [80, 40],
    iconAnchor: [40, 20]
  });

  function divVisibility(name) {
    var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "block";

    var _iterator = _createForOfIteratorHelper(document.getElementsByName(name)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;
        if (element.style) element.style.display = display;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var element = document.getElementById(name);
    if (element && element.style) element.style.display = display;
  }

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
    if (tabName == "login_tab" && !token) divVisibility("login");else divVisibility("login", "none");

    if (tabName == "register_tab") {
      tabName = "login_tab";
      document.getElementById(tabName).style.display = "block";
    }
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
        if (response.ok) return response.text();else throw Error(response.statusText);
      }).then(function (text) {
        var data = "";

        try {
          data = JSON.parse(text);
        } catch (e) {
          data = text;
        }

        callback(data);
      })["catch"](function (error) {
        console.log(error);
        document.getElementById("status").innerHTML = (endpoint + " " + error.toString()).fontcolor("red");
        if (error.toString().toLowerCase().includes("unauthorized")) document.getElementById("http-auth").style.display = "block";
        if (error.toString().toLowerCase().includes("response_data.user is undefined")) document.getElementById("status").innerHTML = "Login data was incorrect!".fontcolor("red");
        if (error.toString().toLowerCase().includes("networkerror")) document.getElementById("status").innerHTML = "Mscolab Server did not respond!".fontcolor("red");
        if (error.toString().toLowerCase().includes("forbidden")) document.getElementById("status").innerHTML = "Your Mscolab URL was likely false!".fontcolor("red");
      });
    }
  }

  function updateOperation() {
    var xmlEnd = "</ListOfWaypoints></FlightTrack>";
    var xmlBegin = "<?xml version=\"1.0\" ?><FlightTrack version=\"4.0.4.\"><ListOfWaypoints>";
    var xmlWaypoint = "<Waypoint flightlevel=\"ALTITUDE\" lat=\"LATITUDE\" location=\"LOCATION\" lon=\"LONGITUDE\"><Comments>COMMENT</Comments></Waypoint>";
    var xmlWaypoints = [];

    var _iterator2 = _createForOfIteratorHelper(waypoints),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var waypoint = _step2.value;
        var lat = waypoint["lat"],
            lon = waypoint["lon"],
            alt = waypoint["alt"],
            loc = waypoint["name"],
            com = "";
        xmlWaypoints.push(xmlWaypoint.replace("ALTITUDE", alt).replace("LATITUDE", lat).replace("LONGITUDE", lon).replace("COMMENT", com).replace("LOCATION", name));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    var file = xmlBegin + xmlWaypoints.join() + xmlEnd;
    socket.emit("file-save", {
      "token": token,
      "op_id": parseInt(getSelectedOperation()),
      "content": file,
      "comment": "Updated through Windy."
    });
  }

  function operationUpdated(event) {
    event = JSON.parse(event);
    var op_id = event["op_id"];
    var u_id = event["u_id"];

    if (op_id == getSelectedOperation() && u_id != userId) {
      console.log('Updating operation ' + op_id);
      operationSelected();
    }
  }

  function onAccessRevoked(event) {
    event = JSON.parse(event);
    var op_id = event["op_id"];
    var u_id = event["u_id"];

    if (u_id == userId) {
      console.log('Removing operation ' + op_id);
      listOperations();
    }
  }

  function onPermissionUpdated(event) {
    event = JSON.parse(event);
    var op_id = event["op_id"];
    var u_id = event["u_id"];

    if (op_id == getSelectedOperation() && u_id == userId) {
      console.log('Updating permission for ' + op_id);
      listOperations();
    }
  }

  function onNewPermission(event) {
    event = JSON.parse(event);
    var op_id = event["op_id"];
    var u_id = event["u_id"];

    if (u_id == userId) {
      console.log('New permission for ' + op_id);
      listOperations();
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

      waypoints[wp_index]["zoom"] = function () {
        return map.setView({
          lat: new_lat,
          lon: new_lon
        });
      };

      drawWaypoints();
      updateOperation();
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
      updateOperation();
    }
  }

  function removeWaypoint(index) {
    if (waypoints.length > 2) {
      var latlon = event.latlng;
      console.log("Waypoint ".concat(index, " removed"));
      waypoints.splice(index, 1);
      drawWaypoints();
      updateOperation();
    }
  }

  function sendMessage() {
    var message = document.getElementById("chat_message").value;

    if (message.length > 0) {
      socket.emit("chat-message", {
        "token": token,
        "op_id": parseInt(getSelectedOperation()),
        "message_text": message,
        "reply_id": -1
      });
      document.getElementById("chat_message").value = "";
    }
  }

  function messageReceived(event) {
    var message = JSON.parse(event);
    document.getElementById("chat_list").innerHTML += "<li id=\"Chat_".concat(message.id, "\"><").concat(message.time, "> ").concat(message.username, " said:<br>").concat(message.text, "</li>");
  }

  function inviteUser() {
    var op_id = getSelectedOperation();
    var u_id = document.getElementById("operation_manage_user").value;
    var access = document.getElementById("operation_manage_permission").value;
    var data = {
      "token": token,
      "op_id": op_id,
      "selected_userids": "[".concat(u_id, "]"),
      "selected_access_level": access
    };
    requestMsc("add_bulk_permissions", "Post", data, loadUsers);
  }

  function updateUser(u_id, access) {
    var op_id = getSelectedOperation();

    if (access != "remove") {
      var data = {
        "token": token,
        "op_id": op_id,
        "selected_userids": "[".concat(u_id, "]"),
        "selected_access_level": access
      };
      requestMsc("modify_bulk_permissions", "Post", data, loadUsers);
    } else {
      var data = {
        "token": token,
        "op_id": op_id,
        "selected_userids": "[".concat(u_id, "]")
      };
      requestMsc("delete_bulk_permissions", "Post", data, loadUsers);
    }
  }

  function deleteOperation() {
    var id = getSelectedOperation();
    var data = {
      "op_id": id,
      "token": token
    };
    requestMsc("delete_operation", "Post", data, listOperations);
    openTab("operation_tab");
  }

  function createOperation() {
    var path = document.getElementById("operation_create_path").value;
    var description = document.getElementById("operation_create_description").value;
    var data = {
      "token": token,
      "path": path,
      "description": description
    };

    if (path.length > 0) {
      requestMsc("create_operation", "Post", data, function (response) {
        if (response == "True") {
          listOperations();
          var data = {
            "token": token
          };
          requestMsc("operations", "Get", data, function (response) {
            var new_operation_id = response["operations"][response["operations"].length - 1];
            socket.emit("add-user-to-room", {
              "token": token,
              "op_id": new_operation_id
            });
          });
        } else document.getElementById("operation_status").innerHTML = "A operation with that name already exists!".fontcolor("red");
      });
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

  function loadUsers() {
    function onLoad(response_data) {
      var users = response_data.users;
      document.getElementById("operation_manage_user").innerHTML = "";

      var _iterator3 = _createForOfIteratorHelper(users),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var user = _step3.value;
          document.getElementById("operation_manage_user").innerHTML += "<option value=\"".concat(user[1], "\">").concat(user[0], "</option>");
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    function onAddedUsers(response_data) {
      document.getElementById("operation_manage_user_list").innerHTML = "";
      var users = response_data.users;

      var _iterator4 = _createForOfIteratorHelper(users),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var user = _step4.value;
          var li = "<li>".concat(user[0]);
          var select = "<select id=\"perm_".concat(user[1], "_").concat(user[0], "\" style=\"width: 35%; float: right; padding: 0px 12px; border-width: 0px; height: 19px;\">\n                                    <option value=\"admin\">Admin</option>\n                                    <option value=\"collaborator\">Collaborator</option>\n                                    <option value=\"viewer\">Viewer</option>\n                                    <option value=\"remove\">Remove</option>\n                                  </select></li>");
          select = select.replace(user[1] + "\"", user[1] + "\" selected");
          document.getElementById("operation_manage_user_list").innerHTML += li + select;

          document.getElementById("perm_".concat(user[1], "_").concat(user[0])).onchange = function () {
            return updateUser(user[2], document.getElementById("perm_".concat(user[1], "_").concat(user[0])).value);
          };
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }

    requestMsc("users_without_permission", "Get", {
      "token": token,
      "op_id": parseInt(getSelectedOperation())
    }, onLoad);
    requestMsc("users_with_permission", "Get", {
      "token": token,
      "op_id": parseInt(getSelectedOperation())
    }, onAddedUsers);
  }

  function operationSelected() {
    document.getElementById("operation_status").innerHTML = "";
    var id = getSelectedOperation();
    var access = getSelectedAccessLevel();

    function loadOperation(response_data) {
      var parser = new DOMParser();
      var operation = parser.parseFromString(response_data.content, "text/xml");
      var xml_waypoints = operation.getElementsByTagName("Waypoint");
      waypoints = [];
      var max_lat = -1000;
      var min_lat = 1000;
      var max_lon = -1000;
      var min_lon = 1000;

      var _iterator5 = _createForOfIteratorHelper(xml_waypoints),
          _step5;

      try {
        var _loop = function _loop() {
          waypoint = _step5.value;
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

        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var waypoint;

          _loop();
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      if (selectedOperation != id) {
        var southWest = L.latLng(min_lat, min_lon),
            northEast = L.latLng(max_lat, max_lon),
            bounds = L.latLngBounds(southWest, northEast);
        map.fitBounds(bounds);
      }

      selectedOperation = id;
      drawWaypoints();
      divVisibility("waypoints", "block");

      if (access == "creator" || access == "admin") {
        divVisibility("operation_admin", "block");
        if (access == "creator") divVisibility("operation_creator", "block");else divVisibility("operation_creator", "none");
        loadUsers();
      } else {
        divVisibility("operation_creator", "none");
        divVisibility("operation_admin", "none");
      }
    }

    if (id > -1) {
      document.getElementById("operation_create").style.display = "none";
      var data = {
        "token": token,
        "op_id": id
      };
      requestMsc("get_operation_by_id", "Get", data, loadOperation);
      loadChat();
    } else {
      waypoints = [];
      drawWaypoints();
      divVisibility("waypoints", "none");
      divVisibility("operation_creator", "none");
      divVisibility("operation_admin", "none");
      document.getElementById("operation_create").style.display = "block";
    }
  }

  function getSelectedOperation() {
    return document.getElementById("selected_operation").value;
  }

  function getSelectedAccessLevel() {
    var id = getSelectedOperation();
    var operation = document.getElementById("p_".concat(id));
    if (operation) return operation.innerText.split(" ").pop().replace("(", "").replace(")", "");
  }

  function loadChat() {
    document.getElementById("chat_list").innerHTML = "";

    function onLoaded(response) {
      for (var i = 0; i < response.messages.length; i++) {
        var message = response.messages[i];
        document.getElementById("chat_list").innerHTML += "<li id=\"Chat_".concat(message.id, "\"><").concat(message.time, "> ").concat(message.username, " said:<br>").concat(message.text, "</li>");
      }
    }

    var data = {
      "token": token,
      "op_id": getSelectedOperation()
    };
    requestMsc("messages", "Get", data, onLoaded);
  }

  function listOperations() {
    document.getElementById("operation_create_path").value = "";
    document.getElementById("operation_create_description").value = "";

    function onLoad(response_data) {
      operations = response_data["operations"];
      document.getElementById("operation_list").innerHTML = "Operations: <select name=\"operations\" id=\"selected_operation\"></select>";

      for (var operation_index in operations) {
        var operation = operations[operation_index];
        document.getElementById("selected_operation").innerHTML += "<option id=\"p_".concat(operation['op_id'], "\" value=\"").concat(operation['op_id'], "\">").concat(operation["path"], " (").concat(operation["access_level"], ")</option>");
      }

      document.getElementById("selected_operation").innerHTML += "<option value=\"-1\">Create New Operation</option>";
      document.getElementById("selected_operation").innerHTML = document.getElementById("selected_operation").innerHTML.replace("p_".concat(selectedOperation, "\""), "p_".concat(selectedOperation, "\" selected"));
      document.getElementById("selected_operation").onchange = operationSelected;
      operationSelected();
    }

    var data = {
      "token": token
    };
    requestMsc("operations", "Get", data, onLoad);
  }

  function postLogin(response_data) {
    token = response_data["token"];
    var data = {
      "token": token
    };
    var username = response_data["user"]["username"];
    userId = response_data["user"]["id"];
    var p_username = document.getElementById("operation_username");
    p_username.innerHTML = "Logged in as " + username;
    if (socket) socket.disconnect();
    socket = io.connect(msc_url);
    var onevent = socket.onevent;

    socket.onevent = function (packet) {
      var args = packet.data || [];
      onevent.call(this, packet);
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);
    };

    socket.on('connect', function () {
      console.log('Client has connected to the server!');
      socket.emit("start", data);
    });
    socket.on('file-changed', operationUpdated);
    socket.on('chat-message-client', messageReceived);
    socket.on('revoke-permission', onAccessRevoked);
    socket.on('update-permission', onPermissionUpdated);
    socket.on('new-permission', onNewPermission);
    socket.on('operation-deleted', function () {
      return listOperations();
    });
    socket.on('*', function (event, data) {
      return console.log("Received event ".concat(event, ": ").concat(data));
    });
    socket.on('disconnect', function () {
      console.log('The client has disconnected!');
      socket.disconnect();
      waypoints = [];
      drawWaypoints();
      token = "";
      divVisibility("logged_in", "none");
      divVisibility("login", "block");
      divVisibility("operation_creator", "none");
      divVisibility("operation_admin", "none");
      openTab("login_tab");
      divVisibility("register");
    });
    divVisibility("logged_in", "block");
    divVisibility("login", "none");
    divVisibility("register", "none");
    openTab("operation_tab");
    listOperations();
  }

  function loginMsc() {
    var register = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    msc_url = document.getElementById("mscolab_url").value;
    msc_url = msc_url.includes("localhost") || msc_url.includes("127.0.0.1") ? msc_url : msc_url.replace("http://", "https://");
    var email = document.getElementById("mscolab_email").value;
    var password = document.getElementById("mscolab_password").value;

    if (register) {
      var name = document.getElementById("mscolab_name").value;

      if (document.getElementById("mscolab_password_rpt").value != password) {
        document.getElementById("status").innerHTML = "Your passwords didn't match!".fontcolor("red");
        return;
      }

      var data = {
        "password": password,
        "email": email,
        "username": name
      };
      requestMsc("register", "Post", data, function (result) {
        if (result.success) {
          openTab("login_tab");
          document.getElementById("status").innerHTML = "Successfully registered!<br>You can login now.".fontcolor("green");
        } else {
          document.getElementById("status").innerHTML = result.message.fontcolor("red");
        }
      });
    } else {
      var data = {
        "password": password,
        "email": email
      };
      requestMsc("token", "Post", data, postLogin);
    }
  }

  document.getElementById("mscolab_login").onclick = function () {
    return loginMsc();
  };

  document.getElementById("mscolab_logout").onclick = function () {
    return socket.disconnect();
  };

  document.getElementById("mscolab_delete_user").onclick = function () {
    return requestMsc("delete_user", "Post", {
      "token": token
    }, function () {
      return socket.disconnect();
    });
  };

  document.getElementById("mscolab_register").onclick = function () {
    return loginMsc(true);
  };

  document.getElementById("chat_send").onclick = sendMessage;
  document.getElementById("operation_create_ok").onclick = createOperation;
  document.getElementById("operation_manage").onclick = inviteUser;
  document.getElementById("operation_manage_delete").onclick = deleteOperation;

  document.getElementById("login_link").onclick = function () {
    return openTab("login_tab");
  };

  document.getElementById("register_link").onclick = function () {
    return openTab("register_tab");
  };

  document.getElementById("operation_link").onclick = function () {
    return openTab("operation_tab");
  };

  document.getElementById("manage_link").onclick = function () {
    return openTab("manage_tab");
  };

  document.getElementById("chat_link").onclick = function () {
    return openTab("chat_tab");
  };

  divVisibility("register");
  document.getElementById("mscolab_email").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_email").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_password").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_password").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_password_rpt").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_password_rpt").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_url").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_url").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_name").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_name").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_http_user").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_http_user").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_http_password").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("mscolab_http_password").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("chat_message").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("chat_message").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("operation_create_path").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("operation_create_path").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("operation_create_description").addEventListener("keyup", function (e) {
    return e.stopPropagation();
  }, false);
  document.getElementById("operation_create_description").addEventListener("keydown", function (e) {
    return e.stopPropagation();
  }, false);
  map.on("click", addWaypoint);
  map.on("popupopen", popupOpened);

  this.onclose = function () {
    waypoints = [];
    drawWaypoints();
    if (socket) socket.disconnect();
    token = "";
  };
});