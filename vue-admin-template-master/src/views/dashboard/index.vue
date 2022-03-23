<template>
  <div class="dashboard-container">
    <div class="main">
     <Topview> </Topview >
     <Middinview> </Middinview >
     <Bottomview> </Bottomview >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Topview from "@/views/dashboard/components/Topview";
import Middinview from "@/views/dashboard/components/Middinview";
import Bottomview from "@/views/dashboard/components/Bottomview";
export default {
  name: "Dashboard",
  components: {
    Topview,
    Middinview,
    Bottomview
  },
  computed: {
    ...mapGetters(["name"])
  },
  mounted() {
    this.getechartsData();
  },
  methods: {
    getechartsData() {
      this.$store.dispatch("ecarths/getechartsData");
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  .main {
    background-color: #aaa;
    padding: 20px;
  }
}
</style>
