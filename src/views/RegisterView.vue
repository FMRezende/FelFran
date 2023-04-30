<template>
    <h1 class="text-center">Register</h1>
    <a-row>
      <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
        <a-form
          name="basicRegister"
          autocomplete="off"
          layout="vertical"
          :model="formState"
          @finish="onFinish"
        >
          <a-form-item
            name="email"
            label="Ingrese tu correo"
            :rules="rules.email"
          >
            <a-input v-model:value="formState.email"></a-input>
          </a-form-item>
          <a-form-item
            name="password"
            label="Ingrese contraseña"
            :rules="rules.password"
          >
            <a-input-password v-model:value="formState.password"></a-input-password>
          </a-form-item>
          <a-form-item
            name="repassword"
            label="Repita contraseña"
            :rules="rules.repassword"
          >
            <a-input-password v-model:value="formState.repassword"></a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="loadingUser"
              :loading="loadingUser"
            >
              Ingresar
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </template>
  
  <script>
  import { reactive, toRefs } from "vue";
  import { useUserStore } from "../stores/user";
  import { message } from "ant-design-vue";
  
  export default {
    setup() {
      const userStore = useUserStore();
      const formState = reactive({
        email: "",
        password: "",
        repassword: "",
      });
  
      const rules = {
        email: [
          {
            required: true,
            whitespace: true,
            type: "email",
            message: "Ingresa un email válido",
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            whitespace: true,
            message: "Ingresa una contraseña con mínimo 6 carácteres",
          },
        ],
        repassword: [
          {
            validator: validatePass,
          },
        ],
      };
  
      const loadingUser = userStore.loadingUser;
  
      function validatePass(_rule, value) {
        if (value === "") {
          return Promise.reject("Repita contraseña");
        }
        if (value !== formState.password) {
          return Promise.reject("No coinciden las contraseñas");
        }
        return Promise.resolve();
      }
  
      async function onFinish(values) {
        console.log("Success:", values);
        const error = await userStore.signUp(
          formState.email,
          formState.password
        );
        if (!error) {
          return message.success(
            "Revisa tu correo electrónico y verificalo"
          );
        }
        switch (error) {
          case "auth/email-already-in-use":
            message.error("Email ya registrado");
            break;
          default:
            message.error(
              "Ocurrió un error en el servidor intentelo más tarde..."
            );
            break;
        }
      }
  
      return {
        ...toRefs(formState),
        rules,
        onFinish,
        loadingUser,
      };
    },
  };