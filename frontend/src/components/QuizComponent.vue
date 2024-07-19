<template>
  <div class="quiz-container">
    <header>
      <div class="header-content">
        <h1>Спортмастер</h1>
        <div v-if="currentUser" class="user-info">
          {{ currentUser.username }}
        </div>
      </div>
    </header>

    <div class="content">
      <div v-if="showResult" class="quiz-result">
        <h2>Результаты викторины</h2>
        <p>Вы набрали {{ score }} баллов из {{ questions.length }}.</p>
        <p v-if="discountMessage">{{ discountMessage }}</p>
        <button @click="goToAuth" class="auth-button">Выход</button>
      </div>

      <div v-else-if="currentQuestion" class="quiz-question">
        <h2>{{ currentQuestion.question_text }}</h2>
        <ul>
          <li v-for="answer in currentQuestion.answers" :key="answer.answer_id">
            <button @click="checkAnswer(answer)" class="answer-button">{{ answer.answer_text }}</button>
          </li>
        </ul>
      </div>

      <div v-else class="loading">
        Loading...
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      showResult: false,
      currentUser: null, // Добавленное свойство для хранения текущего пользователя
      discountMessage: '' // Сообщение о скидке
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await axios.get('http://localhost:3000/api/questions');
        this.questions = response.data;
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async fetchCurrentUser() {
      try {
        const response = await axios.get('http://localhost:3000/api/user'); 
        this.currentUser = response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    },
    checkAnswer(answer) {
      if (answer.is_correct) {
        this.score++;
      }
      if (this.currentQuestionIndex + 1 < this.questions.length) {
        this.currentQuestionIndex++;
      } else {
        this.showResult = true;
        this.calculateDiscount();
      }
    },
    calculateDiscount() {
      const discount = this.score * 10; // 10% скидка за каждый балл
      if (discount > 0) {
        this.discountMessage = `Поздравляем! Вы получаете скидку ${discount}%.`;
      } else {
        this.discountMessage = `К сожалению, вы не набрали достаточное количество баллов для получения скидки.`;
      }
    },
    goToAuth() {
      this.$router.push('/login'); // Переход на страницу авторизации
    }
  },
  mounted() {
    this.fetchQuestions();
    this.fetchCurrentUser(); 
  }
};
</script>

<style scoped>

.quiz-container {
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

header {
  background-color: #1E2ED4;
  color: #FFF;
  padding: 20px;
  text-align: center;
  border-radius: 10px 10px 0 0;
}

.header-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px; 
}

h1 {
  font-size: 1.8em;
  margin: 0;
}

.content {
  max-width: 600px;
  margin: 20px auto; 
  padding: 20px;
}

.quiz-question,
.quiz-result,
.loading {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quiz-question h2,
.quiz-result h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

.answer-button,
.auth-button {
  background-color: #3F51B5;
  color: #FFF;
  padding: 10px 15px;
  margin: 5px 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1em;
  width: 100%;
  text-align: left;
}

.answer-button:hover,
.auth-button:hover {
  background-color: #303F9F;
}

.answer-button:focus,
.auth-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.5);
}

.loading {
  text-align: center;
  padding: 20px;
}

.user-info {
  margin-right: 20px;
  color: #fff;
  font-weight: bold;
}
</style>
