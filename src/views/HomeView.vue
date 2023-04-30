<template>
    <div>
      <h1>Home Ruta protegida</h1>
      <p>{{ user?.email }}</p>
  
      <AddForm></AddForm>
  
      <p v-if="loadingDoc">loading docs...</p>
  
      <a-space
        direction="vertical"
        v-if="!loadingDoc"
        style="width: 100%"
      >
        <a-card
          v-for="item of documents"
          :key="item.id"
          :title="item.short" 
        >
          <template #extra>
            <a-space>
              <a-popconfirm
                title="¿Estás seguro que deseas eliminar?"
                ok-text="Sí"
                cancel-text="No"
                @confirm="confirm(item.id)"
                @cancel="cancel"
              >
                <a-button
                  danger
                  :loading="loading"
                  :disabled="loading"
                >Eliminar</a-button>
              </a-popconfirm>
              <a-button
                type="primary"
                @click="router.push(`/editar/${item.id}`)"
              >Editar</a-button>
            </a-space>
          </template>
          <p>{{ item.name }}</p>
        </a-card>
      </a-space>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useUserStore } from '../stores/user';
  import { useDatabaseStore } from '../stores/database';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import AddForm from './AddForm.vue';
  
  export default {
    components: {
      AddForm,
    },
    setup() {
      const userStore = useUserStore();
      const databaseStore = useDatabaseStore();
      const router = useRouter();
  
      databaseStore.fetchTasks();
  
      const confirm = async (id) => {
        const { error } = await databaseStore.deleteTask(id);
        if (!error) return message.success('Se eliminó con éxito ');
        return message.error(error);
      };
  
      const cancel = () => {
        message.error('no se eliminó ');
      };
  
      const user = computed(() => userStore.user);
      const loadingDoc = computed(() => databaseStore.loadingDoc);
      const documents = computed(() => databaseStore.documents);
      const loading = computed(() => databaseStore.loading);
  
      return {
        user,
        loadingDoc,
        documents,
        loading,
        confirm,
        cancel,
        router,
      };
    },
  };