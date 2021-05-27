<template>
  <div class="st-settings-nav">
    <div class="st-settings-nav__title">Settings</div>
    <div class="st-settings-nav__body">
      <p class="group-title">
        <span>Security</span>
        <svg
          width="22"
          height="25"
          viewBox="0 0 22 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 11v4" stroke="#4E00F6" stroke-width="2" />
          <circle cx="11" cy="11" r="2" fill="#4E00F6" />
          <path
            d="M2 9.001l9-7 9 7c0 7-9 14-9 14s-9-6.5-9-14z"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
      </p>
      <ul class="group">
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Password</p>
          <p class="group-item__desc">Authorise access to application</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Payment Code</p>
          <p class="group-item__desc">Authorise sending funds</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Recovery Phrase</p>
          <p class="group-item__desc">See and backup created seed</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Auto-lock</p>
          <p class="group-item__desc">Configure idle time in application</p>
        </li>
      </ul>
      <p class="group-title">
        <span>Support Center</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            d="M10 16v1H6v-1h4zM17 13h-3V8h3v5zM4 13H1V8h3v5z"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M2 7c0-3 2-6 7-6s7 3 7 6M5 17H3c-1 0-1 0-1-1v-2"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
      </p>
      <ul class="group">
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">FAQ</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">My Tickets</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Open New Ticket</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Report a Bug</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
      </ul>
      <p class="group-title">
        <span>Notifications</span>
        <svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 17H8v1h2v-1zM11 1H7v1h4V1z"
            fill="#4E00F6"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path
            clip-rule="evenodd"
            d="M8.853 2.62C16 2.62 17 7 17 17H1C1 7 1.705 2.62 8.853 2.62z"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
      </p>

      <ul class="group">
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Desktop</p>
          <p class="group-item__desc">Notifications appear in system</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">In-App</p>
          <p class="group-item__desc">Notifications appear in application</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">E-mail</p>
          <p class="group-item__desc">Notifications appear in mailbox</p>
        </li>
      </ul>
      <p class="group-title">
        <span>About</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="9" stroke="#4E00F6" stroke-width="2" />
          <circle cx="10" cy="7" r="1" fill="#4E00F6" />
          <path stroke="#4E00F6" stroke-width="2" d="M10 9v5" />
        </svg>
      </p>

      <ul class="group">
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">General Information</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Website</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Privacy Policy</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings')">
          <p class="group-item__name">Terms of Use</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StSettingsNav',
  setup() {

    function goTo(path) {
      console.log('path: ', path);
    }
    return {
      goTo
    };
  },
};
</script>

<style scoped>
.st-settings-nav {
  min-width: 346px;
  width: 346px;
  padding: 0 24px;
  background-color: var(--background50);
}

.st-settings-nav__title {
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.32px;
  color: var(--grey1000);
  padding: 32px 24px 0;
  height: 50px;
  border-bottom: 1px solid var(--grey100);
}
.st-settings-nav__body {
    overflow: auto;
  height: calc(100vh - 210px);
  width: 100%;
  padding-right: 10px;
}
.st-settings-nav__body::-webkit-scrollbar {
  width: 4px;
}
.st-settings-nav__body:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.st-settings-nav__body::-webkit-scrollbar-thumb {
  background: transparent;
}

.group-title {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--grey100);
  margin: 20px 0 16px 0;
}
.group-title span {
  font-family: var(--primary-font);
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--grey900);
}

.group-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--grey100);
  cursor: pointer;
  transition: all 0.2s;
}
.group-item:hover {
  border-bottom: 1px solid var(--grey300);
}
.group-item:hover .group-item__name {
  color: var(--grey1100);
}
.group-item:hover .group-item__desc {
  color: var(--grey700);
}

.group-item__name {
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
  transition: all 0.2s;
}
.group-item__desc {
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey500);
  transition: all 0.2s;
}
</style>
