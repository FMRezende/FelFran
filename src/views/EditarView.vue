<template>
    <div>
        <h1>Editar id: {{ route.params.id }}</h1>
        <a-form
            name="editform"
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
                        message: 'Ingrese una Tarea válida',
                    },
                ]"
            >
                <a-input v-model:value="formState.tarea"></a-input>
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    :loading="databaseStore.loading"
                    :disabled="databaseStore.loading"
                >
                    Editar Tarea</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useDatabaseStore } from "../stores/database";
import { message } from "ant-design-vue";
import { supabase } from "../supabase";
//import { supabase } from "../supabase";
const databaseStore = useDatabaseStore();
const route = useRoute();
const formState = reactive({
    tarea: " ",
});
const onFinish = async (value) => {
    console.log("todo correcto " + value);
    const error = await supabase.databaseStore.editTask(route.params.id, formState.tarea);
    if (!error) {
        formState.tarea = "";
        return message.success("Tarea editada ");
    }
    switch (error) {
        // buscar errores de firestore
        default:
            message.error(
                "Ocurrió un error en el servidor intentelo más tarde..."
            );
            break;
    }
};
onMounted(async () => {
    formState.tarea = await databaseStore.editTask(route.params.id);
});
</script>