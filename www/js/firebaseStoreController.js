

var firebaseStore = {

    database: null,

    initialize: function() {
      // Initialize Firebase
      var firebaseConfig = {
        apiKey: "AIzaSyAIYCExRRK_MTuo7ssPe8uT0G7rsZqCnIA",
        authDomain: "verjugendlichung.firebaseapp.com",
        databaseURL: "https://verjugendlichung.firebaseio.com",
        projectId: "verjugendlichung",
        storageBucket: "verjugendlichung.appspot.com",
        messagingSenderId: "637789281729",
        appId: "1:637789281729:web:92c234e38690444de76340",
        measurementId: "G-EX2V9TCR9T"
      };

      var defaultProject = firebase.initializeApp(firebaseConfig);

      console.log(defaultProject);

      // firebase.analytics();

      this.database = firebase.database();
    },

    addItem: function(store, data) {
      console.log("adding items: " + store + ", " + data);

      var ref = firebase.database().ref(store + '/' + data.id);
      ref.set(data);

      console.log("Item added to firebase: " + store + "/" + data.id + ", " + data);
    },

    getItems: function(store, myCallback) {
        console.log("returning items for: " + store);

        var query = firebase.database().ref(store + "/").once("value", function (snapshot) {
          console.log(snapshot);
          var items = new Array();

          snapshot.forEach(function (childSnapshot) {
            var item = childSnapshot.val();
            console.log(item);

            items.push(item);
          })

          console.log("items returned: " + store + ", " + items);
          myCallback(items);
        }, function (error) {
          console.log("Error retrieving data: " + error);
        })
    },

    removeStore: function(store) {
      localStorage.removeItem(store);
      console.log("store deleted: " + store);
    },

    isEquivalent: function(objA, objB) {
      // Create arrays of property names
      var aProps = Object.getOwnPropertyNames(objA);
      var bProps = Object.getOwnPropertyNames(objB);

      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length != bProps.length) {
          return false;
      }

      for (var i = 0; i < aProps.length; i++) {
          var propName = aProps[i];

          // If property names are not equal, objects are not equivalent
          if (propName !== bProps[i]) {
            return false;
          }

          // If values of same property are not equal,
          // objects are not equivalent
          if (objA[propName] !== objB[propName]) {
              return false;
          }
      }

      // If we made it this far, objects
      // are considered equivalent
      return true;
    },

    removeItem: function(store, data) {
      var items = this.getItems(store);

      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (this.isEquivalent(item, data)) {
          items.splice(i, 1);
        }
      }

      localStorage.setItem(store, JSON.stringify(items));

      console.log("item removed: " + store + ", " + data);
    }
}

firebaseStore.initialize();
