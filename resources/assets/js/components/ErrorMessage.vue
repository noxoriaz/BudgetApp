
<template>
    <div class="invalid-feedback">
        {{ errorMessage }}
    </div>
</template>
<style>
    .invalid-feedback {
        display: block;
    }
</style>
<script>
export default {
    props: ['validations'],
    data () {
        return {
            message: 'test',
        }
    },
    computed: {
        errorMessage () {
            if (this.validations.minLength === false) {
                return `Must have at least ${this.validations.$params.minLength.min} letters` 
            }
            if (this.validations.maxLength === false) {
                return `Must have less than ${this.validations.$params.maxLength.max} letters` 
            }
            if (this.validations.required === false) {
                return 'Field is required' 
            }
            return 'Field is invalid'
        },
    },
}
</script>