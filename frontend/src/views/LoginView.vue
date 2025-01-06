<template>
    <navbar-form/>
    <login-form />
</template>

<style></style>

<script>
import LoginForm from "../components/LoginForm.vue";
import NavbarForm from "@/components/NavbarForm.vue";
export default {
    name: "LoginView",
    components: { LoginForm, NavbarForm },
};
</script>