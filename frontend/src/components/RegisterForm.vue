<template>
  <div>
    <div class="login-page d-flex align-items-center">
      <div class="login-container d-flex flex-column flex-md-row">
        <!-- Left Side Image -->
        <div class="login-image d-none d-md-flex position-relative flex-column align-items-center justify-content-center">
          <img :src="require('../assets/registerImage.jpg')" alt="Students" class="image-fluid" />
          <div class="text-content text-center position-absolute">
            <h2 class="title text-white">Join the Journey!</h2>
            <p class="text-white">
              Sign up to explore dream destinations, plan seamless trips, and turn wanderlust into reality.
            </p>
          </div>
          <div class="footer-content d-flex justify-content-between align-items-center position-absolute p-3">
            <span class="text text-white">Already have an account?</span>
            <router-link to="/login">
              <button class="btn btn-light">Login</button>
            </router-link>
          </div>
        </div>

        <!-- Right Side Form -->
        <div class="login-form d-flex flex-column align-items-center justify-content-center">
          <div class="header-content text-center py-3">
            <img :src="require('../assets/registerLogo.png')" alt="Logo" class="logo" />
            <h2 class="title">Sign Up</h2>
          </div>
          <form @submit.prevent="submitRegisterData" class="form-content d-grid gap-3">
            <div class="form-group">
              <label for="email" class="form-label align-left">Email:</label>
              <div class="input-group">
                <span class="input-icon"><i class="bi bi-envelope"></i></span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  v-model="email"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label align-left">Last Name:</label>
              <div class="input-group">
                <span class="input-icon"><i class="bi bi-person"></i></span>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter your last name"
                  v-model="lastName"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="firstName" class="form-label align-left">First Name:</label>
              <div class="input-group">
                <span class="input-icon"><i class="bi bi-person"></i></span>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter your first name"
                  v-model="firstName"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label align-left">Password:</label>
              <div class="input-group">
                <span class="input-icon"><i class="bi bi-lock"></i></span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  v-model="password"
                  class="form-control"
                />
              </div>
            </div>
            <button type="submit" class="btn btn-primary d-flex align-items-center justify-content-center w-100 gap-2">
              <span>Sign Up</span>
              <i class="bi bi-box-arrow-in-right"></i>
            </button>
          </form>
          <span  class="switch-to-register">
            Already have an account? <router-link to="/login" class="link-highlight">Click here</router-link>
          </span>

        </div>
      </div>
    </div>

    <div v-if="showAlert" class="alert alert-danger mt-3 d-flex align-items-center" role="alert">
      <ul class="list-unstyled mb-0">
        <li v-for="(err, index) in error.split(', ')" :key="index" class="d-flex align-items-center">
          <i class="bi bi-exclamation-circle-fill me-2"></i>
          {{ err }}
        </li>
      </ul>
    </div>


  </div>
</template>


<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const error = ref('');
    const showAlert = ref(false);

    const router = useRouter();

    const submitRegisterData = async () => {
      try {
        const response = await axios.post('http://localhost:8001/api/auth/register', {
          email: email.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value,
        });

        console.log('Registration successful:', response.data);

        router.push('/login');
      } catch (err) {
        console.error(err);
        
        // Handle different response structures
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          //errors array
          error.value = err.response.data.errors.map((e) => e.msg).join(', ');
        } else if (err.response.data.message) {
          //single message
          error.value = err.response.data.message;
        } else {
          //unknown error format
          error.value = 'An unknown error occurred. Please try again.';
        }
      } else {
        //no response data
        error.value = 'Unable to connect to the server. Please try again later.';
      }

        showAlert.value = true;


        setTimeout(() => {
          showAlert.value = false;
        }, 5000);
      }
    };

    return {
      email,
      password,
      firstName,
      lastName,
      error,
      showAlert,
      submitRegisterData,
    };
  },
};
</script>


<style scoped>
body {
  background-color: #ffffff;
  margin: 0; 
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: auto;
  background-color: #ffffff;
}

.login-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: auto; 
  max-height: 90vh; 
  width: 60%;
  margin: auto;
  background-color: #f8f8fa;
  border-radius: 10px;
  padding: 15px;
  overflow: hidden; 
}

.login-image {
  position: relative;
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  max-height: 100%; 
}

.image-fluid {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-content {
  position: absolute;
  text-align: center;
}

.text-content .title {
  font-size: 40px;
  font-weight: 800;
}

.footer-content {
  bottom: 10px;
  left: 10px;
  right: 10px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.248);
  backdrop-filter: blur(1px);
  border-radius: 10px;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  height: auto;
  overflow-y: auto; 
}

.header-content {
  text-align: center;
  padding: 1.5rem 0;
}

.header-content .title {
  font-size: 32px;
  font-weight: bold;
}

.header-content img {
  width: 120px;
  padding-bottom: 0.1rem;
}

.form-content {
  gap: 1rem;
}

.form-group {
  margin-bottom: 2px;
}

.form-control {
  border-radius: 4px;
  padding: 10px 40px;
  height: auto;
}

.form-label.align-left {
  text-align: left;
  display: block;
  font-weight: bold;
  margin-bottom: 2px;
  color: #2a0052;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-icon {
  background-color: #f8f9fa;
  border-radius: 4px 0 0 4px;
  padding: 10px;
  display: flex;
  align-items: center;
}

.input-icon i {
  font-size: 1.2rem;
  color: #2a0052;
}

.btn {
  transition: 0.3s ease;
  background-color: #2a0052;
  color: #ffffff;
  border: none;
}

.btn:hover {
  background-color: #bc87e8;
}

.switch-to-register {
  font-size: 15px;
  display: none;
}

.switch-to-register a {
  text-decoration: underline;
  color: #ff8911;
}

.alert {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: #d90429;
  color: #ffffff;
}

@media screen and (max-width: 1300px) {
  .login-container {
    width: 90%;
    height: auto;
    flex-direction: column;
    padding: 1.5rem;
    max-height: none; 
  }

  .login-image {
    display: none;
  }

  .login-form {
    width: 100%;
    padding: 1rem;
    height: auto;
    flex-grow: 1; 
  }

  .switch-to-register {
    display: block;
    text-align: center;
    margin-top: 1rem;
  }
}

@media screen and (max-height: 500px) {
  .login-container {
    flex-direction: column;
    height: 90%;
    height: auto;
  }

  .login-form {
    padding: 1rem;
    overflow-y: auto; 
  }

  .form-content {
    gap: 0.5rem;
  }

  .header-content .title {
    font-size: 28px;
  }

    .switch-to-register {
    display: block;
    text-align: center;
    margin-top: 1rem;
  }

}
</style>



