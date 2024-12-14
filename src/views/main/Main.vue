<script setup>
</script>

<template>
  <v-main>
    <v-container class="text-center my-10">
      <h1>Ласкаво просимо на сайт пошуку квитків!</h1>
      <p>
        Наш сервіс пропонує швидкий та зручний спосіб пошуку квитків на
        різні види транспорту: поїзди, автобуси, літаки.
        Забронюйте квитки онлайн, знайдіть найкращі пропозиції та насолоджуйтесь
        подорожами з комфортом!
      </p>
      <router-link class="cta-link" :to="{'name':'search'}">
        Дізнатися більше
      </router-link>
    </v-container>
  </v-main>

  <v-footer color="primary" dark app inset>
    <v-col class="text-center white--text">
      &copy; {{ new Date().getFullYear() }} Квитки Онлайн. Всі права захищені.
    </v-col>
  </v-footer>
</template>
