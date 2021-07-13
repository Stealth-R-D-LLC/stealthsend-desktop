<template>
  <div class="welcome">
    <div class="left" :class="{ 'left-active': isAccount || isRecovery }">
      <img src="@/assets/welcome.png" alt="welcome" />
      <!-- <video id="bgAnimation" width="320" height="240" autplay muted>
        <source
          src="@/assets/animation/backgroundAnimation.mp4"
          type="video/mp4"
        />
        <source
          src="@/assets/animation/backgroundAnimation.ogg"
          type="video/ogg"
        />
        Not supported
      </video> -->

      <div class="overlay"></div>
      <div
        class="left__inner"
        :class="{ 'left__inner--active': isAccount || isRecovery }"
      >
        <lottie
          :options="lottieOptions"
          :height="158"
          class="logo"
          @animCreated="handleAnimation"
        />
        <div
          class="box"
          :class="{
            'box-animated': isWelcome,
            'box-full': isAccount || isRecovery,
          }"
        >
          <template v-if="isWelcome">
            <div
              class="box__inner"
              :class="{ 'box__inner--right': isAccount || isRecovery }"
            >
              <transition-group name="fade">
                <template v-if="isAccount">
                  <h3 class="title" v-if="currentStep <= 5">
                    The Fastest Private Digital<br />Currency
                  </h3>
                  <h3
                    class="title"
                    v-if="currentStep === 6 || currentStep === 7"
                  >
                    The Holy Grail of Crypto:<br />fast, feeless, private<br />and
                    scalable
                  </h3>
                  <h3 class="title" v-if="currentStep >= 8">
                    World’s first feeless,<br />private high performance<br />blockchain
                    protocol
                  </h3>
                  <div class="app-version">StealthSend, v{{ version }}</div>
                </template>
                <template v-if="isRecovery">
                  <h3 class="title">
                    World’s first feeless,<br />private high performance<br />blockchain
                    protocol
                  </h3>
                  <div class="app-version">StealthSend, v{{ version }}</div>
                </template>
                <div v-if="!isAccount && !isRecovery">
                  <h4 class="title">Welcome to StealthSend</h4>
                  <h5 class="subtitle">
                    Would you like to create a new account or restore from
                    Recovery Phrase?
                  </h5>
                </div>
                <div v-if="isAccount || isRecovery" class="support">
                  <!-- <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 19.5V20.5H6V19.5H12Z"
                      stroke="#FAF9FC"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21 15.5H18V9.5H21V15.5Z"
                      stroke="#FAF9FC"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4 15.5H1L1 9.5H4V15.5Z"
                      stroke="#FAF9FC"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M2 8.5C2 5.5 5 1.5 10.9998 1.5C16.9996 1.5 20 4.5 20 8.5"
                      stroke="#FAF9FC"
                      stroke-width="2"
                    />
                    <path
                      d="M5.00012 20.5H3.00008C2.00001 20.5 2.00009 20.5 2 19.5V16.5"
                      stroke="#FAF9FC"
                      stroke-width="2"
                    />
                  </svg>
                  <p>Customer Support</p> -->
                </div>
                <div class="buttons" v-else>
                  <StButton type="type-d" @click="isAccount = true"
                    >Create a New Account</StButton
                  >
                  <StButton type="type-d" @click="isRecovery = true"
                    >Restore a Backup</StButton
                  >
                </div>
              </transition-group>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="right" :class="{ 'right-opened': isAccount || isRecovery }">
      <div v-if="isAccount" class="right__inner">
        <div class="right__inner-top">
          <transition-group name="fade">
            <div v-if="currentStep === 0">
              <h5>About Your Funds</h5>
              <p class="desc">
                This wallet acts as a vault that contains your XST. It’s only
                accessible with your Recovery Phrase.
              </p>
              <svg
                width="104"
                height="80"
                viewBox="0 0 104 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M40 13H64.0262V33.3125L83 56.3333V78H40L40 13Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M37.2342 13H61.8525V33.3125L81 56.3333V78H8L37.2342 13Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  d="M83 56.3333V78H2L2 13H63.4032"
                  stroke="#4E00F6"
                  stroke-width="3"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M102 13.8537V33.6098L82.5 56L63 33.6098L63 13.8537L82.4987 2L102 13.8537Z"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 33H15V24H11V33Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39 33H43V24H39V33Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 68H15V59H11V68Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39 68H43V59H39V68Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M46 52H50V43H46V52Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22 52H26V43H22V52Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M79 22H88V15H79V22Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M77 34H91V24H77V34Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  d="M10.5 43V52"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M54.5 24V33"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M54.5 59V68"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M37.5 43V52"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M28.5 24V33"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M28.5 59V68"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="40"
                    y1="13"
                    x2="40"
                    y2="78"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="8"
                    y1="13"
                    x2="8"
                    y2="78"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div v-if="currentStep === 1">
              <h5>Recovery Phrase</h5>
              <p class="desc">
                The Recovery Phrase is a set of 12-24 randomly selected words
                that will enable you to regain access to your wallet should you
                lose or damage your device.
              </p>
              <svg
                width="58"
                height="86"
                viewBox="0 0 58 86"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="29"
                  y="10"
                  width="27"
                  height="74"
                  fill="url(#paint0_linear)"
                />
                <rect
                  x="2"
                  y="10"
                  width="54"
                  height="74"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M49.2302 10H56V84H13L49.2302 10Z"
                  fill="url(#paint1_linear)"
                />
                <rect
                  x="19"
                  y="2"
                  width="21"
                  height="14"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  d="M16.587 48.5H42.413"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M16.587 40.5H42.413"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M16.587 31.5H42.413"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M16.587 65.5H42.413"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M16.587 56.5H42.413"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="29"
                    y1="10"
                    x2="29"
                    y2="84"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="13"
                    y1="10"
                    x2="13"
                    y2="84"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div v-if="currentStep === 2">
              <h5>Save the Phrase!</h5>
              <p class="desc">
                Please keep a secure and confidential copy of your Recovery
                Phrase offline to protect your funds from hackers and thieves.
              </p>
              <svg
                width="76"
                height="78"
                viewBox="0 0 76 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30.5"
                  y="2"
                  width="27"
                  height="74"
                  fill="url(#paint0_linear)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M50.4153 2H57.5V76H12.5L50.4153 2Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  d="M57.4988 2H1.5L1.5 76H57.5V50.9355L39.2391 30.6452V12.7419L57.5 2"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  d="M13.0217 40.5H35.9783"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M12.8261 31.5H27.1739"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M12.8261 24.5H27.1739"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M13.0217 56.5H35.9783"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  d="M13.0217 49.5H35.9783"
                  stroke="#4E00F6"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M74.5 12.7561V30.6829L56.5 51L38.5 30.6829L38.5 12.7561L56.4988 2L74.5 12.7561Z"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M51.5 22H61.5V14H51.5V22Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M49.5 31H63.5V20H49.5V31Z"
                  stroke="#4E00F6"
                  stroke-width="2"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="30.5"
                    y1="2"
                    x2="30.5"
                    y2="76"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="12.5"
                    y1="2"
                    x2="12.5"
                    y2="76"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div v-if="currentStep === 3">
              <h5>About Your Password</h5>
              <p class="desc">
                I understand that if I lose my Password I will no longer be able
                to access the StealthSend app and will need to use my Recovery
                Phrase.
              </p>
              <svg
                width="116"
                height="116"
                viewBox="0 0 116 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M59.2032 16.6129L93.2249 36.1046L93.2249 76.5985L57.9451 116L22.8844 76.5985L22.8844 36.1046L59.2032 16.6129Z"
                  fill="#E0D3FC"
                  fill-opacity="0.1"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M59.2032 16.613L93.225 36.1046L93.225 76.5986L57.9451 116L59.2032 16.613Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M93.2254 36.1046V76.5986L57.9455 116L40.3326 96.0648L75.2969 25.7533L93.2254 36.1046Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  d="M24.3844 37.0019L59.1794 18.3281L91.7249 36.9739L91.7249 76.0251L57.9486 113.747L24.3844 76.0278L24.3844 37.0019Z"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  d="M75.2442 60.4973H74.2442V61.4973H75.2442V60.4973ZM75.2442 55.1033H76.2442V53.164L74.6644 54.2886L75.2442 55.1033ZM76.2442 60.4973V61.4973H77.2442V60.4973H76.2442ZM76.2442 55.1033L76.8241 54.2886L75.2442 53.1641V55.1033H76.2442ZM81.0952 58.556L80.5153 59.3707L81.3301 59.9506L81.9099 59.1359L81.0952 58.556ZM81.6751 57.7413L82.4898 58.3212L83.0697 57.5065L82.255 56.9266L81.6751 57.7413ZM76.6065 54.1337L76.0266 53.319L74.882 54.1337L76.0266 54.9484L76.6065 54.1337ZM81.1623 50.891L81.7422 51.7057L82.5569 51.1258L81.977 50.3111L81.1623 50.891ZM80.5824 50.0763L81.3971 49.4964L80.8172 48.6817L80.0025 49.2616L80.5824 50.0763ZM76.2442 53.164H75.2442V55.1033L76.8241 53.9788L76.2442 53.164ZM76.2442 47.77H77.2442V46.77H76.2442V47.77ZM75.2442 47.77V46.77H74.2442V47.77H75.2442ZM75.2442 53.1641L74.6644 53.9788L76.2442 55.1033V53.1641H75.2442ZM70.3933 49.7113L70.9731 48.8966L70.1584 48.3167L69.5786 49.1314L70.3933 49.7113ZM69.8134 50.526L68.9987 49.9461L68.4188 50.7608L69.2335 51.3407L69.8134 50.526ZM74.882 54.1337L75.4619 54.9484L76.6065 54.1337L75.4619 53.319L74.882 54.1337ZM70.3262 57.3763L69.7463 56.5616L68.9316 57.1415L69.5115 57.9562L70.3262 57.3763ZM70.9061 58.191L70.0914 58.7709L70.6712 59.5856L71.4859 59.0057L70.9061 58.191ZM76.2442 60.4973V55.1033H74.2442V60.4973H76.2442ZM76.2442 59.4973H75.2442V61.4973H76.2442V59.4973ZM75.2442 55.1033V60.4973H77.2442V55.1033H75.2442ZM75.6644 55.918L80.5153 59.3707L81.6751 57.7413L76.8241 54.2886L75.6644 55.918ZM81.9099 59.1359L82.4898 58.3212L80.8604 57.1615L80.2805 57.9762L81.9099 59.1359ZM82.255 56.9266L77.1864 53.319L76.0266 54.9484L81.0952 58.556L82.255 56.9266ZM77.1864 54.9484L81.7422 51.7057L80.5824 50.0763L76.0266 53.319L77.1864 54.9484ZM81.977 50.3111L81.3971 49.4964L79.7677 50.6562L80.3476 51.4709L81.977 50.3111ZM80.0025 49.2616L75.6644 52.3493L76.8241 53.9788L81.1623 50.891L80.0025 49.2616ZM75.2442 47.77V53.164H77.2442V47.77H75.2442ZM75.2442 48.77H76.2442V46.77H75.2442V48.77ZM76.2442 53.1641V47.77H74.2442V53.1641H76.2442ZM75.8241 52.3493L70.9731 48.8966L69.8134 50.526L74.6644 53.9788L75.8241 52.3493ZM69.5786 49.1314L68.9987 49.9461L70.6281 51.1059L71.208 50.2911L69.5786 49.1314ZM69.2335 51.3407L74.3021 54.9484L75.4619 53.319L70.3933 49.7113L69.2335 51.3407ZM74.3021 53.319L69.7463 56.5616L70.9061 58.191L75.4619 54.9484L74.3021 53.319ZM69.5115 57.9562L70.0914 58.7709L71.7208 57.6112L71.1409 56.7965L69.5115 57.9562ZM71.4859 59.0057L75.8241 55.918L74.6644 54.2886L70.3262 57.3763L71.4859 59.0057Z"
                  fill="#4E00F6"
                />
                <path
                  d="M57.2442 60.4973H56.2442V61.4973H57.2442V60.4973ZM57.2442 55.1033H58.2442V53.164L56.6644 54.2886L57.2442 55.1033ZM58.2442 60.4973V61.4973H59.2442V60.4973H58.2442ZM58.2442 55.1033L58.8241 54.2886L57.2442 53.1641V55.1033H58.2442ZM63.0952 58.556L62.5153 59.3707L63.3301 59.9506L63.9099 59.1359L63.0952 58.556ZM63.6751 57.7413L64.4898 58.3212L65.0697 57.5065L64.255 56.9266L63.6751 57.7413ZM58.6065 54.1337L58.0266 53.319L56.882 54.1337L58.0266 54.9484L58.6065 54.1337ZM63.1623 50.891L63.7422 51.7057L64.5569 51.1258L63.977 50.3111L63.1623 50.891ZM62.5824 50.0763L63.3971 49.4964L62.8172 48.6817L62.0025 49.2616L62.5824 50.0763ZM58.2442 53.164H57.2442V55.1033L58.8241 53.9788L58.2442 53.164ZM58.2442 47.77H59.2442V46.77H58.2442V47.77ZM57.2442 47.77V46.77H56.2442V47.77H57.2442ZM57.2442 53.1641L56.6644 53.9788L58.2442 55.1033V53.1641H57.2442ZM52.3933 49.7113L52.9731 48.8966L52.1584 48.3167L51.5786 49.1314L52.3933 49.7113ZM51.8134 50.526L50.9987 49.9461L50.4188 50.7608L51.2335 51.3407L51.8134 50.526ZM56.882 54.1337L57.4619 54.9484L58.6065 54.1337L57.4619 53.319L56.882 54.1337ZM52.3262 57.3763L51.7463 56.5616L50.9316 57.1415L51.5115 57.9562L52.3262 57.3763ZM52.9061 58.191L52.0914 58.7709L52.6712 59.5856L53.4859 59.0057L52.9061 58.191ZM58.2442 60.4973V55.1033H56.2442V60.4973H58.2442ZM58.2442 59.4973H57.2442V61.4973H58.2442V59.4973ZM57.2442 55.1033V60.4973H59.2442V55.1033H57.2442ZM57.6644 55.918L62.5153 59.3707L63.6751 57.7413L58.8241 54.2886L57.6644 55.918ZM63.9099 59.1359L64.4898 58.3212L62.8604 57.1615L62.2805 57.9762L63.9099 59.1359ZM64.255 56.9266L59.1864 53.319L58.0266 54.9484L63.0952 58.556L64.255 56.9266ZM59.1864 54.9484L63.7422 51.7057L62.5824 50.0763L58.0266 53.319L59.1864 54.9484ZM63.977 50.3111L63.3971 49.4964L61.7677 50.6562L62.3476 51.4709L63.977 50.3111ZM62.0025 49.2616L57.6644 52.3493L58.8241 53.9788L63.1623 50.891L62.0025 49.2616ZM57.2442 47.77V53.164H59.2442V47.77H57.2442ZM57.2442 48.77H58.2442V46.77H57.2442V48.77ZM58.2442 53.1641V47.77H56.2442V53.1641H58.2442ZM57.8241 52.3493L52.9731 48.8966L51.8134 50.526L56.6644 53.9788L57.8241 52.3493ZM51.5786 49.1314L50.9987 49.9461L52.6281 51.1059L53.208 50.2911L51.5786 49.1314ZM51.2335 51.3407L56.3021 54.9484L57.4619 53.319L52.3933 49.7113L51.2335 51.3407ZM56.3021 53.319L51.7463 56.5616L52.9061 58.191L57.4619 54.9484L56.3021 53.319ZM51.5115 57.9562L52.0914 58.7709L53.7208 57.6112L53.1409 56.7965L51.5115 57.9562ZM53.4859 59.0057L57.8241 55.918L56.6644 54.2886L52.3262 57.3763L53.4859 59.0057Z"
                  fill="#4E00F6"
                />
                <path
                  d="M40.2442 60.4973H39.2442V61.4973H40.2442V60.4973ZM40.2442 55.1033H41.2442V53.164L39.6644 54.2886L40.2442 55.1033ZM41.2442 60.4973V61.4973H42.2442V60.4973H41.2442ZM41.2442 55.1033L41.8241 54.2886L40.2442 53.1641V55.1033H41.2442ZM46.0952 58.556L45.5153 59.3707L46.3301 59.9506L46.9099 59.1359L46.0952 58.556ZM46.6751 57.7413L47.4898 58.3212L48.0697 57.5065L47.255 56.9266L46.6751 57.7413ZM41.6065 54.1337L41.0266 53.319L39.882 54.1337L41.0266 54.9484L41.6065 54.1337ZM46.1623 50.891L46.7422 51.7057L47.5569 51.1258L46.977 50.3111L46.1623 50.891ZM45.5824 50.0763L46.3971 49.4964L45.8172 48.6817L45.0025 49.2616L45.5824 50.0763ZM41.2442 53.164H40.2442V55.1033L41.8241 53.9788L41.2442 53.164ZM41.2442 47.77H42.2442V46.77H41.2442V47.77ZM40.2442 47.77V46.77H39.2442V47.77H40.2442ZM40.2442 53.1641L39.6644 53.9788L41.2442 55.1033V53.1641H40.2442ZM35.3933 49.7113L35.9731 48.8966L35.1584 48.3167L34.5786 49.1314L35.3933 49.7113ZM34.8134 50.526L33.9987 49.9461L33.4188 50.7608L34.2335 51.3407L34.8134 50.526ZM39.882 54.1337L40.4619 54.9484L41.6065 54.1337L40.4619 53.319L39.882 54.1337ZM35.3262 57.3763L34.7463 56.5616L33.9316 57.1415L34.5115 57.9562L35.3262 57.3763ZM35.9061 58.191L35.0914 58.7709L35.6712 59.5856L36.4859 59.0057L35.9061 58.191ZM41.2442 60.4973V55.1033H39.2442V60.4973H41.2442ZM41.2442 59.4973H40.2442V61.4973H41.2442V59.4973ZM40.2442 55.1033V60.4973H42.2442V55.1033H40.2442ZM40.6644 55.918L45.5153 59.3707L46.6751 57.7413L41.8241 54.2886L40.6644 55.918ZM46.9099 59.1359L47.4898 58.3212L45.8604 57.1615L45.2805 57.9762L46.9099 59.1359ZM47.255 56.9266L42.1864 53.319L41.0266 54.9484L46.0952 58.556L47.255 56.9266ZM42.1864 54.9484L46.7422 51.7057L45.5824 50.0763L41.0266 53.319L42.1864 54.9484ZM46.977 50.3111L46.3971 49.4964L44.7677 50.6562L45.3476 51.4709L46.977 50.3111ZM45.0025 49.2616L40.6644 52.3493L41.8241 53.9788L46.1623 50.891L45.0025 49.2616ZM40.2442 47.77V53.164H42.2442V47.77H40.2442ZM40.2442 48.77H41.2442V46.77H40.2442V48.77ZM41.2442 53.1641V47.77H39.2442V53.1641H41.2442ZM40.8241 52.3493L35.9731 48.8966L34.8134 50.526L39.6644 53.9788L40.8241 52.3493ZM34.5786 49.1314L33.9987 49.9461L35.6281 51.1059L36.208 50.2911L34.5786 49.1314ZM34.2335 51.3407L39.3021 54.9484L40.4619 53.319L35.3933 49.7113L34.2335 51.3407ZM39.3021 53.319L34.7463 56.5616L35.9061 58.191L40.4619 54.9484L39.3021 53.319ZM34.5115 57.9562L35.0914 58.7709L36.7208 57.6112L36.1409 56.7965L34.5115 57.9562ZM36.4859 59.0057L40.8241 55.918L39.6644 54.2886L35.3262 57.3763L36.4859 59.0057Z"
                  fill="#4E00F6"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="66.4683"
                    y1="9.3479"
                    x2="8.88062"
                    y2="66.9355"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="79.0854"
                    y1="21.9647"
                    x2="21.4978"
                    y2="79.5524"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <!-- <div v-if="currentStep === 4">
              <h5>About Your Payment Code</h5>
              <p class="desc">
                I understand that if I lose my Payment Code I will no longer be
                able to access the StealthSend app and will need to use my
                Recovery Phrase.
              </p>
              <svg
                width="116"
                height="116"
                viewBox="0 0 116 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M59.2364 15.6786L93.2581 35.1703L93.2581 75.6642L57.9783 115.066L22.9176 75.6642L22.9176 35.1703L59.2364 15.6786Z"
                  fill="#E0D3FC"
                  fill-opacity="0.1"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M59.2359 15.6786L93.2577 35.1703L93.2577 75.6642L57.9778 115.066L59.2359 15.6786Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M93.2581 35.1703V75.6643L57.9782 115.066L40.3653 95.1305L75.3296 24.8189L93.2581 35.1703Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  d="M24.4176 36.0676L59.2126 17.3937L91.7581 36.0396L91.7581 75.0908L57.9818 112.813L24.4176 75.0935L24.4176 36.0676Z"
                  stroke="#4E00F6"
                  stroke-width="3"
                />
                <path
                  d="M74.777 59.563H73.777V60.563H74.777V59.563ZM74.777 55.1385H75.777V53.1993L74.1971 54.3238L74.777 55.1385ZM76.777 59.563V60.563H77.777V59.563H76.777ZM76.777 55.1385L77.3568 54.3238L75.777 53.1993V55.1385H76.777ZM80.838 58.0291L80.2581 58.8438L81.0728 59.4236L81.6527 58.6089L80.838 58.0291ZM81.9978 56.3997L82.8125 56.9795L83.3923 56.1648L82.5776 55.585L81.9978 56.3997ZM77.5015 53.1993L76.9216 52.3846L75.777 53.1993L76.9216 54.014L77.5015 53.1993ZM81.485 50.364L82.0648 51.1787L82.8795 50.5988L82.2997 49.7841L81.485 50.364ZM80.3252 48.7346L81.1399 48.1547L80.56 47.34L79.7453 47.9199L80.3252 48.7346ZM76.777 51.2601H75.777V53.1993L77.3568 52.0748L76.777 51.2601ZM76.777 46.8357H77.777V45.8357H76.777V46.8357ZM74.777 46.8357V45.8357H73.777V46.8357H74.777ZM74.777 51.2601L74.1971 52.0748L75.777 53.1993V51.2601H74.777ZM70.7159 48.3696L71.2958 47.5549L70.4811 46.975L69.9012 47.7897L70.7159 48.3696ZM69.5562 49.999L68.7415 49.4191L68.1616 50.2338L68.9763 50.8137L69.5562 49.999ZM74.0525 53.1993L74.6323 54.014L75.777 53.1993L74.6323 52.3846L74.0525 53.1993ZM70.069 56.0347L69.4891 55.22L68.6744 55.7998L69.2543 56.6145L70.069 56.0347ZM71.2287 57.6641L70.414 58.2439L70.9939 59.0586L71.8086 58.4788L71.2287 57.6641ZM75.777 59.563V55.1385H73.777V59.563H75.777ZM76.777 58.563H74.777V60.563H76.777V58.563ZM75.777 55.1385V59.563H77.777V55.1385H75.777ZM76.1971 55.9532L80.2581 58.8438L81.4179 57.2144L77.3568 54.3238L76.1971 55.9532ZM81.6527 58.6089L82.8125 56.9795L81.1831 55.8198L80.0233 57.4492L81.6527 58.6089ZM82.5776 55.585L78.0813 52.3846L76.9216 54.014L81.4179 57.2144L82.5776 55.585ZM78.0813 54.014L82.0648 51.1787L80.9051 49.5493L76.9216 52.3846L78.0813 54.014ZM82.2997 49.7841L81.1399 48.1547L79.5105 49.3145L80.6702 50.9439L82.2997 49.7841ZM79.7453 47.9199L76.1971 50.4454L77.3568 52.0748L80.9051 49.5493L79.7453 47.9199ZM75.777 46.8357V51.2601H77.777V46.8357H75.777ZM74.777 47.8357H76.777V45.8357H74.777V47.8357ZM75.777 51.2601V46.8357H73.777V51.2601H75.777ZM75.3568 50.4454L71.2958 47.5549L70.136 49.1843L74.1971 52.0748L75.3568 50.4454ZM69.9012 47.7897L68.7415 49.4191L70.3709 50.5789L71.5306 48.9495L69.9012 47.7897ZM68.9763 50.8137L73.4726 54.014L74.6323 52.3846L70.136 49.1843L68.9763 50.8137ZM73.4726 52.3846L69.4891 55.22L70.6488 56.8494L74.6323 54.014L73.4726 52.3846ZM69.2543 56.6145L70.414 58.2439L72.0434 57.0842L70.8837 55.4548L69.2543 56.6145ZM71.8086 58.4788L75.3568 55.9532L74.1971 54.3238L70.6488 56.8494L71.8086 58.4788Z"
                  fill="#4E00F6"
                />
                <path
                  d="M56.777 59.563H55.777V60.563H56.777V59.563ZM56.777 55.1385H57.777V53.1993L56.1971 54.3238L56.777 55.1385ZM58.777 59.563V60.563H59.777V59.563H58.777ZM58.777 55.1385L59.3568 54.3238L57.777 53.1993V55.1385H58.777ZM62.838 58.0291L62.2581 58.8438L63.0728 59.4236L63.6527 58.6089L62.838 58.0291ZM63.9978 56.3997L64.8125 56.9795L65.3923 56.1648L64.5776 55.585L63.9978 56.3997ZM59.5015 53.1993L58.9216 52.3846L57.777 53.1993L58.9216 54.014L59.5015 53.1993ZM63.485 50.364L64.0648 51.1787L64.8795 50.5988L64.2997 49.7841L63.485 50.364ZM62.3252 48.7346L63.1399 48.1547L62.56 47.34L61.7453 47.9199L62.3252 48.7346ZM58.777 51.2601H57.777V53.1993L59.3568 52.0748L58.777 51.2601ZM58.777 46.8357H59.777V45.8357H58.777V46.8357ZM56.777 46.8357V45.8357H55.777V46.8357H56.777ZM56.777 51.2601L56.1971 52.0748L57.777 53.1993V51.2601H56.777ZM52.7159 48.3696L53.2958 47.5549L52.4811 46.975L51.9012 47.7897L52.7159 48.3696ZM51.5562 49.999L50.7415 49.4191L50.1616 50.2338L50.9763 50.8137L51.5562 49.999ZM56.0525 53.1993L56.6323 54.014L57.777 53.1993L56.6323 52.3846L56.0525 53.1993ZM52.069 56.0347L51.4891 55.22L50.6744 55.7998L51.2543 56.6145L52.069 56.0347ZM53.2287 57.6641L52.414 58.2439L52.9939 59.0586L53.8086 58.4788L53.2287 57.6641ZM57.777 59.563V55.1385H55.777V59.563H57.777ZM58.777 58.563H56.777V60.563H58.777V58.563ZM57.777 55.1385V59.563H59.777V55.1385H57.777ZM58.1971 55.9532L62.2581 58.8438L63.4179 57.2144L59.3568 54.3238L58.1971 55.9532ZM63.6527 58.6089L64.8125 56.9795L63.1831 55.8198L62.0233 57.4492L63.6527 58.6089ZM64.5776 55.585L60.0813 52.3846L58.9216 54.014L63.4179 57.2144L64.5776 55.585ZM60.0813 54.014L64.0648 51.1787L62.9051 49.5493L58.9216 52.3846L60.0813 54.014ZM64.2997 49.7841L63.1399 48.1547L61.5105 49.3145L62.6702 50.9439L64.2997 49.7841ZM61.7453 47.9199L58.1971 50.4454L59.3568 52.0748L62.9051 49.5493L61.7453 47.9199ZM57.777 46.8357V51.2601H59.777V46.8357H57.777ZM56.777 47.8357H58.777V45.8357H56.777V47.8357ZM57.777 51.2601V46.8357H55.777V51.2601H57.777ZM57.3568 50.4454L53.2958 47.5549L52.136 49.1843L56.1971 52.0748L57.3568 50.4454ZM51.9012 47.7897L50.7415 49.4191L52.3709 50.5789L53.5306 48.9495L51.9012 47.7897ZM50.9763 50.8137L55.4726 54.014L56.6323 52.3846L52.136 49.1843L50.9763 50.8137ZM55.4726 52.3846L51.4891 55.22L52.6488 56.8494L56.6323 54.014L55.4726 52.3846ZM51.2543 56.6145L52.414 58.2439L54.0434 57.0842L52.8837 55.4548L51.2543 56.6145ZM53.8086 58.4788L57.3568 55.9532L56.1971 54.3238L52.6488 56.8494L53.8086 58.4788Z"
                  fill="#4E00F6"
                />
                <path
                  d="M39.777 59.563H38.777V60.563H39.777V59.563ZM39.777 55.1385H40.777V53.1993L39.1971 54.3238L39.777 55.1385ZM41.777 59.563V60.563H42.777V59.563H41.777ZM41.777 55.1385L42.3568 54.3238L40.777 53.1993V55.1385H41.777ZM45.838 58.0291L45.2581 58.8438L46.0728 59.4236L46.6527 58.6089L45.838 58.0291ZM46.9978 56.3997L47.8125 56.9795L48.3923 56.1648L47.5776 55.585L46.9978 56.3997ZM42.5015 53.1993L41.9216 52.3846L40.777 53.1993L41.9216 54.014L42.5015 53.1993ZM46.485 50.364L47.0648 51.1787L47.8795 50.5988L47.2997 49.7841L46.485 50.364ZM45.3252 48.7346L46.1399 48.1547L45.56 47.34L44.7453 47.9199L45.3252 48.7346ZM41.777 51.2601H40.777V53.1993L42.3568 52.0748L41.777 51.2601ZM41.777 46.8357H42.777V45.8357H41.777V46.8357ZM39.777 46.8357V45.8357H38.777V46.8357H39.777ZM39.777 51.2601L39.1971 52.0748L40.777 53.1993V51.2601H39.777ZM35.7159 48.3696L36.2958 47.5549L35.4811 46.975L34.9012 47.7897L35.7159 48.3696ZM34.5562 49.999L33.7415 49.4191L33.1616 50.2338L33.9763 50.8137L34.5562 49.999ZM39.0525 53.1993L39.6323 54.014L40.777 53.1993L39.6323 52.3846L39.0525 53.1993ZM35.069 56.0347L34.4891 55.22L33.6744 55.7998L34.2543 56.6145L35.069 56.0347ZM36.2287 57.6641L35.414 58.2439L35.9939 59.0586L36.8086 58.4788L36.2287 57.6641ZM40.777 59.563V55.1385H38.777V59.563H40.777ZM41.777 58.563H39.777V60.563H41.777V58.563ZM40.777 55.1385V59.563H42.777V55.1385H40.777ZM41.1971 55.9532L45.2581 58.8438L46.4179 57.2144L42.3568 54.3238L41.1971 55.9532ZM46.6527 58.6089L47.8125 56.9795L46.1831 55.8198L45.0233 57.4492L46.6527 58.6089ZM47.5776 55.585L43.0813 52.3846L41.9216 54.014L46.4179 57.2144L47.5776 55.585ZM43.0813 54.014L47.0648 51.1787L45.9051 49.5493L41.9216 52.3846L43.0813 54.014ZM47.2997 49.7841L46.1399 48.1547L44.5105 49.3145L45.6702 50.9439L47.2997 49.7841ZM44.7453 47.9199L41.1971 50.4454L42.3568 52.0748L45.9051 49.5493L44.7453 47.9199ZM40.777 46.8357V51.2601H42.777V46.8357H40.777ZM39.777 47.8357H41.777V45.8357H39.777V47.8357ZM40.777 51.2601V46.8357H38.777V51.2601H40.777ZM40.3568 50.4454L36.2958 47.5549L35.136 49.1843L39.1971 52.0748L40.3568 50.4454ZM34.9012 47.7897L33.7415 49.4191L35.3709 50.5789L36.5306 48.9495L34.9012 47.7897ZM33.9763 50.8137L38.4726 54.014L39.6323 52.3846L35.136 49.1843L33.9763 50.8137ZM38.4726 52.3846L34.4891 55.22L35.6488 56.8494L39.6323 54.014L38.4726 52.3846ZM34.2543 56.6145L35.414 58.2439L37.0434 57.0842L35.8837 55.4548L34.2543 56.6145ZM36.8086 58.4788L40.3568 55.9532L39.1971 54.3238L35.6488 56.8494L36.8086 58.4788Z"
                  fill="#4E00F6"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="66.501"
                    y1="8.41357"
                    x2="8.91333"
                    y2="66.0012"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="79.1182"
                    y1="21.0304"
                    x2="21.5305"
                    y2="78.618"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                    <stop offset="1" stop-color="#C3A9FB" stop-opacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div> -->
            <div v-if="currentStep === 4">
              <h5>Terms of Use</h5>
              <h6>This Terms of Use (“ToU” and/or “Terms”)</h6>
              <div class="terms-of-service">
                <p class="tos-desc bold">
                  PLEASE READ THESE TERMS OF USE BEFORE USING THE WEBSITES.
                </p>
                <p class="tos-desc">Acceptance of the Terms of Use</p>
                <p class="tos-desc">
                  These terms of use are entered into by and between you and the
                  Stealth R&D, LLC ("Stealth"). The following terms and
                  conditions, together with any documents they expressly
                  incorporate by reference (collectively, these "Terms of Use"),
                  govern your access to and use of stealth.org, including any
                  content, functionality and services offered on or through
                  stealth.org, or any other websites or social media streams
                  operated by Stealth (together, the "Websites").
                </p>
                <p class="tos-desc">
                  Please read the Terms of Use carefully before you start to use
                  the Websites. By using the Websites or by clicking to accept
                  or agree to the Terms of Use when this option is made
                  available to you, you accept and agree to be bound and abide
                  by these Terms of Use in addition to
                </p>
                <p class="tos-desc">
                  • our Privacy Policy, incorporated herein by reference; and
                </p>
                <p class="tos-desc">
                  • our Cookie Policy, incorporated herein by reference.
                </p>
                <p class="tos-desc">
                  If you do not agree to these Terms of Use or the Privacy
                  Policy, you must not access or use the Websites.
                </p>
                <p class="tos-desc medium">1. Who May Use the Websites</p>
                <p class="tos-desc">
                  This Websites is offered and available to users who are 13
                  years of age or older for personal use only and not for
                  commercial use. The Websites is not intended for children
                  under 13 years of age. By using this Website, you represent
                  and warrant that you (i) are 13 years of age or older, (ii)
                  are not barred to use the Websites under any applicable law,
                  and (iii) are using the Websites only for your own personal
                  use. If you do not meet these requirements, you must not
                  access or use the Websites.
                </p>
                <p class="tos-desc medium">2. Changes to the Terms of Use</p>
                <p class="tos-desc">
                  We may revise and update these Terms of Use from time to time
                  at our sole discretion. All changes are effective immediately
                  when we post them.
                </p>
                <p class="tos-desc">
                  Your continued use of the Websites following the posting of
                  revised Terms of Use means that you accept and agree to the
                  changes. You are expected to check this page frequently, so
                  you are aware of any changes, as they are binding on you.
                </p>
                <p class="tos-desc medium">
                  3. Accessing the Websites and Account Security
                </p>
                <p class="tos-desc">
                  We reserve the right to withdraw or amend this Website, and
                  any service or material we provide on the Website, in our sole
                  discretion without notice. We do not guarantee that our site
                  or any content on it, will always be available or be
                  interrupted. We will not be liable if for any reason all or
                  any part of the Websites is unavailable at any time or for any
                  period. From time to time, we may restrict access to some
                  parts of the Website, or the entire Website, to users.
                </p>
                <p class="tos-desc">You are responsible for:</p>
                <p class="tos-desc">
                  • Making all arrangements necessary for you to have access to
                  the Websites.
                </p>
                <p class="tos-desc">
                  • Ensuring that all persons who access the Websites through
                  your internet connection are aware of these Terms of Use and
                  comply with them.
                </p>
                <p class="tos-desc">
                  To access the Websites or some of the resources it offers, you
                  may be asked to provide certain registration details or other
                  information. It is a condition of your use of the Websites
                  that all the information you provide on the Websites is
                  correct, current and complete. You agree that all information
                  you provide to register using this Websites or otherwise,
                  including, but not limited to, using any interactive features
                  on the Website, is governed by our Privacy Policy, and you
                  consent to all actions we take with respect to your
                  information consistent with our Privacy Policy.
                </p>
                <p class="tos-desc">
                  You should use particular caution when inputting personal
                  information on to the Websites on a public or shared computer
                  so that others are not able to view or record your personal
                  information.
                </p>
                <p class="tos-desc medium">4. Intellectual Property Rights</p>
                <p class="tos-desc">
                  The Websites and its entire contents, features and
                  functionality (including but not limited to all information,
                  software, text, displays, images, video and audio, and the
                  design, selection and arrangement thereof), are owned by
                  Stealth, its licensors or other providers of such material and
                  are protected by copyright, trademark, patent, trade secret
                  and other intellectual property or proprietary rights laws.
                </p>
                <p class="tos-desc">
                  These Terms of Use permit you to use the Websites for your
                  personal, non-commercial use only. You must not reproduce,
                  distribute, modify, create derivative works of, publicly
                  display, publicly perform, republish, download, store or
                  transmit any of the material on our Website, except as
                  follows:
                </p>
                <p class="tos-desc">
                  • Your computer may temporarily store copies of such materials
                  in RAM incidental to your accessing and viewing those
                  materials.
                </p>
                <p class="tos-desc">
                  • You may store files that are automatically cached by your
                  Web browser for display enhancement purposes.
                </p>
                <p class="tos-desc">
                  • You may print or download one copy of a reasonable number of
                  pages of the Websites for your own personal, non-commercial
                  use and not for further reproduction, publication or
                  distribution.
                </p>
                <p class="tos-desc">
                  • If we provide desktop, mobile or other applications for
                  download, you may download a single copy to your computer or
                  mobile device solely for your own personal, non-commercial
                  use, provided you agree to be bound by our end user license
                  agreement for such applications.
                </p>
                <p class="tos-desc medium">5. You must not:</p>
                <p class="tos-desc">
                  • Modify copies of any materials from this site.
                </p>
                <p class="tos-desc">
                  • Delete or alter any copyright, trademark or other
                  proprietary rights notices from copies of materials from this
                  site.
                </p>
                <p class="tos-desc">
                  You must not access or use for any commercial purposes any
                  part of the Websites or any services or materials available
                  through the Websites.
                </p>
                <p class="tos-desc">
                  If you wish to make any use of materials on the Websites other
                  than that set out in this section, please address your request
                  to:
                  <a href="mailto:contact@stealth.org">contact@stealth.org</a>
                </p>
                <p class="tos-desc">
                  If you print, copy, modify, download or otherwise use or
                  provide any other person with access to any part of the
                  Websites in breach of the Terms of Use, your right to use the
                  Websites will cease immediately and you must, at our option,
                  return or destroy any copies of the materials you have made.
                  No right, title or interest in or to the Websites or any
                  content on the Websites is transferred to you, and all rights
                  not expressly granted are reserved by Stealth. Any use of the
                  Websites not expressly permitted by these Terms of Use is a
                  breach of these Terms of Use and may violate copyright,
                  trademark and other laws.
                </p>
                <p class="tos-desc medium">6. Trademarks</p>
                <p class="tos-desc">
                  Stealth’s name, the terms Quantum Proof-of-Stake, the Stealth
                  logo and all related names, logos, product and service names,
                  designs and slogans are trademarks of Stealth or its
                  affiliates or licensors. You must not use such marks without
                  the prior written permission of Stealth. All other names,
                  logos, product and service names, designs and slogans on this
                  Websites are the trademarks of their respective owners.
                </p>
                <p class="tos-desc medium">7. Prohibited Uses</p>
                <p class="tos-desc">
                  You may use the Websites only for lawful purposes and in
                  accordance with these Terms of Use. You agree not to use the
                  Website:
                </p>
                <p class="tos-desc">
                  • In any way that violates any applicable federal, state,
                  local or international law or regulation (including, without
                  limitation, any laws regarding the export of data or software
                  to and from the US or other countries).
                </p>
                <p class="tos-desc">
                  • For the purpose of exploiting, harming or attempting to
                  exploit or harm minors in any way by exposing them to
                  inappropriate content, asking for personally identifiable
                  information or otherwise.
                </p>
                <p class="tos-desc">
                  • To send, knowingly receive, upload, download, use or re-use
                  any material which does not comply with these Terms of Use.
                </p>
                <p class="tos-desc">
                  • To transmit, or procure the sending of, any advertising or
                  promotional material without our prior written consent,
                  including any "junk mail,'' "chain letters" or "spam" or any
                  other similar solicitation.
                </p>
                <p class="tos-desc">
                  • To impersonate or attempt to impersonate Stealth, a Stealth
                  employee, another user or any other person or entity
                  (including, without limitation, by using e-mail addresses or
                  screen names associated with any of the foregoing).
                </p>
                <p class="tos-desc">
                  • To engage in any other conduct that restricts or inhibits
                  anyone's use or enjoyment of the Website, or which, as
                  determined by us, may harm Stealth or users of the Websites or
                  expose them to liability.
                </p>
                <p class="tos-desc">Additionally, you agree not to:</p>
                <p class="tos-desc">
                  • Use the Websites in any manner that could disable,
                  overburden, damage, or impair the site or interfere with any
                  other party's use of the Websites, including their ability to
                  engage in real time activities through the Websites.
                </p>
                <p class="tos-desc">
                  • Use any robot, spider or other automatic device, process or
                  means to access the Websites for any purpose, including
                  monitoring or copying any of the material on the Websites.
                </p>
                <p class="tos-desc">
                  • Use any manual process to monitor or copy any of the
                  material on the Websites or for any other unauthorized purpose
                  without our prior written consent.
                </p>
                <p class="tos-desc">
                  • Use any device, software or routine that interferes with the
                  proper working of the Websites.
                </p>
                <p class="tos-desc">
                  • Introduce any viruses, trojan horses, worms, logic bombs or
                  other material which is malicious or technologically harmful.
                </p>
                <p class="tos-desc">
                  • Attempt to gain unauthorized access to, interfere with,
                  damage or disrupt any parts of the Websites the server on
                  which the Websites is stored, or any server, computer or
                  database connected to the Websites.
                </p>
                <p class="tos-desc">
                  • Attack the Websites via a denial-of-service attack or a
                  distributed denial-of-service attack.
                </p>
                <p class="tos-desc">
                  • Otherwise attempt to interfere with the proper working of
                  the Websites.
                </p>
                <p class="tos-desc medium">8. Reliance on Information Posted</p>
                <p class="tos-desc">
                  The information presented on or through the Websites is made
                  available solely for general information purposes. We do not
                  warrant the accuracy, completeness or usefulness of this
                  information. Any reliance you place on such information is
                  strictly at your own risk. We disclaim all liability and
                  responsibility arising from any reliance placed on such
                  materials by you or any other visitors to the Website, or by
                  anyone who may be informed of any of its contents.
                </p>
                <p class="tos-desc">
                  This Websites includes content provided by third parties,
                  including materials provided by other users, bloggers and
                  third-party licensors, syndicators, aggregators and/or
                  reporting services. All statements and/or opinions expressed
                  in these materials, and all articles and responses to
                  questions and other content, other than the content provided
                  by Stealth, are solely the opinions and the responsibility of
                  the person or entity providing those materials. These
                  materials do not necessarily reflect the opinion of Stealth.
                  We are not responsible, or liable to you or any third party,
                  for the content or accuracy of any materials provided by any
                  third parties.
                </p>
                <p class="tos-desc medium">9. Changes to the Websites</p>
                <p class="tos-desc">
                  We may update the content on the Websites from time to time,
                  but its content is not necessarily complete or up to date. Any
                  of the material on the Websites may be out of date at any
                  given time, and we are under no obligation to update such
                  material.
                </p>
                <p class="tos-desc medium">
                  10. Information About You and Your Visits to the Websites
                </p>
                <p class="tos-desc">
                  All information we collect on this Websites is subject to our
                  Privacy Policy. By using the Website, you consent to all
                  actions taken by us with respect to your information in
                  compliance with the Privacy Policy.
                </p>
                <p class="tos-desc medium">
                  11. Online Purchases and Other Terms and Conditions
                </p>
                <p class="tos-desc">
                  Additional terms and conditions may also apply to specific
                  portions, services or features of the Website, including the
                  registration and sponsorship for conference events. All such
                  additional terms and conditions are hereby incorporated by
                  this reference into these Terms of Use. In the event of terms
                  that are directly conflicting between these Terms of Use and
                  terms of conditions for the registration or sponsorship of a
                  conference event, the terms and conditions for the event shall
                  control.
                </p>
                <p class="tos-desc medium">
                  12.Linking to the Websites and Social Media Features
                </p>
                <p class="tos-desc">
                  You may link to our homepage, provided you do so in a way that
                  is fair and legal and does not damage our reputation or take
                  advantage of it, but you must not establish a link in such a
                  way as to suggest any form of association, approval or
                  endorsement on our part without our express written consent.
                </p>
                <p class="tos-desc medium">13. Links from the Websites</p>
                <p class="tos-desc">
                  If the Websites contain links to other sites and resources
                  provided by third parties, these links are provided for your
                  convenience only. This includes links contained in
                  advertisements, including banner advertisements and sponsored
                  links. We have no control over the contents of those sites or
                  resources and accept no responsibility for them or for any
                  loss or damage that may arise from your use of them. If you
                  decide to access any of the third-party websites linked to
                  this Website, you do so entirely at your own risk and subject
                  to the terms and conditions of use for such websites. We
                  reserve the right to withdraw linking permission without
                  notice.
                </p>
                <p class="tos-desc medium">14. Geographic Restrictions</p>
                <p class="tos-desc">
                  The owner of the Websites is based in United States. We make
                  no claims that the Websites or any of its content is
                  accessible or appropriate outside of the United States. Access
                  to the Websites may not be legal by certain persons or in
                  certain countries. If you access the Websites from outside the
                  United States, you do so on your own initiative and are
                  responsible for compliance with local laws.
                </p>
                <p class="tos-desc medium">15. Disclaimer of Warranties</p>
                <p class="tos-desc">
                  You understand that we cannot and do not guarantee or warrant
                  that files available for downloading from the internet or the
                  Websites will be free of viruses or other destructive code.
                  You are responsible for implementing sufficient procedures and
                  checkpoints to satisfy your particular requirements for
                  anti-virus protection and accuracy of data input and output,
                  and for maintaining a means external to our site for any
                  reconstruction of any lost data. WE WILL NOT BE LIABLE FOR ANY
                  LOSS OR DAMAGE CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE
                  ATTACK, VIRUSES OR OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT
                  MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA OR
                  OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF THE WEBSITES OR
                  ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITES OR TO YOUR
                  DOWNLOADING OF ANY MATERIAL POSTED ON IT, OR ON ANY WEBSITES
                  LINKED TO IT.
                </p>
                <p class="tos-desc">
                  YOUR USE OF THE WEBSITE, ITS CONTENT AND ANY SERVICES OR ITEMS
                  OBTAINED THROUGH THE WEBSITES IS AT YOUR OWN RISK. THE
                  WEBSITE, ITS CONTENT AND ANY SERVICES OR ITEMS OBTAINED
                  THROUGH THE WEBSITES ARE PROVIDED ON AN "AS IS" AND "AS
                  AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER
                  EXPRESS OR IMPLIED. NEITHER STEALTH NOR ANY PERSON ASSOCIATED
                  WITH STEALTH MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT
                  TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY
                  OR AVAILABILITY OF THE WEBSITES. WITHOUT LIMITING THE
                  FOREGOING, NEITHER STEALTH NOR ANYONE ASSOCIATED WITH STEALTH
                  REPRESENTS OR WARRANTS THAT THE WEBSITE, ITS CONTENT OR ANY
                  SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITES WILL BE
                  ACCURATE, RELIABLE, ERROR-FREE OR UNINTERRUPTED, THAT DEFECTS
                  WILL BE CORRECTED, THAT OUR SITE OR THE SERVER THAT MAKES IT
                  AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR
                  THAT THE WEBSITES OR ANY SERVICES OR ITEMS OBTAINED THROUGH
                  THE WEBSITES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
                </p>
                <p class="tos-desc">
                  STEALTH HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER
                  EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT
                  LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT
                  AND FITNESS FOR A PARTICULAR PURPOSE.
                </p>
                <p class="tos-desc">
                  SOME JURISDICTIONS DO NOT ALLOW the EXCLUSION OF WARRANTIES OR
                  LIMITATIONS ON THE DURATION OF IMPLIED WARRANTIES, SO THE
                  ABOVE DISCLAIMER MAY NOT APPLY TO YOU IN THEIR ENTIRETIES BUT
                  WILL APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
                </p>
                <p class="tos-desc medium">16.Limitation on Liability</p>
                <p class="tos-desc">
                  IN NO EVENT WILL STEALTH, ITS AFFILIATES OR THEIR LICENSORS,
                  SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS OR DIRECTORS BE
                  LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY,
                  ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO
                  USE, THE WEBSITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON
                  THE WEBSITES OR SUCH OTHER WEBSITES OR ANY SERVICES OR ITEMS
                  OBTAINED THROUGH THE WEBSITES OR SUCH OTHER WEBSITES,
                  INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
                  CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
                  TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS,
                  LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR
                  ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF
                  DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE),
                  BREACH OF CONTRACT OR OTHERWISE, EVEN IF FORESEEABLE. THE
                  FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE
                  EXCLUDED OR LIMITED UNDER APPLICABLE LAW WHICH MAY INCLUDE
                  FRAUD.
                </p>
                <p class="tos-desc medium">17. Indemnification</p>
                <p class="tos-desc">
                  You agree to defend, indemnify and hold harmless Stealth, its
                  affiliates, licensors and service providers, and its and their
                  respective officers, directors, employees, contractors,
                  agents, licensors, suppliers, successors and assigns from and
                  against any claims, liabilities, damages, judgments, awards,
                  losses, costs, expenses or fees (including reasonable
                  attorneys' fees) arising out of or relating to your violation
                  of these Terms of Use or your use of the Website, including,
                  but not limited to, any use of the Website's content, services
                  and products other than as expressly authorized in these Terms
                  of Use or your use of any information obtained from the
                  Websites.
                </p>
                <p class="tos-desc medium">
                  18. Governing Law and Jurisdiction
                </p>
                <p class="tos-desc">
                  All matters relating to the Websites and these Terms of Use
                  and any dispute or claim arising therefrom or related thereto
                  (in each case, including non-contractual disputes or claims),
                  shall be governed by and construed in accordance with the
                  internal laws of the United States without giving effect to
                  any choice or conflict of law provision or rule (whether of
                  the United States or any other jurisdiction).
                </p>
                <p class="tos-desc">
                  Any legal suit, action or proceeding arising out of, or
                  related to, these Terms of Use or the Websites shall be
                  instituted exclusively in the United States although we retain
                  the right to bring any suit, action or proceeding against you
                  for breach of these Terms of Use in your country of residence
                  or any other relevant country. You waive any and all
                  objections to the exercise of jurisdiction over you by such
                  courts and to venue in such courts.
                </p>
                <p class="tos-desc medium">19. Waiver and Severability</p>
                <p class="tos-desc">
                  No waiver of by Stealth of any term or condition set forth in
                  these Terms of Use shall be deemed a further or continuing
                  waiver of such term or condition or a waiver of any other term
                  or condition, and any failure of Stealth to assert a right or
                  provision under these Terms of Use shall not constitute a
                  waiver of such right or provision.
                </p>
                <p class="tos-desc">
                  If any provision of these Terms of Use is held by a court or
                  other tribunal of competent jurisdiction to be invalid,
                  illegal or unenforceable for any reason, such provision shall
                  be eliminated or limited to the minimum extent such that the
                  remaining provisions of the Terms of Use will continue in full
                  force and effect.
                </p>
                <p class="tos-desc medium">20. Entire Agreement</p>
                <p class="tos-desc">
                  The Terms of Use, our Privacy Policy and terms of conditions
                  for the registration of events constitute the sole and entire
                  agreement between you and the Stealth R&D, LLC with respect to
                  the Websites and supersede all prior and contemporaneous
                  understandings, agreements, representations and warranties,
                  both written and oral, with respect to the Websites.
                </p>
                <p class="tos-desc medium">21. Your Comments and Concerns</p>
                <p class="tos-desc">
                  This Websites is operated by Stealth. All other feedback,
                  comments, requests for technical support and other
                  communications relating to the Websites should be directed to:
                  <a href="mailto:contact@stealth.org">contact@stealth.org</a>
                </p>
                <p class="tos-desc">Last modified: September 2019</p>
                <div class="terms-of-service--box">
                  <ul>
                    <li>
                      <p>
                        I understand that my XST (Stealth) stored on this device
                        are not secured by any entity.
                      </p>
                    </li>
                    <li>
                      <p>
                        I understand that if this app is deleted or my device is
                        either damaged or lost, my XST can only be recovered
                        using the "Recovery Phrase" that I will set-up
                      </p>
                    </li>
                    <li>
                      <p>I have read and agree to the Terms of Use</p>
                    </li>
                  </ul>
                  <StCheckbox v-model="termsOfService"
                    >I have read and agree to the Terms of Use</StCheckbox
                  >
                </div>
                <div class="button-confirm">
                  <StButton :disabled="!termsOfService" @click="nextStep"
                    >Confirm</StButton
                  >
                </div>
              </div>
            </div>
            <div class="step set-password" v-if="currentStep === 5">
              <div>
                <h5>Set Your Password</h5>
                <p class="desc">
                  Your Password will be used to unlock your StealthSend app.
                </p>
                <StFormItem
                  label="Password"
                  :filled="form.password.$value"
                  :error-message="form.password.$errors"
                >
                  <StInput
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password.$value"
                    placeholder="Please enter password"
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
                      <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
                    </svg>
                  </StInput>
                </StFormItem>
                <StFormItem
                  label="Confirm Password"
                  :filled="form.confirmPassword.$value"
                  :error-message="form.confirmPassword.$errors"
                >
                  <StInput
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="form.confirmPassword.$value"
                    placeholder="Please repeat the Password to confirm"
                  >
                    <svg
                      v-if="!showConfirmPassword"
                      @click="showConfirmPassword = true"
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
                      @click="showConfirmPassword = false"
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
                  </StInput>
                </StFormItem>
              </div>
              <StButton @click="handleSubmit">Proceed</StButton>
            </div>
            <!-- <div class="step" v-if="currentStep === 6">
              <div>
                <h5>Set Your Payment Code</h5>
                <p class="desc">
                  Your Payment code will be used to send funds.
                </p>
                <StFormItem
                  label="Payment Code"
                  :error-message="form.paymentCode.$errors"
                >
                  <PaymentCode
                    id="digit"
                    key="paymentCode"
                    position="left"
                    v-model="form.paymentCode.$value"
                  />
                </StFormItem>
              <StFormItem label="Confirm Payment Code" :error-message="form.confirmPaymentCode.$errors">
                <PaymentCode key="confirmPaymentCode" position="left" v-model="form.confirmPaymentCode.$value" />
              </StFormItem>
              </div>
              <StButton @click="handleSubmit">Proceed</StButton>
            </div> -->
            <div class="step create-notice" v-if="currentStep === 6">
              <div>
                <h5>Create a New Account</h5>
                <div class="notice">
                  <h6>Notice</h6>
                  <p>
                    Once you have selected your new account name, you will need
                    to create a Recovery Phrase to backup the account and
                    complete the setup.
                  </p>
                </div>
                <StFormItem
                  label="Account Name"
                  :filled="form.account.$value"
                  :error-message="form.account.$errors"
                >
                  <StInput
                    id="account-name"
                    v-model="form.account.$value"
                    placeholder="Enter Account Name"
                  />
                </StFormItem>
              </div>
              <StButton @click="handleSubmit">Proceed</StButton>
            </div>
            <div class="step" v-if="currentStep === 7">
              <div class="recovery">
                <h5>Recovery Phrase</h5>
                <p>Security is as important to us as it is to you!</p>
                <p>
                  To protect your account balances in the event you lose access
                  to your StealthSend application, you will need to create a
                  backup now.
                </p>
                <p>
                  To do this, you will have to create a unique Recovery Phrase
                  that will backup all of the accounts that you create using
                  this application.
                </p>
                <p>
                  Note that you can create an unlimited number of accounts, they
                  are all derived from the same Recovery Phrase.
                </p>
                <p>
                  Please store your Recovery Phrase offline in a secure place as
                  it is the only backup of your private keys and the only way
                  for you to recover your funds.
                </p>
              </div>
              <StButton @click="handleSubmit">Proceed</StButton>
            </div>
            <div class="step" v-if="currentStep === 8">
              <div class="recovery">
                <h5>Recovery Phrase</h5>
                <p>Let's get started creating your unique Recovery Phrase.</p>
                <p>
                  A list of randomly created words will be displayed, and the
                  combination will be unique to your wallet.
                </p>
                <p>
                  Ensure that you record them carefully for secure online and
                  offline storage.
                </p>
                <p>Please select your choice of the following options:</p>
                <div class="radio-container">
                  <StRadio
                    v-model="recoveryPhraseLength"
                    type="square"
                    name="recoveryPhraseLength"
                    value="12"
                    >12 Word Recovery Phrase</StRadio
                  >
                  <StRadio
                    v-model="recoveryPhraseLength"
                    type="square"
                    name="recoveryPhraseLength"
                    value="18"
                    >18 Word Recovery Phrase</StRadio
                  >
                  <StRadio
                    v-model="recoveryPhraseLength"
                    type="square"
                    name="recoveryPhraseLength"
                    value="24"
                    >24 Word Recovery Phrase</StRadio
                  >
                </div>
              </div>
              <StButton @click="handleSubmit">Proceed</StButton>
            </div>
            <div class="step" v-if="currentStep === 9">
              <div>
                <h5>Recovery Phrase</h5>
                <h6>Your new StealthSend Account is being prepared.</h6>
                <p class="desc-medium">
                  A random list of words unique to your wallet is being <br />
                  generated.
                </p>
                <svg
                  width="76"
                  height="78"
                  viewBox="0 0 76 78"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="30.5"
                    y="2"
                    width="27"
                    height="74"
                    fill="url(#paint0_linear)"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M50.4153 2H57.5V76H12.5L50.4153 2Z"
                    fill="url(#paint1_linear)"
                  />
                  <path
                    d="M57.4988 2H1.5L1.5 76H57.5V50.9355L39.2391 30.6452V12.7419L57.5 2"
                    stroke="#4E00F6"
                    stroke-width="3"
                  />
                  <path
                    d="M13.0217 40.5H35.9783"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M12.8261 31.5H27.1739"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M12.8261 24.5H27.1739"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M13.0217 56.5H35.9783"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M13.0217 49.5H35.9783"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M74.5 12.7561V30.6829L56.5 51L38.5 30.6829L38.5 12.7561L56.4988 2L74.5 12.7561Z"
                    stroke="#4E00F6"
                    stroke-width="3"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M51.5 22H61.5V14H51.5V22Z"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M49.5 31H63.5V20H49.5V31Z"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="30.5"
                      y1="2"
                      x2="30.5"
                      y2="76"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                      <stop
                        offset="1"
                        stop-color="#C3A9FB"
                        stop-opacity="0.5"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear"
                      x1="12.5"
                      y1="2"
                      x2="12.5"
                      y2="76"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                      <stop
                        offset="1"
                        stop-color="#C3A9FB"
                        stop-opacity="0.25"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <StProgress :duration="progressDuration" />
            </div>
            <div class="step" v-if="currentStep === 10">
              <div>
                <h5>Recovery Phrase</h5>
                <h6>Your new StealthSend account was created.</h6>
                <p class="desc-medium">
                  Your random list of words is ready to be saved.
                </p>
                <svg
                  width="76"
                  height="78"
                  viewBox="0 0 76 78"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="30.5"
                    y="2"
                    width="27"
                    height="74"
                    fill="url(#paint0_linear)"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M50.4153 2H57.5V76H12.5L50.4153 2Z"
                    fill="url(#paint1_linear)"
                  />
                  <path
                    d="M57.4988 2H1.5L1.5 76H57.5V50.9355L39.2391 30.6452V12.7419L57.5 2"
                    stroke="#4E00F6"
                    stroke-width="3"
                  />
                  <path
                    d="M13.0217 40.5H35.9783"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M12.8261 31.5H27.1739"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M12.8261 24.5H27.1739"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M13.0217 56.5H35.9783"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    d="M13.0217 49.5H35.9783"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linecap="square"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M74.5 12.7561V30.6829L56.5 51L38.5 30.6829L38.5 12.7561L56.4988 2L74.5 12.7561Z"
                    stroke="#4E00F6"
                    stroke-width="3"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M51.5 22H61.5V14H51.5V22Z"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M49.5 31H63.5V20H49.5V31Z"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="30.5"
                      y1="2"
                      x2="30.5"
                      y2="76"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E0D3FC" stop-opacity="0.25" />
                      <stop
                        offset="1"
                        stop-color="#C3A9FB"
                        stop-opacity="0.5"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear"
                      x1="12.5"
                      y1="2"
                      x2="12.5"
                      y2="76"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E0D3FC" stop-opacity="0.15" />
                      <stop
                        offset="1"
                        stop-color="#C3A9FB"
                        stop-opacity="0.25"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <StButton @click="handleSubmit">Show Recovery Phrase</StButton>
            </div>
            <div class="step" v-if="currentStep === 11">
              <div>
                <h5>Recovery Phrase</h5>
                <p>Carefully record all {{ recoveryPhraseLength }} words</p>
                <div class="mnemonic">
                  <span v-for="(word, index) in createdMnemonic" :key="word">
                    <strong>{{ index + 1 }}.</strong>{{ word }}
                  </span>
                </div>
              </div>
              <StButton @click="handleSubmit">Start Verification</StButton>
            </div>
            <div v-if="currentStep === 12">
              <h5>Recovery Phrase Verification</h5>
              <p>
                To verify your Recovery Phrase select the words in the order
                received.
              </p>
              <div>
                <div class="mnemonic-list">
                  <template v-if="reorderedMnemonic.length">
                    <span
                      class="clickable"
                      v-for="word in reorderedMnemonic"
                      :key="word"
                      @click="selectWordsInOrder(word)"
                      >{{ word }}</span
                    >
                  </template>
                  <p v-else class="no-results">No words to select</p>
                </div>
                <div class="mnemonic-list mnemonic-list__selected">
                  <transition-group name="bounce">
                    <template v-if="selectedWords.length">
                      <span v-for="word in selectedWords" :key="word">{{
                        word
                      }}</span>
                    </template>
                    <p v-else class="no-results">
                      Select the words in the order received
                    </p>
                  </transition-group>
                </div>
                <transition name="fade">
                  <a
                    v-if="selectedWords.length"
                    class="clear"
                    @click="clearAndRedoWords"
                    >Clear and redo</a
                  >
                </transition>
                <p class="mnemonic-error">{{ mnemonicError }}</p>
              </div>
            </div>
            <div v-if="currentStep === 13">
              <h5>Checking Recovery Phrase</h5>
              <p class="desc-medium">
                Please be patient and don’t turn off the computer or exit the
                application
              </p>
              <img src="../../static/xstloader.gif" alt="Test gif" />
            </div>
            <div class="step" v-if="currentStep === 14">
              <div>
                <h5>Congratulations</h5>
                <p>Recovery Phrase successfully verified</p>
                <div class="recovery-check">
                  <p>
                    Keep your Recovery Phrase in a safe place, the safety of
                    your XST is based on it.
                  </p>
                  <StCheckbox v-model="recoveryPhraseConfirmation"
                    >I have stored the Recovery Phrase in a safe
                    place</StCheckbox
                  >
                </div>
              </div>
              <StButton
                @click="createNewWallet"
                :disabled="!recoveryPhraseConfirmation"
                >Confirm</StButton
              >
            </div>
          </transition-group>
        </div>
        <div v-if="currentStep < 4" class="right__inner-bottom">
          <div
            class="pagination-prev"
            :class="{ 'pagination-prev--none': currentStep === 0 }"
            @click="prevStep"
          >
            <svg
              width="19"
              height="14"
              viewBox="0 0 19 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 7H19" stroke="#4E00F6" stroke-width="2" />
              <path d="M8 13L2 7L8 1" stroke="#4E00F6" stroke-width="2" />
            </svg>
          </div>
          <div class="pagination-dot">
            <span
              class="dot"
              @click="chooseStep(index)"
              v-for="(pagination, index) in 4"
              :key="index"
              :class="{ 'dot-active': currentStep === index }"
            ></span>
          </div>
          <div
            class="pagination-next"
            :class="{ 'pagination-next--none': currentStep === 4 }"
            @click="nextStep"
          >
            <svg
              width="19"
              height="14"
              viewBox="0 0 19 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 7H17" stroke="#4E00F6" stroke-width="2" />
              <path d="M11 13L17 7L11 1" stroke="#4E00F6" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>
      <div v-if="isRecovery" class="right__inner">
        <div class="right__inner-top">
          <div class="step" v-if="recoveryStep === 0">
            <div>
              <h5>Restore from Recovery Phrase</h5>
              <StFormItem
                class="custom-st-form"
                label="Account Name"
                :filled="recoveryForm.account.$value"
                :error-message="recoveryForm.account.$errors"
              >
                <StInput
                  id="account-name"
                  v-model="recoveryForm.account.$value"
                  placeholder="Enter Account Name"
                />
              </StFormItem>
            </div>
            <StButton @click="recoveryStepNext">Proceed</StButton>
          </div>
          <div class="step" v-if="recoveryStep === 1">
            <div>
              <h5>Restore from Recovery Phrase</h5>
              <p class="desc-small">
                You are about to restore a backup using an existing Recovery
                Phrase.
              </p>
              <div class="recovery-select">
                <p>Please select:</p>
                <StRadio
                  type="square"
                  v-model="restoreRecoveryPhraseLength"
                  value="12"
                  >12 Word Recovery Phrase</StRadio
                >
                <StRadio
                  type="square"
                  v-model="restoreRecoveryPhraseLength"
                  value="18"
                  >18 Word Recovery Phrase</StRadio
                >
                <StRadio
                  type="square"
                  v-model="restoreRecoveryPhraseLength"
                  value="24"
                  >24 Word Recovery Phrase</StRadio
                >
              </div>
            </div>
            <StButton @click="recoveryStepNext">Proceed</StButton>
          </div>
          <div class="recovery-phrase-flex" v-if="recoveryStep === 2">
            <div>
              <h5>Recovery Phrase Verification</h5>
              <p class="desc-small">
                To verify your Recovery Phrase enter the words<br />
                in the order received.
              </p>
              <div class="mnemonic-list">
                <template v-if="selectedRecoveryWords.length">
                  <span
                    v-for="(word, index) in selectedRecoveryWords"
                    :key="word"
                    >{{ word }}
                    <div
                      v-if="index + 1 === selectedRecoveryWords.length"
                      @click="removeSelectedWord(word)"
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L7 7"
                          stroke="#1C1A1C"
                          stroke-width="1.5"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M1 7L7 1"
                          stroke="#1C1A1C"
                          stroke-width="1.5"
                          stroke-linejoin="round"
                        />
                      </svg></div
                  ></span>
                </template>
              </div>
              <transition name="fade">
                <a class="clear" @click="clearRecoveryWords">{{
                  selectedRecoveryWords.length ? 'Clear and redo' : ''
                }}</a>
              </transition>
            </div>
            <StFormItem
              class="word-st-form-item"
              :filled="recoveryWord"
              :label="`Word ${
                selectedRecoveryWords.length + 1
              } (of ${restoreRecoveryPhraseLength})`"
            >
              <StInput
                id="recovery-word"
                :placeholder="`Enter ${selectedRecoveryWords.length + 1}. word`"
                v-model="recoveryWord"
                @keyup.enter="selectRecoveryPhraseWord(recoveryWord)"
              >
                <div @click="recoveryWord = ''" class="clear-icon">
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.45459 1L13.4546 13"
                      stroke="#4E00F6"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1.45459 13L13.4546 0.999999"
                      stroke="#4E00F6"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div
                  @click="selectRecoveryPhraseWord(recoveryWord)"
                  class="check-icon"
                >
                  <svg
                    width="17"
                    height="12"
                    viewBox="0 0 17 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.4546 1L5.90914 10L1.45459 5"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                  </svg>
                </div>
              </StInput>
              <p v-if="isError" class="mnemonic-error">
                Selected word is not in wordlist
              </p>
              <div v-else class="searched-words">
                <transition-group name="fade">
                  <a
                    v-for="word in searchWordlist"
                    :key="word"
                    @click="selectRecoveryPhraseWord(word)"
                    >{{ word }}</a
                  >
                </transition-group>
              </div>
            </StFormItem>
          </div>
          <div v-if="recoveryStep === 3">
            <h5>Checking Recovery Phrase</h5>
            <p class="desc-medium">
              Please be patient and don’t turn off the computer or exit the
              application
            </p>
            <img src="../../static/xstloader.gif" alt="checkPhrase" />
          </div>
          <div v-if="recoveryStep === 4" class="step">
            <div>
              <h5>{{ isValidMnemonic ? 'Congratulations' : 'Error' }}</h5>
              <h6>
                {{
                  isValidMnemonic
                    ? 'Recovery Phrase successfully verified'
                    : 'Recovery Phrase is not valid'
                }}
              </h6>
            </div>
            <StButton v-if="isValidMnemonic" @click="recoveryStepNext"
              >Proceed</StButton
            >
            <StButton v-else @click="goBack">Back</StButton>
          </div>
          <div class="step set-password" v-if="recoveryStep === 5">
            <div>
              <h5>Set Your Password</h5>
              <p class="desc">
                Your Password will be used to unlock your StealthSend app.
              </p>
              <StFormItem
                label="Password"
                :filled="form.password.$value"
                :error-message="form.password.$errors"
              >
                <StInput
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password.$value"
                  placeholder="Please enter password"
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
                    <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
                  </svg>
                </StInput>
              </StFormItem>
              <StFormItem
                label="Confirm Password"
                :filled="form.confirmPassword.$value"
                :error-message="form.confirmPassword.$errors"
              >
                <StInput
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="form.confirmPassword.$value"
                  placeholder="Please repeat the Password to confirm"
                >
                  <svg
                    v-if="!showConfirmPassword"
                    @click="showConfirmPassword = true"
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
                    @click="showConfirmPassword = false"
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
                </StInput>
              </StFormItem>
            </div>
            <StButton @click="recover">Proceed to Dashboard</StButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect, computed } from 'vue';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { useMainStore } from '@/store';
import router from '../router';
import CryptoService from '../services/crypto';
import { add, format } from 'mathjs';
import { useValidation, ValidationError } from 'vue3-form-validation';
/* import PaymentCode from '@/components/elements/PaymentCode.vue'; */
import StProgress from '@/components/elements/StProgress.vue';
import _shuffle from 'lodash/shuffle';
import _cloneDeep from 'lodash/cloneDeep';
import Lottie from 'vue-lottie/src/lottie.vue';
import * as animationData from '@/assets/animation/logo.json';
import pkgjson from '@/../package.json';

export default {
  name: 'StWelcome',
  components: {
    /* PaymentCode, */
    StProgress,
    Lottie,
  },
  setup() {
    const mainStore = useMainStore();

    const recoverWallet = ref(false);
    const mnemonic = ref('');
    const recovered = ref({});
    const password = ref('');
    const confirmPassword = ref('');
    const paymentCode = ref('');
    /* const confirmPaymentCode = ref(''); */
    const account = ref('');
    const recoveryPhraseLength = ref('12');
    const restoreRecoveryPhraseLength = ref('12');
    const recoveryPhraseConfirmation = ref(false);
    const progressDuration = ref(5);
    const createdMnemonic = ref([]);
    const reorderedMnemonic = ref([]);
    const mnemonicError = ref('');
    const isValidMnemonic = ref(false);

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const isWelcome = ref(false);
    const isAccount = ref(false);
    const isRecovery = ref(false);
    const currentStep = ref(0);
    const recoveryStep = ref(0);
    const paginationLength = ref(18);
    const termsOfService = ref(false);
    const wordlist = ref([]);
    const recoveryWord = ref('');
    const selectedRecoveryWords = ref([]);
    const finishedAnimation = ref(false);
    const animation = ref(null); // for saving the reference to the animation
    const lottieOptions = ref({
      animationData: animationData.default,
      render: 'svg',
      loop: false,
      autoplay: true,
    });
    const version = ref(pkgjson.version);

    const { form, errors, submitting, validateFields, resetFields } =
      useValidation({
        password: {
          $value: password,
          $rules: [
            {
              rule: () => password.value.length || 'Password is required',
            },
            {
              key: 'pw',
              rule: () =>
                password.value === confirmPassword.value ||
                'Passwords do not match',
            },
          ],
        },
        confirmPassword: {
          $value: confirmPassword,
          $rules: [
            {
              rule: () =>
                confirmPassword.value.length || 'Confirm password is required',
            },
            {
              key: 'pw',
              rule: () =>
                password.value === confirmPassword.value ||
                'Passwords do not match',
            },
          ],
        },
        /* paymentCode: {
          $value: paymentCode,
          $rules: [
            {
              rule: () => {
                if (currentStep.value === 7) {
                  return (
                    paymentCode.value.length >= 5 || 'Payment code is required'
                  );
                }
              },
            },
            {
            key: "pc",
            rule: () =>
              paymentCode.value === confirmPaymentCode.value ||
              "Payment codes do not match"
          }
          ],
        }, */
        /* confirmPaymentCode: {
        $value: confirmPaymentCode,
        $rules: [
          {
            rule: () => {
              if(currentStep.value === 7) {
                return confirmPaymentCode.value.length >= 5 || 'Confirm payment code is required'
              }
            }
          },
          {
            key: "pc",
            rule: () =>
              paymentCode.value === confirmPaymentCode.value ||
              "Payment codes do not match"
          }
        ]
      } */
        account: {
          $value: account,
          $rules: [
            {
              rule: () => {
                if (currentStep.value === 6) {
                  return !account.value && 'Account name is required';
                }
                if (account.value.length > 50) {
                  return 'Name too long';
                }
              },
            },
          ],
        },
      });
    const {
      form: recoveryForm,
      validateFields: validateRecoveryFields,
      resetFields: resetRecoveryFields,
    } = useValidation({
      account: {
        $value: account,
        $rules: [
          {
            rule: () => {
              if (!account.value) {
                return 'Account name is required';
              }
              if (account.value.length > 50) {
                return 'Name too long';
              }
            },
          },
        ],
      },
    });

    watchEffect(async () => {
      if (currentStep.value === 5) {
        setTimeout(
          () =>
            document
              .getElementById('password')
              .getElementsByClassName('st-input__inner')[0]
              .focus(),
          1
        );
      }
      /* if (currentStep.value === 7) {
        setTimeout(
          () =>
            document
              .getElementById('digit')
              .getElementsByClassName('digit-0')[0]
              .focus(),
          1
        );
      } */
      if (currentStep.value === 6) {
        setTimeout(() => {
          document
            .getElementById('account-name')
            .getElementsByClassName('st-input__inner')[0]
            .focus();
        });
      }
      if (currentStep.value === 9) {
        setTimeout(() => {
          handleSubmit();
        }, progressDuration.value * 1000);
      }
      if (currentStep.value === 10) {
        // generate new mnemonic
        let generateMnemonic = await CryptoService.generateMnemonicAndSeed(
          Number(recoveryPhraseLength.value)
        );
        createdMnemonic.value = generateMnemonic.mnemonic.split(' ');
        reorderedMnemonic.value = _shuffle(_cloneDeep(createdMnemonic.value));
      }
      if (recoveryStep.value === 2) {
        // Fill array with wordlist
        wordlist.value = await bip39.wordlists.EN;
        setTimeout(
          () =>
            document
              .getElementById('recovery-word')
              .getElementsByClassName('st-input__inner')[0]
              .focus(),
          1
        );
      }
      if (recoveryStep.value === 3) {
        setTimeout(() => recoveryStepNext(), 4200);
      }
      if (recoveryStep.value === 4) {
        // Clear selected words if mnemonic is not valid
        if (!isValidMnemonic.value) {
          selectedRecoveryWords.value = [];
        }
      }
    });

    const selectedWords = ref([]);

    // Search word in wordlist
    const searchWordlist = computed(() => {
      if (recoveryWord.value.length < 2) return;
      return wordlist.value
        .filter((word) => word.startsWith(recoveryWord.value))
        .slice(0, 3);
    });

    onMounted(() => {
      setTimeout(() => {
        isWelcome.value = true;
      }, 3500);
      setTimeout(() => {
        window.ipc.send('resize:create');
      }, 10);
    });

    const isError = ref(false);

    function selectRecoveryPhraseWord(word) {
      // Clear input
      recoveryWord.value = '';
      if (wordlist.value.includes(word)) {
        // Push mnemonic in array
        selectedRecoveryWords.value.push(word);
      } else {
        // Error if selected word is not in wordlist
        isError.value = true;
        setTimeout(() => (isError.value = false), 3000);
      }
      // Check mnemonic length and go to next step
      if (
        selectedRecoveryWords.value.length ===
        Number(restoreRecoveryPhraseLength.value)
      ) {
        // check if mnemonic is valid
        isValidMnemonic.value = CryptoService.isMnemonicValid(
          selectedRecoveryWords.value.join(' ')
        );
        recoveryStepNext();
      }
    }

    // Remove word from selected words
    function removeSelectedWord(word) {
      selectedRecoveryWords.value.splice(
        selectedRecoveryWords.value.indexOf(word),
        1
      );
    }

    // Undo all words on recovery phrase
    async function clearRecoveryWords() {
      wordlist.value = await bip39.wordlists.EN;
      recoveryWord.value = '';
      selectedRecoveryWords.value = [];
    }

    async function selectWordsInOrder(item) {
      let removedWord = reorderedMnemonic.value.splice(
        reorderedMnemonic.value.indexOf(item),
        1
      );
      selectedWords.value.push(removedWord[0]);
      let isEqual = true;
      if (selectedWords.value.length === createdMnemonic.value.length) {
        for (let i = 0; i <= createdMnemonic.value.length; i++) {
          if (selectedWords.value[i] !== createdMnemonic.value[i]) {
            isEqual = false;
            break;
          }
        }
        if (!mnemonicError.value) {
          nextStep();
        }
        setTimeout(() => {
          if (isEqual) {
            nextStep();
          } else {
            prevStep();
            mnemonicError.value =
              'Words are not selected in the order received';
            clearAndRedoWords();
          }
        }, 4200);
      }
    }

    function clearAndRedoWords() {
      reorderedMnemonic.value = _shuffle(_cloneDeep(createdMnemonic.value));
      selectedWords.value = [];
      setTimeout(() => (mnemonicError.value = ''), 4000);
    }
    function prevStep() {
      if (currentStep.value !== 0) {
        currentStep.value -= 1;
      }
    }
    function chooseStep(step) {
      currentStep.value = step;
    }
    function nextStep() {
      if (currentStep.value < paginationLength.value - 1) {
        currentStep.value += 1;
      }
    }
    async function recoveryStepNext() {
      await validateRecoveryFields();
      recoveryStep.value += 1;
    }

    async function recover() {
      mainStore.START_GLOBAL_LOADING();
      // recover an existing wallet via mnemonic
      // password is asked because we have to lock the seed in the database
      // user is createing a new password in this step
      try {
        await validateFields();
        let mnemonic = selectedRecoveryWords.value.join(' ');
        // let bytes = bip39.mnemonicToSeedSync(mnemonic);
        let bytes = await bip39.mnemonicToSeed(mnemonic);
        const master = await bip32.fromSeed(bytes, CryptoService.network); // root
        recovered.value = {
          seed: bytes.toString('hex'),
          master: master,
        };

        CryptoService.seed = bytes.toString('hex');
        CryptoService.master = master;
        await CryptoService.storeWalletInDb(password.value);
        await CryptoService.storeMnemonicInWallet(selectedRecoveryWords.value);
        const lastAccountPath = await CryptoService.findLastUsedAccountPath();
        for (let i = 0; i <= lastAccountPath + 1; i++) {
          await restoreAccounts();
        }
        CryptoService.isFirstArrival = false;
        await CryptoService.unlock(password.value);
        // goToDashboard();
        resetFields();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e.message);
        }
        mainStore.STOP_GLOBAL_LOADING();
      }
    }

    async function restoreAccounts() {
      mainStore.START_GLOBAL_LOADING();

      let next = await CryptoService.getNextAccountPath();
      const { address, path, xpub, wif } = CryptoService.getChildFromRoot(
        next,
        0,
        0
      );

      const hdAccount = await mainStore.rpc('gethdaccount', [xpub]);

      let accUtxo = 0;

      for (let tx of hdAccount) {
        accUtxo = add(accUtxo, tx.account_balance_change);
        accUtxo = format(accUtxo, { precision: 8 });
      }

      let acc = {
        xpub: xpub,
        address: address,
        label: `${account.value} ${next + 1}` || `Account ${next + 1}`,
        utxo: accUtxo,
        isArchived: false,
        isFavourite: false,
        isImported: false,
        asset: 'XST',
        wif: wif,
        path: path,
      };

      await CryptoService.storeAccountInDb(acc);

      mainStore.STOP_GLOBAL_LOADING();
    }

    const createWallet = ref(false);
    async function createNewWallet() {
      // new wallet is created
      // therefore, new password can be made
      mainStore.START_GLOBAL_LOADING();
      /* createdMnemonic.value = await CryptoService.generateMnemonicAndSeed(); */
      await CryptoService.storeWalletInDb(password.value);
      await CryptoService.storeMnemonicInWallet(selectedWords.value);

      await restoreAccounts();
      goToDashboard();
      mainStore.STOP_GLOBAL_LOADING();
    }

    async function handleSubmit() {
      try {
        await validateFields();
        nextStep();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e.message);
        }
      }
    }

    function goBack() {
      recoveryStep.value = 0;
      resetRecoveryFields();
    }

    function handleAnimation(anim) {
      animation.value = anim;
    }

    const isLoading = computed(() => {
      return mainStore.globalLoading;
    });

    function goToDashboard() {
      router.push('/dashboard');
    }
    return {
      isWelcome,
      isAccount,
      isRecovery,
      currentStep,
      recoveryStep,
      paginationLength,
      termsOfService,
      goToDashboard,
      form,
      errors,
      submitting,
      resetFields,
      handleSubmit,
      showPassword,
      showConfirmPassword,
      progressDuration,
      mnemonicError,
      wordlist,
      searchWordlist,
      recoveryWord,
      selectedRecoveryWords,
      isError,
      isValidMnemonic,
      lottieOptions,

      reorderedMnemonic,
      selectedWords,

      recoverWallet,
      mnemonic,
      recover,
      recovered,
      paymentCode,
      /* confirmPaymentCode, */
      account,
      recoveryPhraseLength,
      recoveryPhraseConfirmation,
      restoreRecoveryPhraseLength,
      handleAnimation,
      finishedAnimation,

      clearAndRedoWords,
      clearRecoveryWords,
      selectWordsInOrder,
      selectRecoveryPhraseWord,
      removeSelectedWord,
      prevStep,
      chooseStep,
      nextStep,
      recoveryStepNext,
      password,
      confirmPassword,
      createWallet,
      createdMnemonic,
      createNewWallet,
      recoveryForm,
      goBack,

      version,

      isLoading,
    };
  },
};
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  display: none;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.welcome {
  display: flex;
  height: 100vh;
}
.left {
  padding: 20px 70px 60px;
  position: relative;
  width: calc(100% - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.left-active {
  align-items: baseline;
}
.left__inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: width 0.3s;
}
.left__inner--active {
  align-items: baseline;
}
.left__inner--active .logo {
  margin-left: -12px !important;
}
.logo {
  min-height: 158px;
  max-width: 197px;
  margin: 0 0 20px !important;
}
.left video,
.left img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left;
  z-index: -2;
  pointer-events: none;
}
.left .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background-color: rgba(20, 4, 53, 0.6);
}
.left .box {
  width: 350px;
  max-width: 100%;
  height: 0;
  overflow: hidden;
  transition: 0.7s;
}
.left .box-full {
  width: 100%;
}
.left .box-animated {
  height: 100%;
}
.left .box .box__inner {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.left .box .box__inner--right {
  text-align: left;
}
.left .box .box__inner .title {
  margin-bottom: 40px;
}
.left .box .box__inner .subtitle {
  font-size: 20px;
}
.left .box .box__inner .title,
.left .box .box__inner .subtitle {
  color: var(--white);
}
.left .box .box__inner .buttons {
  margin: 0 auto;
  width: 100%;
  max-width: 265px;
}
.left .box .box__inner .buttons button {
  width: 100%;
  display: block;
}
.left .box .box__inner .buttons button + button {
  margin-top: 24px;
}
.left .box .box__inner .support {
  display: flex;
  align-items: center;
}
.left .box .box__inner .support p {
  margin-left: 25px;
  color: var(--white);
}
.right {
  overflow: hidden;
  width: 0;
  transition: 0.3s ease-in;
}
.right-opened {
  width: calc(100% + 170px);
}
.right__inner {
  padding: 80px 12px 64px 70px;
  height: calc(100% - 144px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.right__inner-top {
  height: 100%;
  width: 100%;
  max-width: 492px;
  text-align: center;
  overflow: auto;
  padding-right: 56px;
  box-sizing: border-box;
}
.right__inner-top::-webkit-scrollbar {
  width: 4px;
}
.right__inner-top::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.right__inner-top h5,
.right__inner-top h6 {
  margin-bottom: 48px;
}
.right__inner-top .desc {
  margin-bottom: 76px;
}
.right__inner-top .desc-medium {
  margin-bottom: 76px;
}
.right__inner-top .desc-small {
  margin-bottom: 48px;
}
.right__inner-bottom {
  padding-top: 10px;
  width: calc(100% - 39px);
  display: flex;
  align-items: center;
  padding-right: 60px;
}
.pagination-prev {
  cursor: pointer;
  display: flex;
  flex: 1 1 0%;
  justify-content: flex-start;
  transition: 0.3s;
}
.pagination-prev--none {
  opacity: 0;
}
.pagination-dot {
  display: flex;
  flex: 0 0 auto;
}
.pagination-dot .dot {
  cursor: pointer;
  margin: 0 4px;
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--grey100);
  transition: 0.3s;
}
.pagination-dot .dot:hover {
  background-color: var(--grey300);
}
.pagination-dot .dot-active {
  background-color: var(--grey300);
}
.pagination-next {
  cursor: pointer;
  display: flex;
  flex: 1 1 0%;
  justify-content: flex-end;
  transition: 0.3s;
}
.pagination-next--none {
  opacity: 0;
}
.pagination-prev svg path,
.pagination-next svg path {
  transition: 0.3s;
}
.pagination-prev:hover svg path,
.pagination-next:hover svg path {
  stroke: var(--marine100);
}
.terms-of-service {
  text-align: left;
}
.terms-of-service .tos-desc {
  margin-bottom: 24px;
}
.terms-of-service--box {
  padding: 24px;
  background-color: var(--background100);
}
.terms-of-service--box ul {
  list-style: initial;
  margin-left: 17px;
}
.terms-of-service--box ul li + li {
  margin-top: 2px;
}
:deep .st-checkbox {
  margin-top: 24px;
  font-size: 12px;
  line-height: 20px;
  padding-left: 32px;
  margin-bottom: 0;
  font-family: var(--secondary-font);
}
:deep .st-checkbox__checkmark {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 0;
}
:deep .st-checkbox__checkmark .check {
  top: 3px;
  left: 6px;
  width: 3px;
  height: 7px;
}
.terms-of-service .button-confirm {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}
.step {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.step.set-password {
  align-items: center;
}
.step.set-password > div .st-form-item {
  margin-bottom: 32px;
}
.step.create-notice > div {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step.create-notice > div .st-form-item {
  width: 100%;
  max-width: 392px;
}
.step button {
  margin: 40px auto 0;
}
.set-password > div {
  width: 100%;
  max-width: 384px;
}
.st-button {
  min-width: 233px;
  padding: 5px 64px;
  font-family: var(--secondary-font);
}
.notice {
  margin-bottom: 36px;
  padding: 24px;
  background-color: var(--background100);
}
.notice h6 {
  font-weight: 600;
  margin-bottom: 16px;
}
.notice p {
  color: var(--grey900);
  text-align: left;
}
.recovery p {
  text-align: left;
}
.recovery p + p {
  margin-top: 30px;
}
.radio-container {
  margin-top: 36px;
}
:deep .st-radio {
  margin-bottom: 16px;
  font-size: 12px;
}
:deep .st-radio__label {
  font-family: var(--secondary-font);
}
:deep .st-radio__square {
  top: 0;
}
.mnemonic {
  box-sizing: border-box;
  width: 400px;
  margin: 36px auto 0;
  padding: 20px;
  background-color: var(--background100);
  display: grid;
  grid-gap: 33px 10px;
  grid-template-columns: repeat(4, 3fr);
}
.mnemonic span,
.mnemonic-list span {
  position: relative;
  width: fit-content;
  height: fit-content;
  padding: 0 8px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  border-radius: 2px;
  white-space: nowrap;
  background: linear-gradient(
      153.02deg,
      rgba(221, 222, 242, 0.15) 0%,
      rgba(205, 206, 236, 0.15) 83.23%
    ),
    var(--purple100);
  font-family: var(--secondary-font);
}
.mnemonic-list .clickable {
  cursor: pointer;
}
.mnemonic span strong {
  margin-right: 5px;
}
.mnemonic-list span div {
  cursor: pointer;
  margin-left: 8px;
}
.mnemonic-list__selected span {
  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.15) 0%,
      rgba(207, 205, 209, 0.15) 83.23%,
      rgba(229, 228, 232, 0.15) 83.23%
    ),
    var(--grey100) !important;
}
.mnemonic span:first-child::after {
  display: none !important;
}
.mnemonic span:nth-child(4n + 1)::after {
  content: '';
  position: absolute;
  left: 0;
  top: -16px;
  right: 0;
  background-color: var(--grey100);
  display: block;
  height: 1px;
  width: 362px;
}
.mnemonic span strong {
  font-weight: 700;
}
.mnemonic span:nth-child(4n + 1) {
  margin-right: auto;
}
.mnemonic span:nth-child(4n + 2) {
  margin: 0 auto;
}
.mnemonic span:nth-child(4n + 3) {
  margin: 0 auto;
}
.mnemonic span:nth-child(4n + 4) {
  margin-left: auto;
}
.mnemonic-list:first-child {
  margin-top: 36px;
}
.mnemonic-list + .mnemonic-list {
  margin-top: 12px;
}
.mnemonic-list {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--background100);
  padding: 12px 11px;
  box-sizing: border-box;
}
.mnemonic-list span {
  margin: 8px 9px;
}
.mnemonic-list .no-results {
  margin: 0 9px;
}
.mnemonic-error {
  text-align: left;
  color: var(--red300);
}
.recovery-phrase-flex {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.clear {
  margin-top: 12px;
  cursor: pointer;
  display: block;
  width: fit-content;
  color: var(--marine500);
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  height: 24px;
  transition: 0.3s;
}
.clear:hover {
  color: var(--marine100);
}
.recovery-check {
  text-align: left;
  margin-top: 48px;
  background-color: var(--background100);
  padding: 24px;
}

/* RECOVERY PHRASE  */
.word-st-form-item {
  margin-top: 36px;
  margin-bottom: 0;
}
.recovery-select {
  text-align: left;
}
.recovery-select p {
  margin-bottom: 24px;
}
.searched-words {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.searched-words a {
  cursor: pointer;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  transition: 0.3s;
}
.searched-words a:hover {
  color: var(--marine500);
}
.clear-icon,
.check-icon {
  cursor: pointer;
}
.clear-icon path,
.check-icon path {
  transition: 0.3s;
}
.clear-icon:hover path,
.check-icon:hover path {
  stroke: var(--marine100);
}
.check-icon {
  margin-left: 28px;
}
:deep .st-input .st-icon {
  cursor: pointer;
}
.custom-st-form {
  max-width: 392px;
  margin: 96px auto 54px;
}

.app-version {
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: white;
  margin-top: auto;
}
</style>
