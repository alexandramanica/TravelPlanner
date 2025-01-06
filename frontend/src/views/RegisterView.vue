<template>
    <navbar-form/>
    <register-form />
</template>

<style></style>

<script>
import RegisterForm from "../components/RegisterForm.vue";
import NavbarForm from "../components/NavbarForm.vue";
export default {
    name: "RegisterView",
    components: { RegisterForm, NavbarForm },
};
</script>