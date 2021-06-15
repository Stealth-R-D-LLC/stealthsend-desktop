<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <h2 class="title">Terms Of Use</h2>
      <p class="subtitle">This Terms of Use (“ToU” and/or “Terms”)</p>
      <div class="content">
        <div class="content__inner" v-for="(n, index) in 3" :key="n">
          <p class="desc">
            {{ index + 1 }}. A. These Terms shall be considered to be a
            framework agreement which sets out the terms of:
          </p>
          <p class="desc">
            A) you and us entering into Business relationship by providing you
            services of cryptocurrencie transaction(s); and
          </p>
          <p class="desc">
            B) the use of the Stealth mobile wallet Dashboard and other Stealth
            mobile wallet Services
          </p>
          <p class="desc">
            C) you using any of our services related to or utilizing any of the
            foregoing, which we refer to in this Terms.
          </p>
          <p class="desc">
            Before you can enter into Stealth mobile walletvTransactions and
            benefit from the Stealth mobile wallet Services with us you are
            required to:
          </p>
          <p class="desc">
            • carefully read these Terms and validate that you have read them by
            ticking the box confirming the accuracy of the information.
          </p>
          <p class="desc">
            "Top-Up" means you or a third party sending money to us in return
            for us issuing Electronic
          </p>
        </div>
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
  max-width: 503px;
  margin-right: auto;
}
.content .content__inner + .content__inner {
  margin-top: 30px;
}
.content .desc + .desc {
  margin-top: 30px;
}
</style>
