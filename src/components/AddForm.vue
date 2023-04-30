<template>
    <a-form
      name="addform"
      autocomplete="off"
      layout="vertical"
      :model="formState"
      @finish="onFinish"
    >
      <a-form-item
        name="tarea"
        label="Ingrese una Tarea"
        :rules="[
          {
            required: true,
            whitespace: true,
            message: 'Ingrese una tarea válida',
          },
        ]"
      >
        <a-input v-model:value="formState.tarea"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="loading"
        >
          Agregar Tarea
        </a-button>
      </a-form-item>
    </a-form>
  </template>
  
  <script>
  import { reactive, toRefs } from "vue";
  import { useDatabaseStore } from "../stores/database";
  import { message } from "ant-design-vue";
  import { supabase } from "../supabase";
  
  export default {
    setup() {
      const formState = reactive({
        tarea: "",
      });
      const databaseStore = useDatabaseStore();
      const loading = databaseStore.loading;
  
      const onFinish = async (value) => {
        console.log("todo correcto " + value);
        const error = await databaseStore.addTarea(formState.tarea);
        if (!error) {
          formState.tarea = "";
          return message.success("Tarea agregada ");
        }
        switch (error) {
          // buscar errores de firestore
          default:
            message.error("Ocurrió un error en el servidor intentelo más tarde...");
            break;
        }
      };
  
      return {
        ...toRefs(formState),
        onFinish,
        loading,
      };
    },
  };
  </script>