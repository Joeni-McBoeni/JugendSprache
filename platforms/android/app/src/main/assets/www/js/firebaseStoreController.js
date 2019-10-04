

var firebaseStore = {

    // Your web app's Firebase configuration
    firebaseConfig: {
      apiKey: "AIzaSyAN7KYUoLs8MNWeacthhM-7SdPBBmyxpiU",
      authDomain: "test-uek.firebaseapp.com",
      databaseURL: "https://test-uek.firebaseio.com",
      projectId: "test-uek",
      storageBucket: "",
      messagingSenderId: "865737561532",
      appId: "1:865737561532:web:f8888d3fb66e4bc39587b9",
      measurementId: "G-YVKWSVL9DN"
    },

    initialize: function() {
      // Initialize Firebase
      firebase.initializeApp(this.firebaseConfig);
      firebase.analytics();
    },

    addItem: function(store, data) {
      console.log("adding items: " + store + ", " + data);

      var ref = firebase.database().ref(store + '/');
      ref.push(data);

      console.log("Item added to firebase: " + store + ", " + data);
    },

    getItems: function(store) {
        console.log("returning items for: " + store);


        console.log("Items returned: " + items)
        return items;
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
