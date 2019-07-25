<template>
  <div>
    <app-navbar></app-navbar>
    <div class="container">
      <div class="columns">
        <!-- <div id="tags" class="column">
          <app-tags></app-tags>
        </div>-->
        <div class="column">
          <!-- Content -->
          <component :is="selectedComponent"></component>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import Navbar from "@/components/Navbar.vue";
import listTags from "@/components/list-tags.vue";
import listRestaurant from "@/components/list-restaurants";

export default {
  name: "home",
  components: {
    "app-navbar": Navbar,
    "app-list-tags": listTags,
    "app-list-restaurants": listRestaurant
  },
  data() {
    return {
      selectedComponent: "app-list-restaurants"
    };
  },
  created() {
    this.selectedComponent = "app-list-restaurants";
  },
  watch: {
    tags(val) {
      if (val.length > 0) {
        this.selectedComponent = "app-list-tags";
      } else {
        this.selectedComponent = "app-list-restaurants";
      }
    }
  },
  computed: {
    tags() {
      return this.$store.getters.tags;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.tags = [];
    next();
  }
};
</script>

<style scoped>
/* #mainContent {
    
} */
#tags {
  order: 2;
}
.container {
  margin-top: 80px;
}
/* #displayStores {
  background-color : #f5f5f5
} */
</style>


