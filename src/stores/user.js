import { defineStore } from "pinia";
import { supabase } from "../supabase";
import router from "../router";
import { useDatabaseStore } from "./listStore";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    loadingUser: false,
    loadingSession: false,
  }),
  
  actions: {
    async fetchUser() {
      const user = await supabase.auth.getSession();
      this.user = user;
    },

    async signIn(email, password) {
      this.loadingUser = true;
      try{
      const { user } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      this.userData = { email: user.email, uid: user.uid };
      router.push("/");
    } catch (error) {
        console.log(error.code);
        return error.code;
    } finally {
        this.loadingUser = false;
    }
      
    },


    async signUp(email, password) {
      const { user, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      if (user) {
        this.user = user;
      }
      router.push("/login");
    },
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        console.log(`Supabase signOut error is ${error}`);
        this.user = null;
        this.loadingSession = null;
        console.log(`Pinia user after signOut is ${JSON.stringify(this.user)}`);
    
        return error;
      } catch (e) {
        console.log(`Error from userStore signOut() is ${e}`);
      }
      router.push("/login");
    },

    currentUser() {
      return new Promise((resolve, reject) => {
          const unsuscribe = supabase.onAuthStateChanged(
              
              (user) => {
                  if (user) {
                      this.user = {
                          email: user.email,
                          uid: user.uid,
                      };
                  } else {
                      this.user = null;
                      const databaseStore = useDatabaseStore();
                      databaseStore.$reset();
                  }
                  resolve(user);
              },
              (e) => reject(e)
          );
          unsuscribe();
      });
  },
    persist: {
      enabled: true,
      strategies: [
        {
          key: "user",
          storage: localStorage,
        },
      ],
    },
  },
});


