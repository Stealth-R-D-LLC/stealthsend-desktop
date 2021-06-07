<template>
  <div class="st-settings-child st-password-container">
    <div class="title-bar">
      <div class="left">
        <h2 class="title">Set a new password</h2>
        <p class="subtitle">
          Entering your password will unlock access to your wallet
        </p>
      </div>
      <div class="right">
        <StButton>Save</StButton>
      </div>
    </div>
    <div class="content">
      <p class="notice">
        <span class="bold">Important note:</span> Please be aware that if you
        lose my password, the only access to your account will be through the
        use of Recovery Phrase.
      </p>
        <StFormItem label="Current password" notice="Please enter a password you are using to access the application">
          <StInput type="password" placeholder="Please enter current password"></StInput>
        </StFormItem>
        <StFormItem label="New password" notice="Please enter a unique and unused password for accessing the application">
          <StInput type="password" placeholder="Please enter new password"></StInput>
        </StFormItem>
        <StFormItem label="Confirm password" notice="Newly set password need to match">
          <StInput type="password" placeholder="Please confirm new password"></StInput>
        </StFormItem>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StSettingsPassword',
  setup() {
    return {};
  },
};
</script>

<style scoped>
.notice {
  padding: 24px;
  background-color: var(--background100);
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
  margin: 28px 0;
}

.notice .bold {
  font-weight: bold;
}
.notice p {
  text-align: left;
}
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.st-form-item {
  margin-bottom: 80px !important;
}
</style>
