<template>
  <div>
    <app-navbar></app-navbar>
    <div id="mapBox">
      <div id="geocoder">
        <b-field label="Adresse">
          <gmap-autocomplete
            class="input"
            id="test"
            placeholder="Indiquez un lieu"
            autocomplete="off"
            @place_changed="setPlace"
          ></gmap-autocomplete>
        </b-field>
      </div>
      <div id="map">
        <gmap-map :center="center" :zoom="zoom" style="width:100%; height: 60vh;" ref="gmap">
          <gmap-marker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="toggleInfoWindow(m,index)"
          ></gmap-marker>

          <gmap-info-window
            :options="infoOptions"
            :position="infoWindowPos"
            :opened="infoWinOpen"
            @closeclick="infoWinOpen=false"
          >

            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img :src=" '/api/store/avatar/' + infoContent._id + '/' + infoContent.photo" alt="Placeholder image" />
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{infoContent.name}}</p>
                  </div>
                </div>
                <div class="content">
                  <p class="subtitle is-6">
                  <span
                    id="card-tag"
                    class="tag is-light"
                    v-for="(tag, index) in infoContent.tags"
                    :key="index"
                  >{{tag}}</span>
                </p>
                  <star-rating
                    :rating="infoContent.rank"
                    :read-only="true"
                    :increment="0.1"
                    :star-size="20"
                    :show-rating="false"
                  ></star-rating>
                  <br />
                  <p>{{infoContent.adresse}}</p>
                  <router-link tag="div" :to=" '/store/' + infoContent._id " class="has-text-centered">
                <button class="button is-primary">Voir le restaurant</button>
              </router-link>
                </div>
              </div>
            </div>

          </gmap-info-window>
        </gmap-map>
      </div>

    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axiosRequest from "../axiosRequest";
export default {
  components: {
    "app-navbar": Navbar
  },
  data() {
    return {
      // default to Poitiers
      // change this to whatever makes sense
      center: {},
      zoom: 12,
      markers: [],
      places: [],
      currentPlace: null,
      infoContent: "",
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -40
        }
      }
    };
  },
  created() {
    this.geolocate();
    axiosRequest
      .getAllCoords()
      .then(response => {
        console.log(response);
        for (let marker of response) {
          this.markers.push(marker);
        }
      })
      .then(() => {
        //set bounds of the map
        this.$refs.gmap.$mapPromise.then(map => {
          const bounds = new google.maps.LatLngBounds();
          for (let m of this.markers) {
            bounds.extend(m.position);
          }
          map.fitBounds(bounds);
        });
      })
      .catch(error => console.log(error));
  },
  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
      this.center = {
        lat: this.currentPlace.geometry.location.lat(),
        lng: this.currentPlace.geometry.location.lng()
      };
      this.addMarker();
      this.zoom = 13;
      // console.log(this.currentPlace.formatted_address )
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        //Don't want to print a new marker there
        // this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = this.getInfoWindowContent(marker);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },

    getInfoWindowContent: function(marker) {
      return {
        _id : marker.infos._id,
        name: marker.infos.name,
        rank: marker.infos.rank,
        adresse: marker.infos.adresse,
        photo: marker.infos.photo,
        tags : marker.infos.tags
      };
    }
  }
};
</script>

<style scoped>
@media (max-width: 760px) {
  #test {
    width: 50%;
    height: 30px;
  }
}
@media (min-width: 760px) {
  #test {
    width: 30%;
    height: 30px;
  }
}
#mapBox {
  margin-top: 70px;
}
#geocoder {
  text-align: center;
  margin-bottom: 40px;
}
#map {
  width: 80%;
  margin: auto;
}
</style>

