<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <vue-editor :value="value" @input="handleChange"></vue-editor>
        </div>
      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor,
  },
  props: ["value"],
  data() {
    return {
      content: "<h1>Some initial content</h1>",
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
      this.$emit("input", val);
    },
  },
};
</script>