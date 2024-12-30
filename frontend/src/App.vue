<template>
  <div id="app">
    <nav>
      <router-link to="/" exact>Home</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>

  <router-view/>
  </div>
</template>

<style>


#app {
  font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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
