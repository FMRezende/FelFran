import { supabase } from "../supabase"
import { ref } from "vue"
import { nanoid } from "nanoid"
import router from "../router/index"

export default {
  setup() {
    const documents = ref([])
    const loadingDoc = ref(false)
    const loading = ref(false)

    async function getTareas() {
      if (documents.value.length !== 0) {
        return;
      }

      loadingDoc.value = true
      try {
        const { data, error } = await supabase
          .from("tareas")
          .select("*")
          .eq("user", supabase.auth.user().id);
        if (error) {
          throw new Error(error.message);
        }
        documents.value = data;
      } catch (error) {
        console.log(error);
      } finally {
        loadingDoc.value = false
      }
    }

    async function addTarea(name) {
      loading.value = true
      try {
        const objetoDoc = {
          name: name,
          short: nanoid(6),
          user: supabase.auth.user().id,
        };
        const { data, error } = await supabase.from("tareas").insert([objetoDoc]);
        if (error) {
          throw new Error(error.message);
        }
        documents.value.push({
          ...objetoDoc,
          id: data[0].id,
        });
      } catch (error) {
        console.log(error.message)
        return error.message
      } finally {
        loading.value = false
      }
    }

    async function leerTarea(id) {
      try {
        const { data, error } = await supabase.from("tareas").select("name").eq("id", id);
        if (error) {
          throw new Error(error.message);
        }

        if (data.length === 0) {
          throw new Error("no existe el doc");
        }

        if (data[0].user !== supabase.auth.user().id) {
          throw new Error("no le pertenece ese documento");
        }

        return data[0].name;
      } catch (error) {
        console.log(error.message);
      }
    }

    async function updateTarea(id, name) {
      loading.value = true
      try {
        const { data, error } = await supabase.from("tareas").update({ name }).eq("id", id);
        if (error) {
          throw new Error(error.message);
        }

        if (data.length === 0) {
          throw new Error("no existe el doc");
        }

        if (data[0].user !== supabase.auth.user().id) {
          throw new Error("no le pertenece ese documento");
        }

        documents.value = documents.value.map((item) =>
          item.id === id ? { ...item, name: name } : item
        );
        router.push("/");
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        loading.value = false;
      }
    }

    async function deleteTarea(id) {
      loading.value = true
      try {
        const { data, error } = await supabase.from("tareas").delete().eq("id", id);
        if (error) {
          throw new Error(error.message);
        }
    
        if (data.length === 0) {
          throw new Error("no existe el doc");
        }
    
        if (data[0].user !== supabase.auth.user().id) {
          throw new Error("no le pertene