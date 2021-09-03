# Stealth Desktop

Stealth desktop App for MacOs, Linux and Windows.
* Jira board: https://jira.barrage.net/projects/XSTDESKTOP
* Slack channel: https://wearebarrage.slack.com/archives/G01KQNE67PV
* Postman Workspace: https://barrage-team.postman.co/workspace/Stealth~d7086fad-cb9c-4467-a6f2-37514d478f79

Main technologies:
* Vue (3.0.x)
* Electron (11.2.x)
* Vite (2.0.x beta)
* PostCSS (8.2.x) 

### Prerequisites

```
└─ $ ▶ node -v
v12.18.2
```
```
└─ $ ▶ npm -v
6.14.5 
```

### Initial configuration for running and developing

After cloning the repo from our git, do the following steps:

```bash
# we have a separate repo (stealth-kit) for our reusable custom components, that lives on our nexus, so you have to do the following:
# download cert from https://bipa1.barrage.net/ipa/config/ca.crt
export NODE_EXTRA_CA_CERTS="path/to/cert/file"
npm config set registry https://nexus.barrage.net/repository/npm.barrage.net/ --global
# username&pass are bipa credentials (possibly you'll have to trigger it with `npm adduser`)
# email is your work email
npm config set registry https://nexus.barrage.net/repository/npm.barrage.net/
```

After configuring your local machine to point on our nexus, you can do the following:

Example:
```shell
cd stealth-desktop-app
npm i
npm run dev
```

### Building

```
npm run electron:build --linux
```

### Deploying / Publishing

Artifacts for all platforms are created automatically on develop and all feature branches.

### Captain's log
* buffer has to stay on version 5.7.x (do not upgrade to 6.x.x) because transactions would need refactoring.
* bitcoinjs-lib has to stay on 5.2.x because TransactionBuilder will later be deprecated
* eslint has to stay on 6.7.x because it messes up the linux build process

### Contributing

* use GitFlow because it is suitable for handling multiple versions of the same project
* reference Jira task in the commit message (e.g. "XSTDESKTOP-123 implement login")

### Links

* Jira board: https://jira.barrage.net/projects/XSTDESKTOP
* Slack channel: https://wearebarrage.slack.com/archives/G01KQNE67PV
* GitFlow: https://nvie.com/posts/a-successful-git-branching-model
* bitcoinjs-lib examples: https://github.com/bitcoinjs/bitcoinjs-lib#examples
