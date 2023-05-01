import { supabase } from "../supabase"
import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import router from "../router/index";

export const useDatabaseStore = defineStore("database", {
  state: () => ({
    documents: [],
    loadingDoc: false,
    loading: false,
  }),
  actions: {
    async getTareas() {
      if (this.documents.length !== 0) {
        return;
      }

      this.loadingDoc = true;
      try {
        const { data, error } = await supabase
          .from("tareas")
          .select("*")
          .eq("user", supabase.auth.user().id);
        if (error) {
          throw new Error(error.message);
        }
        this.documents = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingDoc = false;
      }
    },
    async addTarea(name) {
      this.loading = true;
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
        this.documents.push({
          ...objetoDoc,
          id: data[0].id,
        });
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        this.loading = false;
      }
    },
    async leerTarea(id) {
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
    },
    async updateTarea(id, name) {
      this.loading = true;
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

        this.documents = this.documents.map((item) =>
          item.id === id ? { ...item, name: name } : item
        );
        router.push("/");
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        this.loading = false;
      }
    },

    async deleteTarea(id) {
      this.loading = true;
      try {
        const { data, error } = await supabase.from("tareas").delete().eq("id", id);
        if (error) {
          throw new Error(error.message);
        }
    
        if (data.length === 0) {
          throw new Error("no existe el doc");
        }
    
        if (data[0].user !== supabase.auth.user().id) {
          throw new Error("no le pertenece ese documento");
        }
    
        this.documents = this.documents.filter((item) => item.id !== id);
      } catch (error) {
        console.log(error.message);
        return error.message;
      } finally {
        this.loading = false;
      }
    },

},
});