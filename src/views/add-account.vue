<template>
    <div class="add-account-container">
        Add account
    </div>
</template>

<script>
import { onMounted } from 'vue'
import CryptoService from '../services/crypto';

export default {
    name: 'StAddAccount',
    setup () {

        onMounted(() => {
            CryptoService.generateMnemonicAndSeed()
            console.log('mnemonic: ', CryptoService.mnemonic);
            console.log('is mnemonic valid: ', CryptoService.isMnemonicValid());
            console.log('random address: ', CryptoService.generateRadnomAddress());

        })
        return {

        }
    }
}
</script>

<style lang="postcss" scoped>

</style>