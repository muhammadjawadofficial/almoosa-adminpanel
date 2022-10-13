<template>
  <div class="standard-width page-body-container">
    <rich-text-editor v-model="content" />
  </div>
</template>

<script>
import RichTextEditor from "@/components/rich-text-editor";
export default {
  data() {
    return {
      content: "<h1>hi</h1>",
    };
  },
  components: {
    RichTextEditor,
  },
};
</script>

<style>
</style>