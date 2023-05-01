import { defineStore } from "pinia";
import { supabase } from "../supabase";
import router from "../router/index"; //funciona desta etapa


export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: undefined,
    loadingUser: false,
    loadingSession: false,
  }),
  /////////////
  actions: {
    async fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      this.user = user;
  },

    async signIn(email, password) {
      this.loadingUser = true;
      try{
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
       router.push("home");

      if (error) throw error;
      if (data) this.user = data
      
    } catch (error) {
        console.log(error.code);
        return error.code;
    } finally {
        this.loadingUser = false;
    }
          
    },

    async signUp(email, password) {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (user) {
        this.user = { email: user.email, uid: user.id };
      }
      router.push("login");
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
      router.push("home");
    },
      //router.push("/register");
    },

    
    async currentUser() {
      try {
        const user = await supabase.auth.getUser();
        if (user) {
          this.user = {
            email: user.email,
            uid: user.id,
          };
        } else {
          this.user = null;
          const databaseStore = defineStore();
          databaseStore.$reset();
        }
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }, 
  },
);