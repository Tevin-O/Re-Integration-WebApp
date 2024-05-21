<template>
    <v-app-bar app color="black" dark flat class="px-12" >
      <v-btn >
        <v-icon color="yellow" left class="mr-2">fas fa-signature</v-icon> FH
      </v-btn>
      
  
      <v-spacer></v-spacer>
      <v-btn text @click="scroll('home')" class="text-yellow">Home</v-btn>
      <v-btn text @click="scroll('about')"  >About</v-btn>
      <v-btn text @click="scroll('mission')"  >Mission</v-btn> 
     <v-btn text @click="scroll('services')" >Services</v-btn>
      <v-btn text @click="scroll('testimonials')"  >Testimonials</v-btn>   
      <v-btn text @click="scroll('howtohelp')"  >How to help</v-btn>
      <v-btn text @click="scroll('contact')"  >Contact Us</v-btn>
      <v-btn icon @click="register">
        <v-icon color="white">fa fa-user</v-icon>
      </v-btn>

    </v-app-bar>
  </template>
  
  <script>
  export default {
    methods: {
      scroll(refName) {
        const element = document.getElementById(refName);
        element.scrollIntoView({ behavior: "smooth" });
      },
      register() {
      this.$router.push({ name: 'register2' });
    }
    },
  };
  </script>
  
  <style>
  </style>