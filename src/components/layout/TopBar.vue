<template>
  <div :class="computedClass">
    <header class="layout__header" :class="`layout__header-${currentRoute}`">
      <div class="header-left">
        <template v-if="checkVisibilityForRoute(['Dashboard'])">
          <div :class="{ nonclickable: !componentVisibility.txDashboard }">
            <svg
              :class="{ inactive: !componentVisibility.chart }"
              @click="toggleComponentVisibility('chart')"
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 18V7"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M6 18V9"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M10 18V0"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M14 18V4"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div :class="{ nonclickable: !componentVisibility.chart }">
            <svg
              :class="{ inactive: !componentVisibility.txDashboard }"
              @click="toggleComponentVisibility('txDashboard')"
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 1H18"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 1H2"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M4 6H18"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 6H2"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M4 11H18"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 11H2"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </template>
        <template v-if="checkVisibilityForRoute(['AccountDetails'])">
          <div
            v-if="account"
            class="account-switcher"
            @click="openAccountModal"
          >
            <h6>{{ account && account.label }}</h6>
            <svg
              width="8"
              height="7"
              viewBox="0 0 8 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 0.5H0L4 6.5L8 0.5Z" fill="#4E00F6" />
            </svg>
          </div>
          <!-- <StMultiselect
          v-model="account"
          :class="{ 'multiselect-filled': account }"
          :options="accounts"
          track-by="address"
          value-prop="address"
          label="label"
          :object="true"
          :can-deselect="false"
          placeholder="Select account"
          @select="accountChanged"
        >
          <template #singleLabel>
            <h6>
              {{ account && account.label }}
            </h6>
          </template>

          <template #option="{ option }">
            <div class="flex-space-between">
              <span>
                {{ option.label }}
              </span>
              <span> {{ option.utxo }} XST </span>
            </div>
          </template>
        </StMultiselect> -->
          <div class="icons-flex">
            <StTooltip
              class="tooltip"
              :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
            >
              <svg
                v-if="isHiddenAmounts"
                @click="toggleHiddenAmounts"
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 11C14.3137 11 17.3137 9.33333 20 6C17.3137 2.66667 14.3137 1 11 1C7.68629 1 4.68629 2.66667 2 6C4.68629 9.33333 7.68629 11 11 11Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <circle
                  r="1"
                  transform="matrix(-1 0 0 1 11 6)"
                  fill="#4E00F6"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
              </svg>
              <svg
                v-else
                @click="toggleHiddenAmounts"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path d="M7 8L12 8" stroke="#4E00F6" stroke-width="2" />
                <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
              </svg>
            </StTooltip>
            <StTooltip class="tooltip" tooltip="Account Keys">
              <svg
                @click="isVisible = true"
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.6111 10.2529V12.2529"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  d="M9.61108 10.2529V13.2529"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  d="M16.6111 10.2529L8.61108 10.2529"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  d="M18.1111 12.7529C19.4918 12.7529 20.6111 11.6336 20.6111 10.2529C20.6111 8.87222 19.4918 7.75293 18.1111 7.75293C16.7304 7.75293 15.6111 8.87222 15.6111 10.2529C15.6111 11.6336 16.7304 12.7529 18.1111 12.7529Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  d="M16.6111 15.2532C14.2112 18.2532 11.6111 20.2532 11.6111 20.2532C11.6111 20.2532 9.11112 18.2532 6.61113 15.2532C4.11113 12.2532 3.61112 9.25314 3.61112 9.25314L11.6111 2.25315L15.6111 5.75315"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
              </svg>
            </StTooltip>
          </div>
        </template>
        <template
          v-if="
            checkVisibilityForRoute(['Transactions']) ||
            checkVisibilityForRoute(['TransactionsQuery'])
          "
        >
          <div class="icons-flex">
            <StTooltip
              class="tooltip"
              :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
            >
              <svg
                v-if="isHiddenAmounts"
                @click="toggleHiddenAmounts"
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 11C14.3137 11 17.3137 9.33333 20 6C17.3137 2.66667 14.3137 1 11 1C7.68629 1 4.68629 2.66667 2 6C4.68629 9.33333 7.68629 11 11 11Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <circle
                  r="1"
                  transform="matrix(-1 0 0 1 11 6)"
                  fill="#4E00F6"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
              </svg>
              <svg
                v-else
                @click="toggleHiddenAmounts"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path d="M7 8L12 8" stroke="#4E00F6" stroke-width="2" />
                <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
              </svg>
            </StTooltip>
          </div>
        </template>
        <template v-if="checkVisibilityForRoute(['ArchivedAccounts'])">
          <StTooltip
            class="tooltip"
            :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
          >
            <svg
              v-if="isHiddenAmounts"
              @click="toggleHiddenAmounts"
              width="22"
              height="12"
              viewBox="0 0 22 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11 11C14.3137 11 17.3137 9.33333 20 6C17.3137 2.66667 14.3137 1 11 1C7.68629 1 4.68629 2.66667 2 6C4.68629 9.33333 7.68629 11 11 11Z"
                stroke="#4E00F6"
                stroke-width="2"
              />
              <circle
                r="1"
                transform="matrix(-1 0 0 1 11 6)"
                fill="#4E00F6"
                stroke="#4E00F6"
                stroke-width="2"
              />
            </svg>
            <svg
              v-else
              @click="toggleHiddenAmounts"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
                stroke="#4E00F6"
                stroke-width="2"
              />
              <path d="M7 8L12 8" stroke="#4E00F6" stroke-width="2" />
              <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
            </svg>
          </StTooltip>
          <StTooltip class="tooltip" tooltip="Favorite List">
            <svg
              @click="toggleDrawer('favourite-list')"
              class="favourite-list"
              width="24"
              height="24"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6218 6.61132L12.8885 3.14551L9.83282 9.33709L3 10.33L7.94427 15.1494L6.77709 21.9546L12.8885 18.7417L19 21.9546"
                stroke="#4E00F6"
                stroke-width="2"
              />
              <path
                d="M22.4131 7.14551L18.4131 7.14551"
                stroke="#4E00F6"
                stroke-width="2"
              />
              <line
                x1="22.4131"
                y1="11.1455"
                x2="14.4131"
                y2="11.1455"
                stroke="#4E00F6"
                stroke-width="2"
              />
              <line
                x1="22.4131"
                y1="15.1455"
                x2="14.4131"
                y2="15.1455"
                stroke="#4E00F6"
                stroke-width="2"
              />
            </svg>
          </StTooltip>
        </template>
      </div>
      <div class="header-right">
        <p class="rpc-status">{{ rpcStatus }}</p>
        <StTooltip class="tooltip" tooltip="Connected to Mainnet">
          <svg
            class="rpc-icon"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="11" fill="#E0D3FC" />
            <path
              d="M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C12.0736 4 13.0907 4.24169 14 4.67363"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path d="M17 7L11 13L8 10" stroke="#4E00F6" stroke-width="2" />
          </svg>
        </StTooltip>
        <!-- <StIcon name="support"></StIcon> -->
        <!-- <StIcon
        name="notifications"
        @click="toggleDrawer('recent-notifications')"
      ></StIcon> -->
        <StTooltip class="tooltip" tooltip="Quick Receive">
          <svg
            @click="openQuickDeposit"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7 7H1V1H7V7Z"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path d="M11 0V3H14V1H17V5" stroke="#4E00F6" stroke-width="2" />
            <path d="M7 18V16H4V17H1V14" stroke="#4E00F6" stroke-width="2" />
            <path d="M11 18V16H14V17H17V14" stroke="#4E00F6" stroke-width="2" />
            <path d="M11 13H7V11H4" stroke="#4E00F6" stroke-width="2" />
            <path d="M10 7H18" stroke="#4E00F6" stroke-width="2" />
            <path d="M14 9V11H17V9" stroke="#4E00F6" stroke-width="2" />
            <path d="M1 10V12" stroke="#4E00F6" stroke-width="2" />
            <path d="M11 9V10.6364" stroke="#4E00F6" stroke-width="2" />
          </svg>
        </StTooltip>
        <StTooltip class="tooltip tooltip-custom" tooltip="Settings">
          <svg
            @click="goto('/settings')"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 11L18 11" stroke="#4E00F6" stroke-width="2" />
            <path
              d="M4 14C5.65685 14 7 12.6569 7 11C7 9.34315 5.65685 8 4 8C2.34315 8 1 9.34315 1 11C1 12.6569 2.34315 14 4 14Z"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path d="M0 4H7" stroke="#4E00F6" stroke-width="2" />
            <path
              d="M14 7C15.6569 7 17 5.65685 17 4C17 2.34315 15.6569 1 14 1C12.3431 1 11 2.34315 11 4C11 5.65685 12.3431 7 14 7Z"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path d="M7 17H18" stroke="#4E00F6" stroke-width="2" />
          </svg>
        </StTooltip>
      </div>
      <StModal
        light
        :visible="isVisible"
        @close="closeModal"
        class="account-modal"
      >
        <template #header>{{
          checkPassword
            ? 'Password Required'
            : account.isImported
            ? 'Account Keys'
            : 'Account Key'
        }}</template>
        <template #body>
          <div v-if="!checkPassword" class="account-tabs">
            <a
              :class="{ active: activeStep === 'public-key' }"
              @click="changeStep('public-key')"
              >Public Key</a
            >
            <a
              v-if="account && account.isImported"
              :class="{ active: activeStep === 'private-key' }"
              @click="changeStep('private-key')"
              >Private Key</a
            >
          </div>
          <div v-if="activeStep === 'public-key'">
            <template v-if="!publicQrCode">
              <div class="desc">
                <p>
                  The Public Key provides access to transactions records and
                  balances, but does not allow sending of funds.
                </p>
              </div>
              <p class="bold" v-if="!account.isImported">xpub</p>
              <p class="bold" v-else>Public Key</p>
              <p class="key">{{ publicKey }}</p>
              <div class="copy-key">
                <p>
                  Copy <span v-if="!account.isImported">xpub</span>
                  <span v-else>public key</span> to clipboard or show QR code
                </p>
                <div>
                  <StTooltip
                    :tooltip="
                      copyPending ? 'Copied to clipboard!' : 'Copy to Clipboard'
                    "
                  >
                    <StClipboard :content="publicKey" @click="handleCopy">
                      <svg
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 6H1V21H13V6Z"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <line
                          x1="17"
                          y1="18"
                          x2="17"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path
                          d="M3 1L18 1"
                          stroke="#4E00F6"
                          stroke-width="2"
                        /></svg
                    ></StClipboard>
                  </StTooltip>
                  <StTooltip tooltip="Show QR Code">
                    <svg
                      @click="generatePublicQr"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9 9H1V1H9V9Z"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M13 0V4H17V1H21V6"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M9 22V19H5V21H1V17"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M13 22V18H17V21H21V18"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M11 15H8V13H4"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path d="M12 9H22" stroke="#4E00F6" stroke-width="2" />
                      <path
                        d="M17 11V14H21V11"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path d="M1 12V15" stroke="#4E00F6" stroke-width="2" />
                      <path d="M13 11V13" stroke="#4E00F6" stroke-width="2" />
                    </svg>
                  </StTooltip>
                </div>
              </div>
              <p
                v-if="!account.isImported && !account.wif"
                @click="openBlockExplorer"
                class="view-more bold"
              >
                View on StealthMonitor
              </p>
            </template>
            <template v-else>
              <img class="qr-code" :src="publicQrCode" />
              <p @click="publicQrCode = ''" class="view-more bold">
                Hide QR code
              </p>
            </template>
          </div>
          <div v-if="activeStep === 'private-key'">
            <template v-if="checkPassword">
              <p class="password-desc">
                Enter your password to authorize this action
              </p>
              <form class="form" @submit.prevent>
                <StFormItem
                  class="custom-form-item"
                  :filled="password"
                  label="Password"
                  :error-message="form.password.$errors"
                >
                  <StInput
                    v-model="password"
                    placeholder="Please enter your password"
                    :type="showPassword ? 'text' : 'password'"
                  >
                    <StTooltip
                      class="tooltip"
                      :tooltip="
                        !showPassword ? 'Show Password' : 'Hide Password'
                      "
                    >
                      <svg
                        v-if="!showPassword"
                        @click="showPassword = true"
                        width="22"
                        height="12"
                        viewBox="0 0 22 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11 11C14.3137 11 17.3137 9.33333 20 6C17.3137 2.66667 14.3137 1 11 1C7.68629 1 4.68629 2.66667 2 6C4.68629 9.33333 7.68629 11 11 11Z"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <circle
                          r="1"
                          transform="matrix(-1 0 0 1 11 6)"
                          fill="#4E00F6"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                      </svg>

                      <svg
                        v-else
                        @click="showPassword = false"
                        width="22"
                        height="16"
                        viewBox="0 0 22 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path d="M7 8L12 8" stroke="#4E00F6" stroke-width="2" />
                        <path
                          d="M19 1L5 15"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                      </svg>
                    </StTooltip>
                  </StInput>
                </StFormItem>
                <StButton
                  v-show="Boolean(false)"
                  color="white"
                  @click="validatePassword"
                  >Continue</StButton
                >
              </form>
            </template>
            <template v-else>
              <template v-if="!privateQrCode">
                <div class="desc">
                  <p>
                    The Private Key provides control over current and future
                    balances of XST on this device.
                  </p>
                </div>
                <p class="bold">Private Key</p>
                <p class="key">{{ privateKey }}</p>
                <div class="copy-key copy-key__private">
                  <p>Copy privkey to clipboard or show QR code</p>
                  <div>
                    <StTooltip
                      :tooltip="
                        copyPending
                          ? 'Copied to clipboard!'
                          : 'Copy to Clipboard'
                      "
                    >
                      <StClipboard :content="privateKey" @click="handleCopy">
                        <svg
                          width="18"
                          height="22"
                          viewBox="0 0 18 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 6H1V21H13V6Z"
                            stroke="#4E00F6"
                            stroke-width="2"
                          />
                          <line
                            x1="17"
                            y1="18"
                            x2="17"
                            stroke="#4E00F6"
                            stroke-width="2"
                          />
                          <path
                            d="M3 1L18 1"
                            stroke="#4E00F6"
                            stroke-width="2"
                          /></svg
                      ></StClipboard>
                    </StTooltip>
                    <StTooltip tooltip="Show QR code">
                      <svg
                        @click="generatePrivateQr"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9 9H1V1H9V9Z"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path
                          d="M13 0V4H17V1H21V6"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path
                          d="M9 22V19H5V21H1V17"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path
                          d="M13 22V18H17V21H21V18"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path
                          d="M11 15H8V13H4"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path d="M12 9H22" stroke="#4E00F6" stroke-width="2" />
                        <path
                          d="M17 11V14H21V11"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path d="M1 12V15" stroke="#4E00F6" stroke-width="2" />
                        <path d="M13 11V13" stroke="#4E00F6" stroke-width="2" />
                      </svg>
                    </StTooltip>
                  </div>
                </div>
              </template>
              <template v-else>
                <img class="qr-code" :src="privateQrCode" />
                <p @click="privateQrCode = ''" class="view-more bold">
                  Hide QR code
                </p>
              </template>
            </template>
          </div>
        </template>
      </StModal>
      <StModal
        light
        :visible="accountVisible"
        @close="accountVisible = false"
        class="account-modal"
      >
        <template #header>Select Account</template>
        <template #body>
          <div class="account-overflow">
            <div
              class="account-card"
              v-for="acc in accounts"
              :key="acc.label"
              @click="selectAccount(acc.label)"
            >
              <div class="account-card__header">
                <h6>{{ acc.label }}</h6>
                <div
                  class="radio"
                  :class="{ 'radio-active': showArrow === acc.label }"
                />
              </div>
              <div class="account-card__content">
                <div class="account-card__content--amount">
                  <h6>{{ amountFormat(acc).amountLeft }} XST</h6>
                  <p>~ ${{ amountFormat(acc).amountRight }} USD</p>
                </div>
                <transition name="fade">
                  <div
                    v-if="showArrow === acc.label"
                    class="account-card__content--icon"
                    @click="accountChanged(acc)"
                  >
                    <StTooltip class="tooltip" tooltip="Apply">
                      <svg
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 8H16" stroke="#4E00F6" stroke-width="2" />
                        <path
                          d="M10.3535 15L16.0006 8L10.3535 1"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                      </svg>
                    </StTooltip>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </template>
      </StModal>
    </header>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import CryptoService from '@/services/crypto';
