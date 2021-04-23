<template>
    <div v-if="steps" class="st-switcher">
        <p class="st-switcher__asset"><span class="asset">{{steps[step].asset}}</span> <svg v-if="isHidden" width="22" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" @click="isHidden = !isHidden"><path d="M11 3C7.686 3 4.686 4.667 2 8c2.686 3.333 5.686 5 9 5s6.314-1.667 9-5a17.964 17.964 0 00-1.864-2M6 8h6M19 1L5 15" stroke="#4E00F6" stroke-width="2"/></svg>
 <svg v-if="!isHidden" width="20" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" @click="isHidden = !isHidden"><path d="M8 1.5h4M1 1.5c3 3.333 6 5 9 5s6-1.667 9-5" stroke="#4E00F6" stroke-width="2"/></svg></p>
        <div class="st-switcher__steps">
            <span v-for="(s, index) in steps" :key="index" class="step" :class="{'step--active': step === index}" @click="changeStep(index)"></span>
        </div>
        <p class="st-switcher__amount">
            {{isHidden ? '*****' : steps[step].amount}}
        </p> 
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'StSwitcher',
    props: {
        amount: {
            type: Number,
            required: true,
            default: () => {
                return 0
            }
        }
    },
    setup (props) {
        const step = ref(0)
        const isHidden = ref(false)
        const steps = ref([
            {
                asset: 'XST',
                amount: props.amount
            },
            {
                asset: 'EUR',
                amount: props.amount * 2
            },
            {
                asset: 'BTC',
                amount: props.amount / 8
            }
        ])

        function changeStep(i) {
            step.value = i
        }
        return {
            step,
            steps,
            changeStep,
            isHidden
        }
    }
}
</script>

<style scoped>
.st-switcher {
    width: 220px
}

.st-switcher__asset {
    display: flex;
    justify-content: space-between;
    align-items: center;
font-size: 32px;
line-height: 40px;
letter-spacing: 0.56px;
color: var(--text);
}
.st-switcher__steps {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 16px 0;
}

.step {
    height: 4px;
    width: 40px;
    background-color: var(--grey100);
}

.st-switcher__amount {
    font-size: 28px;
line-height: 36px;
letter-spacing: 0.56px;
color: var(--text);

}

.step--active {
    background-color: var(--marine500);
    width: 100px;
}
</style>