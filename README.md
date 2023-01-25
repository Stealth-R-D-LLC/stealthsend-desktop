# Stealth Desktop

Stealth desktop App for MacOs, Linux and Windows.
* Telegram: https://t.me/stealthsend

Main technologies:
* Vue (3.2.0)
* Electron (13.x.x)
* PostCSS (8.2.x) 

### Prerequisites

```
└─ $ ▶ node -v
v12.18.2
```
```
└─ $ ▶ npm -v
7.5.4 
```

### Building

```
npm run electron:build --linux
```

### Deploying / Publishing

Artifacts for all platforms are created automatically on develop and all feature branches.
Pushing to production means that you have to push your code to the outher remote; the main branch of [StealthSend Desktop](https://github.com/Stealth-R-D-LLC/stealthsend-desktop). Before pushing, make sure that: 
* create a new tag 
* you are pointing to the public `npmjs registry`
* generate a new `package-lock.json` file 
* On Github, go to Releases -> Draft a new release -> Attach all binaries -> Publish release`.

### Captain's log
* buffer has to stay on version 5.7.x (do not upgrade to 6.x.x) because transactions would need refactoring.
* bitcoinjs-lib has to stay on 5.2.x because TransactionBuilder will later be deprecated
* eslint has to stay on 6.7.x because it messes up the linux build process

### Contributing

* use GitFlow because it is suitable for handling multiple versions of the same project
* submit a pull request

### Links

* Telegram: https://t.me/stealthsend
* GitFlow: https://nvie.com/posts/a-successful-git-branching-model
* bitcoinjs-lib examples: https://github.com/bitcoinjs/bitcoinjs-lib#examples
