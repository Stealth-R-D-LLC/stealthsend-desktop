<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <h2 class="title">General Information</h2>
      <p class="subtitle">Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
      <div class="content">
        <p class="page-title">Stealth: The Fastest Private Digital Currency</p>
        <p class="text">
          We are building the Holy Grail of Crypto: a fast, feeless, private and
          scalable digital currency
        </p>
        <p class="text">Application version: v1.0.0.0.</p>
        <p class="text">
          Github Source Repository
          <br />
          <StLink> https://github.com/Stealth-R-D-LLC/Stealth </StLink>
        </p>

        <p class="text">
          This application is provided to you for free by Stealth R&D LLC
        </p>

        <p class="text">
          Exchange rate source
          <br />
          <StLink> coincap.io </StLink>
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
.content {
  margin-top: 40px;
  font-family: var(--secondary-font);
  color: var(--grey900);
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.12px;
}
.content .page-title {
  font-weight: 700;
  margin-bottom: 26px;
}

.content .text {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 14px;
  letter-spacing: 0.12px;
  line-height: 24px;
}

.content .st-link {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 14px;
  letter-spacing: 0.12px;
  line-height: 24px;
}
</style>
