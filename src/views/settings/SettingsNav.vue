<template>
  <div class="st-settings-nav">
    <div class="st-settings-nav__title">Settings</div>
    <div class="st-settings-nav__body">
      <div class="group-title">
        <h6 class="semi-bold">Security</h6>
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
      </div>
      <ul class="group">
        <router-link to="/settings/password" class="group-item">
          <p class="group-item__name">Password</p>
          <p class="group-item__desc">Authorise access to application</p>
        </router-link>
        <router-link to="/settings/recovery-phrase" class="group-item">
          <p class="group-item__name">Recovery Phrase</p>
          <p class="group-item__desc">See and backup created seed</p>
        </router-link>
        <router-link to="/settings/auto-lock" class="group-item">
          <p class="group-item__name">Auto-lock</p>
          <p class="group-item__desc">Configure idle time in application</p>
        </router-link>
      </ul>
      <!-- <p class="group-title">
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
        <li class="group-item" @click="goTo('/settings/faq')">
          <p class="group-item__name">FAQ</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings/my-tickets')">
          <p class="group-item__name">My Tickets</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings/new-ticket')">
          <p class="group-item__name">Open New Ticket</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
        <li class="group-item" @click="goTo('/settings/report-a-bug')">
          <p class="group-item__name">Report a Bug</p>
          <p class="group-item__desc">Lorem ipsum</p>
        </li>
      </ul> -->
      <!-- <div class="group-title">
        <h6 class="semi-bold">Notifications</h6>
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
      </div>

      <ul class="group">
        <router-link to="/settings/desktop-notifications" class="group-item">
          <p class="group-item__name">Desktop</p>
          <p class="group-item__desc">Notifications appear in system</p>
        </router-link>
        <router-link to="/settings/app-notifications" class="group-item">
          <p class="group-item__name">In-App</p>
          <p class="group-item__desc">Notifications appear in application</p>
        </router-link>
        <router-link to="/settings/email-notifications" class="group-item">
          <p class="group-item__name">E-mail</p>
          <p class="group-item__desc">Notifications appear in mailbox</p>
        </router-link>
      </ul>
      -->
      <div class="group-title">
        <h6 class="semi-bold">About</h6>
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
      </div>

      <ul class="group">
        <router-link to="/settings/general-information" class="group-item">
          <p class="group-item__name">General Information</p>
          <p class="group-item__desc">
            Information about Stealth and StealthSend
          </p>
        </router-link>
        <a href="" @click.prevent="openWebsite" class="group-item" target="_blank">
          <p class="group-item__name">Website</p>
          <p class="group-item__desc">Get more information</p>
        </a>
        <!-- <router-link to="/settings/website" class="group-item">
          <p class="group-item__name">Website</p>
          <p class="group-item__desc">Get more information</p>
        </router-link> -->
        <router-link to="/settings/terms-of-use" class="group-item">
          <p class="group-item__name">Terms of Use</p>
          <p class="group-item__desc">View our Terms of Use</p>
        </router-link>
        <router-link to="/settings/privacy-policy" class="group-item">
          <p class="group-item__name">Privacy Policy</p>
          <p class="group-item__desc">View our Privacy Policy</p>
        </router-link>
      </ul>
      <p class="group-title">
        <span>Help</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 16V17H6V16H10Z"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17 13H14V8H17V13Z"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 13H1L1 8H4V13Z"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M2 7C2 4 4.00015 1 9 1C13.9998 1 16 4 16 7"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path
            d="M5 17H3C1.99993 17 2.00009 17 2 16V14"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
      </p>
      <ul class="group">
        <li class="group-item" @click="goTo('/settings/delete-app-data')">
          <p class="group-item__name">Delete App Data</p>
          <p class="group-item__desc">Reset StealthSend</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import router from '@/router';

export default {
  name: 'StSettingsNav',
  setup() {
    function goTo(path) {
      console.log('path: ', path);
      router.push(path);
    }
    function openWebsite() {
            window
        .open(
          'https://stealth.org/', '_blank'
        )
        .focus();
    }
    return {
      goTo,
      openWebsite
    };
  },
};
</script>

<style scoped>
.st-settings-nav {
  min-width: 346px;
  width: 346px;
  margin-top: -83px;
  height: 100vh;
  padding: 0 24px;
  background-color: var(--background50);
}

.st-settings-nav__title {
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.32px;
  color: var(--grey1000);
  padding: 32px 24px 0 0;
  height: 50px;
  border-bottom: 1px solid var(--grey100);
}
.st-settings-nav__body {
  overflow: auto;
  height: calc(100vh - 90px);
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
.group-title h6 {
  color: var(--grey900);
}

.group-item {
  display: block;
  text-decoration: none;
  padding: 20px 0;
  border-bottom: 1px solid var(--grey100);
  cursor: pointer;
  transition: all 0.2s;
}
.group-item.router-link-active {
  border-color: var(--grey300);
}
.group-item.router-link-active .group-item__name {
  color: var(--marine500);
}
.group-item.router-link-active .group-item__desc {
  color: var(--grey700);
}
.group-item:hover {
  border-bottom: 1px solid var(--grey300);
}
.group-item:hover .group-item__name {
  color: var(--marine500);
}
.group-item:hover .group-item__desc {
  color: var(--grey700);
}

.group-item__name {
  color: var(--grey900);
  transition: all 0.2s;
}
.group-item__desc {
  color: var(--grey500);
  transition: all 0.2s;
}
</style>
