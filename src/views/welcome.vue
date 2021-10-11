<template>
  <div class="welcome">
    <div class="left" :class="{ 'left-active': isAccount || isRecovery }">
      <video
        id="bgAnimation"
        width="320"
        height="240"
        poster="@/assets/animationFrame.png"
        autoplay
        muted
      >
        <source src="backgroundAnimation.mp4" type="video/mp4" />
      </video>

      <div v-if="isVideoLoaded" class="overlay" />
      <div v-show="isLoading" class="xst-loader">
        <img src="../../static/xstloaderwhite.gif" alt="white gif" />
      </div>
      <div v-show="isLoading" class="xst-loader">
        <img src="../../static/xstloaderwhite.gif" alt="white gif" />
      </div>
      <div v-show="isLoading" class="xst-loader">
        <img src="../../static/xstloaderwhite.gif" alt="white gif" />
      </div>
      <div
        class="left__inner"
        :class="{
          'left__inner--active': isAccount || isRecovery || isAccountFinished,
        }"
      >
        <SvgIcon
          name="icon-stealth-logo"
          v-if="isAnimationFinished"
          class="welcome-logo"
        />
        <img v-else class="logo" src="@/assets/logo.gif" alt="welcome" />
        <div
          class="box"
          :class="{
            'box-animated': isWelcome,
            'box-full': isAccount || isRecovery || isAccountFinished,
          }"
        >
          <template v-if="isWelcome">
            <div
              class="box__inner"
              :class="{
                'box__inner--right':
                  isAccount || isRecovery || isAccountFinished,
              }"
            >
              <transition-group name="fade">
                <template v-if="isAccount || isAccountFinished">
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
                  <div class="app-version">StealthSend v{{ version }}</div>
                </template>
                <template v-if="isRecovery">
                  <h3 class="title">
                    World’s first feeless,<br />private high performance<br />blockchain
                    protocol
                  </h3>
                  <div class="app-version">StealthSend v{{ version }}</div>
                </template>
                <template v-if="!isAccountFinished">
                  <div v-if="!isAccount && !isRecovery">
                    <h4 class="title">Welcome to StealthSend</h4>
                    <h5 class="subtitle">
                      Would you like to create a new account or restore from
                      Recovery Phrase?
                    </h5>
                  </div>
                  <div v-if="isAccount || isRecovery" class="support"></div>
                  <div class="buttons" v-else>
                    <StButton type="type-d" @click="isAccount = true"
                      >Create a New Account</StButton
                    >
                    <StButton type="type-d" @click="isRecovery = true"
                      >Restore a Backup</StButton
                    >
                  </div>
                </template>
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
              <SvgIcon name="icon-recovery-phrase" />
            </div>

            <div v-if="currentStep === 1">
              <h5>Recovery Phrase</h5>
              <p class="desc">
                The Recovery Phrase is a set of 12-24 randomly selected words
                that will enable you to regain access to your wallet should you
                lose or damage your device.
              </p>
              <SvgIcon name="icon-recovery-words" />
            </div>

            <div v-if="currentStep === 2">
              <h5>Save the Phrase!</h5>
              <p class="desc">
                Please keep a secure and confidential copy of your Recovery
                Phrase offline to protect your funds from hackers and thieves.
              </p>
              <SvgIcon name="icon-words-security" />
            </div>
            <div v-if="currentStep === 3">
              <h5>About Your Password</h5>
              <p class="desc">
                I understand that if I lose my Password I will no longer be able
                to access the StealthSend app and will need to use my Recovery
                Phrase.
              </p>
              <SvgIcon name="icon-recovery-password" />
            </div>

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
                    placeholder="Please enter a password"
                    @input="handleSubmit"
                    @keyup.enter="handleSubmit"
                  >
                    <StTooltip
                      class="tooltip"
                      :tooltip="
                        !showPassword ? 'Show Password' : 'Hide Password'
                      "
                    >
                      <SvgIcon
                        name="icon-eye-opened"
                        v-if="!showPassword"
                        @click="showPassword = true"
                      />

                      <SvgIcon
                        name="icon-eye-closed"
                        v-else
                        @click="showPassword = false"
                      />
                    </StTooltip>
                  </StInput>
                </StFormItem>
                <StFormItem
                  label="Confirm Password"
                  :filled="form.confirmPassword.$value"
                  :error-message="form.confirmPassword.$errors"
                >
                  <StInput
                    @keyup.enter="handleSubmit"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="form.confirmPassword.$value"
                    placeholder="Please re-enter the password"
                  >
                    <StTooltip
                      class="tooltip"
                      :tooltip="
                        !showConfirmPassword ? 'Show Password' : 'Hide Password'
                      "
                    >
                      <SvgIcon
                        name="icon-eye-opened"
                        v-if="!showConfirmPassword"
                        @click="showConfirmPassword = true"
                      />

                      <SvgIcon
                        name="icon-eye-closed"
                        v-else
                        @click="showConfirmPassword = false"
                      />
                    </StTooltip>
                  </StInput>
                </StFormItem>
              </div>
              <StButton @click="handleSubmit">Proceed</StButton>
            </div>

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
                  @keyup.enter="handleSubmit"
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
                <SvgIcon name="icon-words-security" />
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
                <SvgIcon name="icon-words-security" />
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
                <div class="mnemonic-list mnemonic-list--words">
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
            <SvgIcon name="icon-arrow-left" />
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
            <SvgIcon name="icon-arrow-right-primary" />
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
                :class="{
                  'st-form-item__error':
                    recoveryForm.account.$value.length > 50,
                }"
                label="Account Name"
                :filled="recoveryForm.account.$value"
                :error-message="recoveryForm.account.$errors"
                @keyup.enter="recoveryStepNext"
              >
                <StInput
                  id="account-name"
                  v-model="recoveryForm.account.$value"
                  placeholder="Enter Account Name"
                />
                <template
                  v-if="recoveryForm.account.$value.length > 50"
                  #description
                >
                  <span class="error">Name too long</span>
                </template>
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
              <div class="mnemonic-list mnemonic-list--words">
                <template v-if="selectedRecoveryWords.length">
                  <span
                    v-for="(word, index) in selectedRecoveryWords"
                    :key="word"
                    >{{ word }}
                    <div
                      v-if="index + 1 === selectedRecoveryWords.length"
                      @click="removeSelectedWord(word)"
                    >
                      <SvgIcon name="icon-close-black" />
                    </div>
                  </span>
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
                @keydown.tab.prevent="selectTabWord(searchWordlist)"
              >
                <div @click="recoveryWord = ''" class="clear-icon">
                  <SvgIcon name="icon-close-primary" />
                </div>
                <div
                  @click="selectRecoveryPhraseWord(recoveryWord)"
                  class="check-icon"
                >
                  <SvgIcon name="icon-checkmark" />
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
            <StButton v-else @click="goBack">Try Again</StButton>
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
                  placeholder="Please enter a password"
                  @keyup.enter="recover"
                  @input="form.password.$onBlur()"
                >
                  <StTooltip
                    class="tooltip"
                    :tooltip="!showPassword ? 'Show Password' : 'Hide Password'"
                  >
                    <SvgIcon
                      name="icon-eye-opened"
                      v-if="!showPassword"
                      @click="showPassword = true"
                    />

                    <SvgIcon
                      name="icon-eye-closed"
                      v-else
                      @click="showPassword = false"
                    />
                  </StTooltip>
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
                  placeholder="Please re-enter the password"
                  @keyup.enter="recover"
                >
                  <StTooltip
                    class="tooltip"
                    :tooltip="
                      !showConfirmPassword ? 'Show Password' : 'Hide Password'
                    "
                  >
                    <SvgIcon
                      name="icon-eye-opened"
                      v-if="!showConfirmPassword"
                      @click="showConfirmPassword = true"
                    />

                    <SvgIcon
                      name="icon-eye-closed"
                      v-else
                      @click="showConfirmPassword = false"
                    />
                  </StTooltip>
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
/* import Lottie from 'vue-lottie/src/lottie.vue'; */
/* import * as animationData from '@/assets/animation/logo.json'; */
import pkgjson from '@/../package.json';
import zxcvbn from 'zxcvbn';
import SvgIcon from '../components/partials/SvgIcon.vue';

