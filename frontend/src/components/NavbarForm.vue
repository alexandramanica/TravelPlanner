<template>
    <div id="navbar-form">
      <nav>
        <router-link to="/" exact>Home</router-link> |
        <router-link to="/register">Register</router-link> |
        <router-link to="/login">Login</router-link>
      </nav>
  
    <router-view/>
    </div>
  </template>

<style>

nav {
  padding: 25px;
  
}

nav a {
  font-weight: bold;
  text-decoration: none;
  color: #2a0052;
}

nav a.router-link-exact-active {
  color: #bc87e8;
}
</style>