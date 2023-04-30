<template>
    <a-layout>
      <a-layout-header v-if="!loadingSession">
        <a-menu
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
          v-model:selectedKeys="selectedKeys"
        >
          <a-menu-item v-if="user" key="home">
            <router-link to="/">Home</router-link>
          </a-menu-item>
          <a-menu-item v-if="!user" key="login">
            <router-link to="/login">Login</router-link>
          </a-menu-item>
          <a-menu-item v-if="!user" key="register">
            <router-link to="/register">Register</router-link>
          </a-menu-item>
          <a-menu-item @click="signOut" v-if="user" key="logout">
            Logout
          </a-menu-item>
        </a-menu>
        <nav>| | |</nav>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px">
        <div class="container">
          <div v-if="loadingSession">loading user...</div>
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  import { useUserStore } from "./stores/user";
  import { useRoute } from "vue-router";
  
  export default {
    setup() {
      const userStore = useUserStore();
      const route = useRoute();
      const selectedKeys = ref([]);
  
      watch(() => route.name, () => {
        selectedKeys.value = [route.name];
      });
  
      return {
        loadingSession: userStore.loadingSession,
        user: userStore.user,
        signOut: userStore.signOut,
        selectedKeys,
      };
    },
  };
  </script>
  
  <style>
  .container {
    background-color: #fff;
    padding: 24px;
    min-height: calc(100vh - 64px);
  }
  
  .text-center {
    text-align: center;
  }
  </style>