import router from '@/router';
import { useMainStore } from '@/store';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from '../../bitcoinjs-lib-feeless/src/index.js';
import { Buffer } from 'buffer';
import cryptoJs from 'crypto-js';
import { add, format } from 'mathjs';
import db from '../db';
import useHelpers from '@/composables/useHelpers';
const { fil } = useHelpers();

let networkConfig = {
  messagePrefix: 'unused',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

if (process.env.VUE_APP_NETWORK === 'mainnet') {
  networkConfig = {
    messagePrefix: 'unused',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3e,
    scriptHash: 0x85,
    wif: 0xbe,
  };
}

const CryptoService = {
  constraints: {
    XST_USD: 0.199,
    XST_BTC: 0.00000364,
    changePercent24Hr: 0,
    MINIMAL_CHANGE: 0.01,
    MINIMUM_XST_FOR_SEND: 0.05,
  },
  isFirstArrival: true,
  network: networkConfig,
  master: null,
  seed: null,
  txWithLabels: {},

  async init() {
    // check if there's already a wallet stored in the db
    // if so, ask for password via lock screen and
    // retrieve the stored wallet and generate the master from the stored seed
    let wallet = await this.getWalletFromDb();
    this.getTxWithLabels();
    await this.getAccounts();
    if (!wallet || wallet.length <= 0) {
      router.push('/welcome');
    } else if (this.isFirstArrival) {
      router.push('/lock');
      this.isFirstArrival = false;
    }
  },
  async unlock(password) {
    // no need to validate password because it is validated before calling this method
    // const isPasswordValid = await this.validatePassword(password) // compare user prompted password with stored
    // get password hash so that we can decrypt everything
    let { hash } = await this.hashPassword(password);
    let wallet = await this.getWalletFromDb();
    // seed is stored in a string format because it's the easies to store
    // when retrieving, we need to have the seed in buffer type so we can work with it
    // that's why we are converting the seed from string -> uint8array -> buffer
    // master key
    try {
      this.master = await bip32.fromSeed(
        Buffer.from(
          this.hexToArray(
            this.AESDecrypt(wallet.seed, hash).toString(cryptoJs.enc.Utf8)
          )
        ),
        this.network
      );
    } catch (e) {
      console.log(e);
      router.push('/lock');
    }
    router.push('/dashboard');
  },
  WIFtoPK(wif) {
    const keyPair = bitcoin.ECPair.fromWIF(wif, this.network);
    return keyPair;
  },
  isWIFValid(WIF) {
    try {
      bitcoin.ECPair.fromWIF(WIF, this.network);
      return true;
    } catch (err) {
      return false;
    }
  },
  hexToArray(hexString) {
    // convert hex string to uint8array
    // helper for seed
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  },
  async generateMnemonicAndSeed(wordsLength = 12) {
    let strength = (wordsLength / 3) * 32;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
      // Everything else in the HD wallet is deterministically derived from this root seed,
      // which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
      const mnemonic = await bip39.generateMnemonic(strength);
      const seed = await bip39.mnemonicToSeedSync(mnemonic); // recovery seed of the master bip32 seed.?
      const master = await bip32.fromSeed(seed, this.network); // aka. root
      this.master = master;
      this.seed = seed;
      resolve({
        mnemonic,
        master,
      });
    });
  },
  breakAccountPath(path = "0'/0/0") {
    path = path.replace("'", '');
    const account = +path.split('/')[0];
    const change = +path.split('/')[1];
    const address = +path.split('/')[2];
    return {
      account,
      change,
      address,
    };
  },
  getKeysForAccount(account = 0, change = 0, address = 0) {
    if (!this.master) {
      return {
        xpub: '',
        publicKey: '',
        secretKey: '',
      };
    }
    const keypair = this.master.derivePath(
      `m/44'/${
        process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
      }'/${account}'/${change}/${address}`
    );
    let acc = this.master.derivePath(
      `m/44'/${
        process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
      }'/${account}'`
    );

    return {
      xpub: String(acc.neutered().toBase58()),
      publicKey: keypair.publicKey.toString('hex'),
      secretKey: keypair.toWIF(),
    };
  },
  getChildFromRoot(account, change, address) {
    // With non-hardened keys, you can prove a child public key is linked to a parent public key
    // using just the public keys.
    // You can also derive public child keys from a public parent key,
    // which enables watch-only wallets.
    // With hardened child keys, you cannot prove that a child public key is linked to a parent public key.
    const keypair = this.master.derivePath(
      `m/44'/${
        process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
      }'/${account}'/${change}/${address}`
    );
    let acc = this.master.derivePath(
      `m/44'/${
        process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
      }'/${account}'`
    );
    return {
      address: bitcoin.payments.p2pkh({
        pubkey: keypair.publicKey,
        network: this.network,
      }).address,
      keyPair: keypair,
      xpub: String(acc.neutered().toBase58()),
      wif: keypair.toWIF(),
      // sk: child.privateKey,
      path: `${account}'/${change}/${address}`,
    };
  },
  isMnemonicValid(mnemonic) {
    const isValid = bip39.validateMnemonic(mnemonic);
    return isValid;
  },
  async getWalletFromDb() {
    return await db.getItem('wallet');
  },
  async getAccounts() {
    let accounts = (await db.getItem('accounts')) || [];
    return accounts;
  },
  async storeTxAndLabel(txid, label) {
    let tx = (await db.getItem('transactions')) || {};
    if (tx.length === 0) {
      // first tx in the db
      await db.setItem('transactions', {
        [txid]: label,
      });
    }
    // already have txs, update them with the new tx
    tx = { ...tx, [txid]: label };

    await db.setItem('transactions', tx);

    this.getTxWithLabels();
    return {
      txid,
      label,
    };
  },
  async getTxWithLabels() {
    // transactions with labels are stored in the local db
    // because we dont have any other way to remember labels for particular transactions
    // so we have to fetch them from the db
    const txWithLabels = (await db.getItem('transactions')) || {};
    const mainStore = useMainStore();
    mainStore.SET_TX_WITH_LABELS(txWithLabels);
  },
  async storeAccountInDb(account) {
    let dbAccounts = (await db.getItem('accounts')) || [];
    dbAccounts.push({
      address: account.address,
      label: account.label,
      isArchived: account.isArchived,
      isFavourite: account.isFavourite,
      isImported: account.isImported,
      utxo: account.utxo,
      path: account.path,
      xpub: account.xpub,
      asset: account.asset,
      favouritePosition: account.favouritePosition,
    });

    return db.setItem('accounts', dbAccounts);
  },
  async archiveAccount(account) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      console.error('Accounts do not exist');
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );

    // if (accounts[wantedIndex].utxo > 0) {
    //   console.error('Cannot archive account with balance > 0');
    //   return this.scanWallet();
    // }

    accounts[wantedIndex].isArchived = true;
    // archived accounts are removed from the favourite list
    accounts[wantedIndex].isFavourite = false;
    accounts[wantedIndex].favouritePosition = null;

    await db.setItem('accounts', accounts);
  },

  async favouriteAccount(account) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      console.error('Accounts do not exist');
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );

    let countFavourites = fil((el) => el.favouritePosition, accounts);

    accounts[wantedIndex].isFavourite = true;
    accounts[wantedIndex].favouritePosition = countFavourites.length + 1;
    await db.setItem('accounts', accounts);
  },

  async unfavouriteAccount(account) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      console.error('Accounts do not exist');
      return this.scanWallet();
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );

    accounts[wantedIndex].isFavourite = false;
    accounts[wantedIndex].favouritePosition = null;

    // lower favourite position for remaining accounts
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].favouritePosition > account.favouritePosition) {
        // lower position only for accounts that were beneath the removed account
        accounts[i].favouritePosition = accounts[i].favouritePosition - 1;
      }
    }

    await db.setItem('accounts', accounts);
  },

  async activateAccount(account) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );
    accounts[wantedIndex].isArchived = false;

    await db.setItem('accounts', accounts);
  },

  async changeAccountName(account, accountName) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );
    accounts[wantedIndex].label = accountName;

    await db.setItem('accounts', accounts);
  },

  async changeAccountFavouritePosition(account, position = null) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );
    accounts[wantedIndex]['favouritePosition'] = position;

    await db.setItem('accounts', accounts);
  },

  async addToAddressBook(addressBookItem) {
    let addressBook = (await db.getItem('addresses')) || [];

    // find largest ID of saved contacts amd add it to saving object
    let largestExistingId = 0;
    if (addressBook.length > 0) {
      largestExistingId = addressBook.reduce((a, b) =>
        a.id > b.id ? a : b
      ).id;
    }
    addressBookItem.id = largestExistingId + 1;

    addressBook.push(JSON.parse(JSON.stringify(addressBookItem)));
    await db.setItem('addresses', addressBook);

    return addressBook;
  },

  async deleteFromAddressBook(addressBookItem) {
    let addressBook = (await db.getItem('addresses')) || [];

    const wantedIndex = addressBook.findIndex(
      (item) => item.id === addressBookItem.id
    );

    addressBook.splice(wantedIndex, 1);
    await db.setItem('addresses', JSON.parse(JSON.stringify(addressBook)));

    return addressBook;
  },

  async updateAddressBook(addressBookItem) {
    let addressBook = (await db.getItem('addresses')) || [];
    const wantedIndex = addressBook.findIndex(
      (item) => item.id === addressBookItem.id
    );

    addressBook[wantedIndex] = addressBookItem;
    await db.setItem('addresses', JSON.parse(JSON.stringify(addressBook)));

    return addressBook;
  },

  async getAddressBook() {
    return (await db.getItem('addresses')) || [];
  },

  async validatePassword(password) {
    // receive password as plain text, hash it, compare it with existing hash in db
    let wallet = await this.getWalletFromDb();
    let { hash } = await this.hashPassword(password);
    return hash === wallet.password;
  },
  async hashPassword(password) {
    let wallet = await this.getWalletFromDb();
    let salt = null;
    if (wallet && wallet.salt) {
      salt = wallet.salt;
    } else {
      salt = cryptoJs.lib.WordArray.random(128 / 8);
    }
    const hash = cryptoJs.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000,
    });
    return {
      salt: salt,
      hash: hash.toString(cryptoJs.enc.Hex),
    };
  },
  async storeWalletInDb(password) {
    let { hash, salt } = await this.hashPassword(password);

    // user security is ultimately dependent on a password,
    // and because a password usually can't be used directly as a cryptographic key,
    // some processing is required
    // hash the password and store it in the db. PBKDF2 is a one-way hashing algorithm
    // we'll use the hash to encrypt sensitive data like the seed;
    // encrypt the seed with the hashed password
    // to decrypt the seed, we need to ask the user for his password and then hash it again.
    // if the resulted hash is the same as the hashed password,
    // then the user entered the correct password and the seed can be decrypted
    const encryptedSeed = this.AESEncrypt(this.seed.toString('hex'), hash);
    const wallet = {
      name: 'wallet',
      archived: false,
      seed: encryptedSeed,
      password: hash.toString(cryptoJs.enc.Hex),
      salt: salt,
    };

    await db.setItem('wallet', wallet);

    return wallet;
  },

  async storeMnemonicInWallet(mnemonic) {
    let wallet = await CryptoService.getWalletFromDb();

    if (!wallet.password) {
      return;
    }

    wallet.mnemonic = CryptoService.AESEncrypt(mnemonic, wallet.password);
    await db.setItem('wallet', wallet);

    return wallet;
  },
  async accountDiscovery(n = 0, change = 0) {
    const mainStore = useMainStore();
    //  Address gap limit is currently set  to 20. If the software hits 20 unused addresses in a row,
    // it expects there are no used addresses beyond this point and stops searching the address chain.
    // We scan just the external chains, because internal chains receive only coins that come from the associated external chains.
    const GAP_LIMIT = 20;

    let emptyInARow = 0;
    let freeAddresses = [];
    for (let i = 0; i < Infinity; i++) {
      // derive the first account's node (index = 0)
      // derive the external chain node of this account
      const acc = this.getChildFromRoot(n, change, i);
      // scan addresses of the external chain; respect the gap limit described below
      const outputs = await mainStore.rpc('getaddressoutputs', [
        acc.address,
        1,
        1,
      ]);
      if (outputs.length > 0) {
        // if there are some transactions, increase the account index and go to step 1
        emptyInARow = 0;
        continue;
      }
      // if there are no transactions, increment counter and go to next address
      emptyInARow += 1;
      freeAddresses.push(acc.path);

      // If the software hits 20 unused addresses in a row, it expects there are no used addresses beyond this point and stops searching the address chain
      if (emptyInARow >= GAP_LIMIT) break;
    }
    // Return free account addresses to the calling code
    return {
      freeAddresses,
    };
  },

  async findLastUsedAccountPath() {
    const mainStore = useMainStore();

    let emptyInARow = 0;
    let lastAccountPath = '';
    for (let i = 0; i < Infinity; i++) {
      const acc = this.getChildFromRoot(i, 0, 0);
      const hdAccount = await mainStore.rpc('gethdaccount', [acc.xpub]);

      if (hdAccount.length > 0) {
        lastAccountPath = acc.path;
        emptyInARow = 0;
        continue;
      }

      emptyInARow += 1;
      if (emptyInARow >= 20) break;
    }
    return parseInt(lastAccountPath);
  },

  isAddressValid(address) {
    try {
      const { version } = bitcoin.address.fromBase58Check(address);
      return version === 62;
      // const isMainnet = process.env.VUE_APP_NETWORK === 'mainnet';
      // // https://en.bitcoin.it/wiki/Base58Check_encoding
      // if (isMainnet && version === 62) {
      //   // 62 is for mainnet
      //   return true;
      // } else if (!isMainnet && version === 111) {
      //   // 111 is for testnet
      //   return true;
      // } else {
      //   return false;
      // }
    } catch (e) {
      return false;
    }
  },

  AESEncrypt(payload, key = '123456789') {
    let encJson = cryptoJs.AES.encrypt(JSON.stringify(payload), key).toString();
    let encData = cryptoJs.enc.Base64.stringify(
      cryptoJs.enc.Utf8.parse(encJson)
    );
    return encData;
  },
  AESDecrypt(payload, key = '123456789') {
    let decData = cryptoJs.enc.Base64.parse(payload).toString(
      cryptoJs.enc.Utf8
    );
    let bytes = cryptoJs.AES.decrypt(decData, key).toString(cryptoJs.enc.Utf8);
    return JSON.parse(bytes);
  },
  async scanWallet(targetAccount = null, skipArchived = true) {
    // extend function with targetAccount argument in case you want to refresh the state of a particular account (XST-801)
    const mainStore = useMainStore();
    // initially scan all accounts in the wallet for utxos
    // gethdaccounts retrieves all transactions for a particular account
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const accounts = await this.getAccounts();
      let balance = 0;
      let txs = [];
      let newAccounts = [];
      console.log('accounts', accounts);
      for (let account of accounts) {
        if (targetAccount && account.address !== targetAccount.address)
          continue; // in case a target account is passed, run the scan only for that account
        let accUtxo = 0;
        let allTransactions = [];
        if (account.isImported && account.wif) {
          await mainStore
            .rpc('getaddresstxspg', [account.address, 1, 99999])
            .then((res) => {
              const txs = res.data;
              if (!account.isArchived) {
                for (const tx of txs) {
                  if (tx.amount === 0) continue;
                  allTransactions.push({
                    account: account.label,
                    amount: tx.txinfo.destinations[0].amount,
                    account_balance_change: tx.txinfo.destinations[0].amount,
                    blocktime: tx.txinfo.blocktime,
                    txinfo: tx.txinfo,
                    outputs: tx.address_outputs,
                    inputs: tx.address_inputs,
                    txid: tx.txid,
                  });
                  accUtxo = tx.balance;
                }
              }

                newAccounts.push({
                  ...account,
                  utxo: Number(accUtxo),
                });
            });
        } else {
          await mainStore
            .rpc('gethdaccount', [account.xpub])
            .then((hdAccount) => {
              for (let tx of hdAccount) {
                accUtxo = add(accUtxo, tx.account_balance_change);
                accUtxo = format(accUtxo, { precision: 14 });

                let outputAddresses = tx.outputs.map(
                  (output) => output.address
                );
                let indexOfDestination;
                if (tx.account_balance_change < 0) {
                  indexOfDestination = tx.txinfo.destinations.findIndex(
                    (dest) => outputAddresses.indexOf(dest.addresses[0]) === -1
                  );
                } else {
                  indexOfDestination = tx.txinfo.destinations.findIndex(
                    (dest) => dest.amount === tx.account_balance_change
                  );
                }
                if (indexOfDestination === -1) {
                  indexOfDestination = 0;
                }
                if (!account.isArchived) {
                  allTransactions.push({
                    ...tx,
                    output: [tx.txinfo.destinations[indexOfDestination]],
                    amount: tx.account_balance_change,
                    blocktime: tx.txinfo.blocktime,
                    account: account.label,
                  });
                }
              }
            });

          newAccounts.push({
            ...account,
            utxo: Number(accUtxo),
          });
        }
        txs.push(...allTransactions);
        // When a user looks at their wallet, the software aggregates the sum of value of all their
        // UTXOs and presents it to them as their "balance".
        // Bitcoin doesn’t know balances associated with an account or username as they appear in banking.
        if (!account.isArchived) {
          // do not include archived accounts into calculating the whole balance of the wallet XST-167
          balance = add(balance, accUtxo);
          balance = format(balance, { precision: 14 });
        }
      }
      if (!targetAccount) await db.setItem('accounts', newAccounts);

      // certain props can be removed to reduce the object size
      function removeProps(obj) {
        const keysForDelete = [
          'blockhash',
          'height',
          'prev_txid',
          'prev_vout',
          'vtx',
          'vin',
          'locktime',
          'time',
          'version',
          'scriptSig',
          'sequence',
          'asm',
          'reqSigs',
        ];
        if (Array.isArray(obj)) {
          obj.forEach(function (item) {
            removeProps(item, keysForDelete);
          });
        } else if (typeof obj === 'object' && obj != null) {
          Object.getOwnPropertyNames(obj).forEach(function (key) {
            if (keysForDelete.indexOf(key) !== -1) delete obj[key];
            else removeProps(obj[key], keysForDelete);
          });
        }
        return obj;
      }

      let reducedTxs = [];
      for (const tx of txs) {
        let result = JSON.parse(JSON.stringify(removeProps(tx), null, 4));
        reducedTxs.push(result);
      }

      if (!targetAccount) {
        // do not store in store in case we are searching only for one account
        mainStore.SET_WALLET({
          utxo: Number(balance), // sum of all utxo (except archived accounts)
          txs: reducedTxs, // all transactions,
          accounts: skipArchived
            ? newAccounts.filter((el) => !el.isArchived)
            : newAccounts,
        });
      }
      resolve({
        utxo: Number(balance), // sum of all utxo (except archived accounts)
        txs: reducedTxs, // all transactions,
        accounts: newAccounts,
      });
    });
  },
  nextToUse(freeAddresses) {
    for (let i = 0; i < freeAddresses.length; i++) {
      if (
        parseInt(freeAddresses[i + 1].split('/')[2]) -
          parseInt(freeAddresses[i].split('/')[2]) ===
        1
      ) {
        if (i === 0) {
          return freeAddresses[i];
        } else {
          return freeAddresses[i - 1];
        }
      }
    }
  },
  getHdAccount(accountExtendedPk) {
    const mainStore = useMainStore();
    return mainStore.rpc('gethdaccount', [accountExtendedPk]);
  },

  async getNextAccountPath() {
    let accounts = await this.getAccounts();
    let largest = -1;
    for (let acc of accounts) {
      if (acc.path && parseInt(acc.path) > largest) {
        largest = parseInt(acc.path);
      }
    }
    return largest + 1;
  },

  async importAccount(accountName, accountPrivateKey) {
    const keypair = bitcoin.ECPair.fromWIF(accountPrivateKey, this.network);

    const payment = bitcoin.payments.p2pkh({
      pubkey: keypair.publicKey,
      network: this.network,
    });

    const address = payment.address;
    const mainStore = useMainStore();

    let balance = 0;

    try {
      balance = await mainStore.rpc('getaddressbalance', [address]);
    } catch (error) {
      console.log(
        'Cannot find address, probably no transactions, continuing anyways'
      );
    }

    let accounts = await this.getAccounts();
    let wallet = await this.getWalletFromDb();
    const foundAccount = accounts.some((account) => {
      return account.address === address;
    });
    if (foundAccount) return foundAccount;

    const encryptedWIF = await CryptoService.AESEncrypt(
      accountPrivateKey,
      wallet.password
    );

    accounts.push({
      address,
      label: accountName,
      isArchived: false,
      isFavourite: false,
      isImported: true,
      utxo: balance,
      asset: 'XST',
      wif: encryptedWIF,
      favouritePosition: null,
      publicKey: keypair.publicKey.toString('hex'),
    });

    await db.setItem('accounts', accounts);

    return accounts;
  },
  sumOf(x = 0, y = 0) {
    let sum = add(x, y);
    sum = format(sum, { precision: 14 });
    return Number(sum);
  },

  processImportedTxs(transactions) {
    let self = this;
    let helper = {};

    return transactions.reduce((r, o) => {
      let key = o.blocktime + '-' + o.txid;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o);

        r.push(helper[key]);
      } else {
        helper[key].amount = self.sumOf(helper[key].amount, o.amount);
      }

      return r;
    }, []);
  },
};

export default CryptoService;
