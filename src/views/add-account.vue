<template>
    <div class="add-account-container">
        Add account
    </div>
</template>

<script>
import { onMounted } from 'vue'
import bitcoin from 'bitcoinjs-lib';
export default {
    name: 'StAddAccount',
    setup () {

        onMounted(() => {
            let bla = bitcoin.ECPair.makeRandom()
            console.log('ha', bla);
            // const mnemonic = bip39.generateMnemonic();
            // console.log('mn', mnemonic);

        })
        return {

        }
    }
}
</script>

<style lang="postcss" scoped>

</style>