<template>
  <section>
    <b-field>
      <b-autocomplete
        v-model="name"
        placeholder="Resto, tag, adresse..."
        icon="magnify"
        :keep-first="keepFirst"
        :open-on-focus="openOnFocus"
        :data="filteredDataObj"
        field="name"
        @select="option => store(option.id)"
      >
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
  </section>
</template>

<script>
import axiosRequest from "../axiosRequest";
export default {
  data() {
    return {
      data: [],
      keepFirst: false,
      openOnFocus: false,
      name: ""
    };
  },
  methods: {
    store(e) {
      this.$router.push({ path: `/store/${e}` });
    }
  },
  computed: {
    filteredDataObj() {
      return this.data.filter(option => {
        return (
          option.name
        );
      });
    }
  },
  watch: {
    name(val) {
      if (val !== null) {
        axiosRequest
          .searchStore(val)
          .then(response => {
            this.data.length = 0;
            for (let store of response) {
              this.data.push(store);
            }
          })
          .catch(error => console.log(error));
      }
    }
  }
};
</script>

<style>
#field {
  width: 200px;
}
</style>