import useHelpers from '@/composables/useHelpers';
import { multiply } from 'mathjs';
import emitter from '@/services/emitter';
import VanillaQR from 'vanillaqr';
import { useValidation } from 'vue3-form-validation';
import db from '../../db';

export default {
  setup() {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();
    const route = useRoute();
    const account = ref(null);
    const accounts = ref([]);
    const isVisible = ref(false);
    const accountVisible = ref(false);
    const rpcStatus = ref('');
    const activeStep = ref('public-key');
    const publicKey = ref('');
    const privateKey = ref('');
    const publicQrCode = ref('');
    const privateQrCode = ref('');
    const checkPassword = ref(false);
    const showPassword = ref(false);
    const password = ref('');
    const showArrow = ref('');

    const {
      form,
      // errors,
      // add,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation({
      password: {
        $value: password,
        $rules: [
          async (password) => {
            if (!password) {
              return 'Password is required.';
            }
            let isValid = await CryptoService.validatePassword(password);
            if (!isValid) {
              return 'Incorrect password.';
            }
          },
        ],
      },
    });

    const currentRoute = computed(() => {
      return route.name;
    });

    const computedClass = computed(() => {
      let headerColor = '';
      if (route.path.split('/').includes('account')) {
        headerColor = 'grey';
      } else {
        headerColor = 'default';
      }
      console.log('This is header color' + headerColor);
      return {
        'layout__header--is-grey': headerStyle.value != headerColor,
        'layout__header--settings': route.path.split('/').includes('settings'),
      };
    });

    const headerStyle = computed(() => mainStore.headerStyle);

    const componentVisibility = computed(() => {
      return mainStore.componentVisibility;
    });

    const isHiddenAmounts = computed(() => {
      return mainStore.isAmountsHidden;
    });

    onMounted(async () => {
      if (!componentVisibility.value.chart) {
        toggleComponentVisibility('chart');
      }
      if (!componentVisibility.value.txDashboard) {
        toggleComponentVisibility('txDashboard');
      }
      if (
        window.history.state.current &&
        window.history.state.back === '/lock'
      ) {
        try {
          await mainStore.rpc('getinfo', []);
          rpcStatus.value = `Connected to ${
            process.env.VUE_APP_NETWORK[0].toUpperCase() +
            process.env.VUE_APP_NETWORK.substring(1)
          }`;
          setTimeout(() => (rpcStatus.value = ''), 5000);
        } catch (error) {
          rpcStatus.value = `Not connected to ${
            process.env.VUE_APP_NETWORK[0].toUpperCase() +
            process.env.VUE_APP_NETWORK.substring(1)
          }`;
          setTimeout(() => (rpcStatus.value = ''), 5000);
        }
      }
    });

    watch(
      () => isVisible.value,
      async () => {
        if (isVisible.value) {
          await scanWallet();
          getPublicKey();
        }
      }
    );

    async function validatePassword() {
      if (await validateFields()) {
        // privateQrCode.value = '123'
        getPrivateKey();
        activeStep.value = 'private-key';
        checkPassword.value = false;
        password.value = '';
      }
    }

    function getPublicKey() {
      if (!account.value) return;
      if (account.value.isImported && account.value.wif) {
        publicKey.value = account.value.publicKey;
      } else {
        const path = CryptoService.breakAccountPath(account.value.path);
        const { xpub } = CryptoService.getKeysForAccount(
          path.account,
          path.change,
          path.address
        );
        publicKey.value = xpub;
      }
    }

    async function getPrivateKey() {
      if (account.value.isImported) {
        const wallet = await db.getItem('wallet');
        try {
          const secretKey = await CryptoService.AESDecrypt(
            account.value.wif,
            wallet.password
          );
          privateKey.value = secretKey;
        } catch (e) {
          console.error(e);
          privateKey.value = '';
        }
      } else {
        const path = CryptoService.breakAccountPath(account.value.path);
        const { secretKey } = CryptoService.getKeysForAccount(
          path.account,
          path.change,
          path.address
        );
        privateKey.value = secretKey;
      }
    }

    async function changeStep(step) {
      activeStep.value = step;
      publicQrCode.value = '';
      privateQrCode.value = '';
      if (step === 'private-key') {
        checkPassword.value = true;
      }
      privateKey.value = '';
      resetFields();
      await scanWallet();
      getPublicKey();
    }

    function closeModal() {
      isVisible.value = false;
      activeStep.value = 'public-key';
      publicQrCode.value = '';
      checkPassword.value = false;
      privateQrCode.value = '';
      publicKey.value = '';
      privateKey.value = '';
    }

    function toggleDrawer(canvas) {
      mainStore.SET_CURRENT_CANVAS(canvas);
      mainStore.TOGGLE_DRAWER(true);
    }

    function toggleHiddenAmounts() {
      mainStore.SET_AMOUNTS_HIDDEN(!isHiddenAmounts.value);
    }

    function checkVisibilityForRoute(routes = []) {
      if (!currentRoute.value) return false;
      return routes.includes(currentRoute.value);
    }

    function toggleComponentVisibility(component) {
      mainStore.SET_COMPONENT_VISIBILITY(
        component,
        !componentVisibility.value[component]
      );
      if (component === 'txDashboard') {
        mainStore.REFRESH_CHART(true);
        setTimeout(() => mainStore.REFRESH_CHART(false), 1);
      }
    }

    function openQuickDeposit() {
      mainStore.SET_MODAL_VISIBILITY('quickReceive', true);
    }

    function goto(path) {
      router.push(path);
    }

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

    async function scanWallet() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const hdWallet = await CryptoService.scanWallet();
        accounts.value = hdWallet.accounts;
        // select first option
        account.value = mainStore.accountDetails;
        resolve();
      });
    }

    function generatePublicQr() {
      let qr = new VanillaQR({
        url: publicKey.value,
        noBorder: false,
        colorDark: '#140435',
        colorLight: '#FAF9FC',
      });
      publicQrCode.value = qr.toImage('png').src;
    }

    function generatePrivateQr() {
      let qr = new VanillaQR({
        url: privateKey.value,
        noBorder: false,
        colorDark: '#140435',
        colorLight: '#FAF9FC',
      });
      privateQrCode.value = qr.toImage('png').src;
    }

    function openBlockExplorer() {
      const chain =
        process.env.VUE_APP_NETWORK === 'mainnet'
          ? '?chain=main'
          : '?chain=test';
      window
        .open(
          'https://stealthmonitor.org/xPub/' + publicKey.value + chain,
          '_blank'
        )
        .focus();
    }

    function amountFormat(account) {
      return {
        asset: 'XST',
        amountLeft: `${formatAmount(account.utxo, false, 6, 6)}`,
        amountRight: `${formatAmount(
          multiply(account.utxo, CryptoService.constraints.XST_USD),
          false,
          4,
          4
        )}`,
        percentage: formatAmount(
          CryptoService.constraints.changePercent24Hr,
          false,
          2
        ),
      };
    }

    const changedAccount = ref('');

    function accountChanged(account) {
      mainStore.SET_ACCOUNT_DETAILS(account);
      scanWallet();
      setTimeout(() => {
        emitter.emit('header:account-changed', account);
      }, 1);
      accountVisible.value = false;
    }

    function openAccountModal() {
      showArrow.value = account.value.label;
      accountVisible.value = true;
    }

    function selectAccount(account) {
      showArrow.value = account;
    }

    // manually trigger retrieving keys
    changeStep('public-key');

    return {
      toggleDrawer,
      currentRoute,
      componentVisibility,
      checkVisibilityForRoute,
      toggleComponentVisibility,
      goto,
      openQuickDeposit,
      headerStyle,
      isVisible,
      accountVisible,
      changeStep,
      activeStep,
      publicKey,
      privateKey,
      copyPending,
      handleCopy,
      publicQrCode,
      privateQrCode,
      checkPassword,
      rpcStatus,
      showPassword,
      password,
      closeModal,
      generatePublicQr,
      openBlockExplorer,
      validatePassword,

      scanWallet,
      account,
      accounts,
      changedAccount,
      toggleHiddenAmounts,
      isHiddenAmounts,
      accountChanged,
      generatePrivateQr,

      form,
      validateFields,
      resetFields,
      computedClass,
      amountFormat,
      showArrow,
      selectAccount,
      openAccountModal,
    };
  },
};
</script>

