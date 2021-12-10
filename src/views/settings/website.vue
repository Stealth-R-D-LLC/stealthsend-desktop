<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <h2 class="title">Website</h2>
      <p class="subtitle"></p>
      <div class="content">
        <p class="text">
          Check our website
          <br />
          <StLink> https://www.stealth.org </StLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style scoped>
.content .text {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 12px;
  letter-spacing: 0.12px;
  line-height: 24px;
}

.content .st-link {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 12px;
  letter-spacing: 0.12px;
  line-height: 24px;
}
</style>
