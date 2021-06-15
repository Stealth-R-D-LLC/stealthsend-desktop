<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <h2 class="title">Privacy Policy</h2>
      <p class="subtitle">Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
      <div class="content">
        <div class="content__inner" v-for="(n, index) in 3" :key="n">
          <p class="medium">{{ index + 1 }}. General information</p>
          <p class="desc">
            Stealth R&D, LLC, a Delaware (USA) limited liability company
            ("Stealth," "we" or "us") is the operator of this website, together
            with other websites and social media channels (each a "website" and
            together, our "websites"). As the operator of the sites, we take the
            protection of your personal data very seriously. We collect, process
            and use your personal data in accordance with this privacy policy
            and in compliance with the General European Data Protection
            Regulation ("GDPR").
          </p>
          <p class="desc">
            This privacy policy ("Privacy Policy") will provide you with
            information about the collection, processing and use of your
            personal data when using our websites.
          </p>
          <p class="desc">
            In case you provide us with the personal data of third persons (such
            as family members, work colleagues) you should make sure that these
            persons are familiar with this Privacy Policy and you should only
            share their personal data if you have permission to do so and ensure
            that his personal data is correct.
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
.content .medium {
  margin-bottom: 30px;
}
.content .desc + .desc {
  margin-top: 30px;
}
</style>