export default {
  name: 'StWelcome',
  components: {
    /* PaymentCode, */
    StProgress,
    /* Lottie, */
    SvgIcon,
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
    /* const animation = ref(null); // for saving the reference to the animation */
    const isLoading = ref(false);
    const isVideoLoaded = ref(false);
    const isAccountFinished = ref(false);
    /* const lottieOptions = ref({
      animationData: animationData.default,
      render: 'svg',
      loop: false,
      autoplay: true,
    }); */
    const isAnimationFinished = ref(false);
    const version = ref(pkgjson.version);

    const { form, errors, submitting, validateFields, resetFields } =
      useValidation({
        password: {
          $value: password,
          $rules: [
            {
              rule: () => {
                let details = zxcvbn(password.value);
                if (details.feedback.warning.length) {
                  if (details.feedback.warning.includes('Repeats like')) {
                    return 'Repeats like "aaa" or "abcabc" are easy to guess';
                  }
                  return details.feedback.warning;
                }
                if (details.feedback.suggestions.length) {
                  if (
                    'Add another word or two. Uncommon words are better.' ===
                    details.feedback.suggestions[0]
                  ) {
                    // replace with
                    return 'Use a longer keyboard pattern with more turns.';
                  }
                  return details.feedback.suggestions[0];
                } else {
                  if (details.score < 3) {
                    return 'Use a longer keyboard pattern with more turns.';
                  } else {
                    return true;
                  }
                }
              },
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
              },
            },
            {
              rule: () => {
                if (currentStep.value === 6) {
                  return account.value.length > 50 && 'Name too long';
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
            },
          },
          {
            rule: () => {
              return account.value.length > 50 && 'Name too long';
            },
          },
        ],
      },
    });

    watchEffect(async () => {
      if (
        (isAccount.value && currentStep.value === 0) ||
        (isRecovery.value && recoveryStep.value === 0)
      ) {
        let video = document.getElementById('bgAnimation');
        video.loop = true;
        video.load();
      }
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
      let video = document.getElementById('bgAnimation');
      video.addEventListener('loadeddata', () => {
        isVideoLoaded.value = true;
        setTimeout(() => {
          isAnimationFinished.value = true;
        }, 3180);
      });
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
      // recover an existing wallet via mnemonic
      // password is asked because we have to lock the seed in the database
      // user is createing a new password in this step
      try {
        await validateFields();
        const wait = (timeToDelay) =>
          new Promise((resolve) => setTimeout(resolve, timeToDelay));
        isRecovery.value = false;
        isAccount.value = false;
        isAccountFinished.value = true;
        let video = document.getElementById('bgAnimation');
        video.loop = false;
        video.load();
        video.play();
        await wait(350);
        isLoading.value = true;
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
        await wait(1000);
        isLoading.value = false;
        CryptoService.unlock(password.value);
        window.ipc.send('resize:other');
        // goToDashboard();
        resetFields();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e.message);
        }
      }
    }

    async function restoreAccounts() {
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
        accUtxo = format(accUtxo, { precision: 14 });
      }

      let acc = {
        xpub: xpub,
        address: address,
        label:
          `${account.value} ${next > 0 ? next + 1 : ''}` ||
          `Account ${next > 0 ? next + 1 : ''}`,
        utxo: accUtxo,
        isArchived: false,
        isFavourite: false,
        isImported: false,
        asset: 'XST',
        wif: wif,
        path: path,
      };

      await CryptoService.storeAccountInDb(acc);
    }
    const createWallet = ref(false);
    async function createNewWallet() {
      // new wallet is created
      // therefore, new password can be made
      await CryptoService.storeWalletInDb(password.value);
      await CryptoService.storeMnemonicInWallet(selectedWords.value);
      await restoreAccounts();
      isAccount.value = false;
      isAccountFinished.value = true;
      let video = document.getElementById('bgAnimation');
      video.loop = false;
      video.load();
      video.play();
      setTimeout(() => {
        isLoading.value = true;
        setTimeout(() => {
          isLoading.value = false;
          window.ipc.send('resize:other');
          goToDashboard();
        }, 4000);
      }, 350);
      /* mainStore.START_GLOBAL_LOADING();

      await CryptoService.storeWalletInDb(password.value);
      await CryptoService.storeMnemonicInWallet(selectedWords.value);

      await restoreAccounts();
      goToDashboard();

      mainStore.STOP_GLOBAL_LOADING(); */
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

    function selectTabWord(words) {
      let selectedWord = words && words[0];
      if (words && words.length) selectRecoveryPhraseWord(selectedWord);
    }

    /* function handleAnimation(anim) {
      animation.value = anim;
    } */

    function goToDashboard() {
      router.push('/dashboard');
    }
    return {
      isWelcome,
      isAccount,
      isAccountFinished,
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
      /* lottieOptions,
       */
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
      /* handleAnimation, */
      isAnimationFinished,
      isVideoLoaded,

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
      selectTabWord,

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
.welcome-logo {
  margin-top: 60px;
  margin-bottom: 59px;
  min-height: 40px;
}
.logo {
  min-height: 158px;
  max-width: 197px;
  margin: -2px 0 0;
}
.left video {
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
.xst-loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
.xst-loader img {
  height: 28px;
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
.right__inner-top:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.right__inner-top::-webkit-scrollbar-thumb {
  background: transparent;
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
.pagination-prev :deep svg path,
.pagination-next :deep svg path {
  transition: 0.3s;
}
.pagination-prev:hover :deep svg path,
.pagination-next:hover :deep svg path {
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
.mnemonic-list--words {
  min-height: 64px;
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
:deep .st-form-item .st-form-item__error,
.error {
  position: absolute;
  left: 0;
  right: 0;
  text-align: left;
}
</style>