<style scoped>
.layout__header {
  border-bottom: 1px solid var(--grey100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout__header-Dashboard {
  padding: 41px 0 26px !important;
}
.layout__header-Transactions {
  padding: 39px 0 26px !important;
}
.layout__header--settings {
  width: calc(100% - 392px);
  margin-left: auto;
}
.layout__header--settings .layout__header {
  padding: 43px 0 24px !important;
}
.layout__header--is-grey {
  background: var(--background100);
}
.layout__header--is-grey .layout__header {
  margin: 0 24px;
  padding: 41px 0 26px;
}
.header-left,
.header-right {
  width: 100%;
  display: flex;
  align-items: center;
}
:deep .multiselect {
  max-width: 170px;
}
.header-right {
  justify-content: flex-end;
  min-height: 24px;
}

.header-left div + div,
.header-right .tooltip + .tooltip {
  margin-left: 24px;
}
.header-right .tooltip-custom:before {
  right: calc(50% + 10px);
}

/* .favourite-list {
  margin-left: 24px;
} */

.header-left .tooltip + .tooltip {
  margin-left: 24px;
}

.layout__header svg:hover {
  cursor: pointer;
}
:deep path {
  transition: 0.3s;
}
.nonclickable {
  position: relative;
}
.nonclickable::before {
  content: '';
  cursor: not-allowed;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
}
:deep .inactive path {
  stroke: var(--marine100);
}
:deep .multiselect__tags::after {
  display: none;
}
:deep .multiselect-filled .multiselect__tags::after {
  display: none;
}
:deep .multiselect__tags {
  border-bottom: none;
}
.icons-flex {
  display: flex;
  align-items: center;
}
.icons-flex svg + svg,
.icons-flex .tooltip + .tooltip {
  margin-left: 24px;
}
:deep .st-modal-container {
  width: 480px;
  height: 520px;
  box-sizing: border-box;
}
:deep .st-modal__body {
  margin: 12px 0 0 0 !important;
}
.account-modal__hide-header :deep .st-modal__header {
  display: none;
}
.account-modal__hide-header :deep .st-modal__body {
  margin-top: 0;
  text-align: center;
}
.account-modal__hide-header h5 {
  margin-bottom: 36px;
}
.account-tabs {
  margin-top: 36px;
  margin-bottom: 36px;
  display: flex;
  align-items: center;
}
.account-tabs a {
  position: relative;
  cursor: pointer;
  min-width: 160px;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--grey900);
  padding-bottom: 12px;
  border-bottom: 3px solid var(--grey200);
  font-family: var(--secondary-font);
  transition: 0.3s;
}
.account-tabs a + a {
  margin-left: 24px;
}
.account-tabs a:hover {
  text-shadow: 0.5px 0 var(--grey900);
}
.account-tabs a:hover:after {
  width: 100%;
}
.account-tabs a:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
  width: 0;
  background-color: var(--marine500);
  transition: 0.3s;
}
.account-tabs a.active {
  text-shadow: 0.5px 0 var(--grey900);
}
.account-tabs a.active:after {
  background-color: var(--marine500);
  width: 100%;
}
.desc {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--background100);
  border-radius: 4px;
}
.key {
  word-break: break-all;
  margin-top: 8px;
  color: var(--marine500);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--grey100);
}
.copy-key {
  margin-top: 17px;
  margin-bottom: 49px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.copy-key__private {
  margin-bottom: 81px;
}
.copy-key div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 64px;
}
.view-more {
  text-align: center;
  cursor: pointer;
  color: var(--marine500);
}
.qr-code {
  display: block;
  width: 100%;
  max-width: 220px;
  margin: 63px auto 46px;
  padding-left: 22px;
}
.custom-form-item {
  margin: 120px 0 0;
}
:deep .st-input input {
  background-position: 92% 49% !important;
}
.rpc-status {
  margin-right: 12px;
}
.rpc-icon {
  pointer-events: none;
}
.account-switcher {
  width: 170px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.account-switcher h6 {
  margin-right: 24px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.account-switcher svg {
  min-width: 8px;
}
.account-overflow {
  margin-top: 36px;
  overflow: auto;
  height: 392px;
  padding-right: 16px;
}
.account-overflow::-webkit-scrollbar {
  width: 4px;
}
.account-overflow:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.account-overflow::-webkit-scrollbar-thumb {
  background: transparent;
}
.account-card {
  cursor: pointer;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 15px 20px 19px;
  background-color: var(--background0);
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgba(34, 3, 101, 0.1);
  border-radius: 2px;
}
.account-card .account-card__header {
  margin-bottom: 20px;
  display: grid;
  grid-gap: 0 24px;
  grid-template-columns: 11fr 20px;
  align-items: center;
}
.account-card .account-card__header h6 {
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.account-card .account-card__content {
  display: grid;
  grid-gap: 0 24px;
  grid-template-columns: 11fr 18px;
}
.account-card .account-card__content .account-card__content--amount h6 {
  margin-bottom: 4px;
  font-family: var(--secondary-font);
}
.account-card .account-card__content .account-card__content--icon {
  display: flex;
  align-items: flex-end;
}
.radio {
  width: 20px;
  height: 20px;
  position: relative;
  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.25) 0%,
      rgba(229, 228, 232, 0.25) 83.23%
    ),
    var(--grey50);
  border: 1px solid rgba(229, 228, 232, 0.15);
  border-radius: 4px;
}
.radio-active::after {
  background-color: var(--grey50) !important;
}
.radio-active::before {
  opacity: 1 !important;
}
.radio::after {
  content: '';
  display: block;
  background-color: var(--grey200);
  width: 6px;
  height: 6px;
  position: absolute;
  top: 7px;
  left: 7px;
  border-radius: 2px;
  z-index: 2;
  transition: 0.3s;
}
.radio::before {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  background: linear-gradient(
      153.02deg,
      rgba(78, 0, 246, 0.15) 0%,
      rgba(63, 1, 198, 0.15) 83.23%
    ),
    #4e00f6;
  border: 1px solid rgba(63, 1, 198, 0.5);
  border-radius: 2px;
  position: absolute;
  top: 1px;
  left: 1px;
  z-index: 1;
  opacity: 0;
  transition: 0.3s;
}
</style>
