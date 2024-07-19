<template>
  <div class="auth-container">
    <h2>{{ formTitle }}</h2>

    <!-- Кнопки выбора операции -->
    <div class="operation-buttons">
      <button @click="setLoginMode">Авторизация</button>
      <button @click="setRegisterMode">Регистрация</button>
    </div>

    <form v-if="!isRegisterMode" @submit.prevent="submitForm" class="auth-form">
      <div class="form-field">
        <label>Имя пользователя:</label>
        <input type="text" v-model="username">
      </div>
      <div class="form-field">
        <label>Пароль:</label>
        <input type="password" v-model="password">
      </div>
      <button type="submit">{{ submitButtonText }}</button>
    </form>

    <form v-if="isRegisterMode" @submit.prevent="submitForm" class="auth-form">
      <div class="form-field">
        <label>Имя пользователя:</label>
        <input type="text" v-model="username">
      </div>
      <div class="form-field">
        <label>Пароль:</label>
        <input type="password" v-model="password">
      </div>
      <div class="form-field">
        <label>Подтвердите пароль:</label>
        <input type="password" v-model="confirmPassword">
      </div>
      <button type="submit">{{ submitButtonText }}</button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from '@/api/axios'; 

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isRegisterMode: false, // Флаг для определения режима (авторизация или регистрация)
    };
  },
  computed: {
    formTitle() {
      return this.isRegisterMode ? 'Регистрация' : 'Авторизация';
    },
    submitButtonText() {
      return this.isRegisterMode ? 'Зарегистрироваться' : 'Войти';
    }
  },
  methods: {
    async submitForm() {
      try {
        const url = this.isRegisterMode ? '/register' : '/login';
        const data = {
          username: this.username,
          password: this.password
        };

        if (this.isRegisterMode) {
          data.confirmPassword = this.confirmPassword;
        }

        console.log('Отправка данных:', data);

        const response = await axios.post(url, data);
        console.log('Ответ сервера:', response.data);

        if (response.status === 200) {
          localStorage.setItem('token', response.data.token); // Сохранение токена в localStorage
          this.$router.push('/quiz'); // Переход на страницу QuizComponent
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errorMessage = error.response.data.message || 'Неправильное имя пользователя или пароль';
        } else {
          this.errorMessage = 'Ошибка при отправке формы';
        }
        console.error('Ошибка отправки формы:', error);
      }
    },
    setLoginMode() {
      this.isRegisterMode = false;
      this.errorMessage = '';
    },
    setRegisterMode() {
      this.isRegisterMode = true;
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>

.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f2f9ff; 
}

h2 {
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /
}

button {
  width: 100%;
  background-color: #007bff; 
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3; 
}

.operation-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.operation-buttons button {
  margin: 0 10px; 
}

p {
  color: red;
  margin-top: 10px;
}
</style>
