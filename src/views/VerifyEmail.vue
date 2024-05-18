<template>
    <div>
      <p>Please check your email and verify your account to continue.</p>
      <p>If you haven't received the email, click the button below to resend the verification email.</p>
      <button @click="resendVerificationEmail">Resend Verification Email</button>
    </div>
  </template>
  
  <script setup>
  import { getAuth, sendEmailVerification } from 'firebase/auth';
  
  const auth = getAuth();
  
  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      alert('Verification email sent.');
    } else {
      alert('No user is currently logged in.');
    }
  };
  </script>
  