/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// OnsenUI Page listener
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'page1') {
    page.querySelector('#push-button-translator').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Übersetzer'}});
    };
    page.querySelector('#push-button-game').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page4.html', {data: {title: 'Anleitung'}});
    };
  }
  else if (page.id === 'page2') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#push-button-confirm').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: 'Resultat'}});
    };
  }
  else if (page.id === 'page3') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
  else if (page.id === 'page4') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#push-button-confirm').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
    };
  }
  else if (page.id === 'page5') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#push-button-confirm').onclick = function() {
      if(true){ // add functionality of game later
        document.querySelector('#myNavigator').pushPage('page6.html', {data: {title: 'Verloren!'}});
      };
    };
  }
  else if (page.id === 'page6') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#push-button-again').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
    };
    page.querySelector('#push-button-home').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page1.html');
    };
  };
});

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

app.initialize();
