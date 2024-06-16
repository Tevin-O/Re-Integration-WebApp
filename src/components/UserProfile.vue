<template>
  <v-container>
    <v-row>
      <!-- User Information Summary -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title class="d-flex justify-center">
            <v-avatar size="120">
              <img :src="userInfo.photoURL" alt="Profile Photo" />
            </v-avatar>
          </v-card-title>
          <v-card-text class="text-center">
            <h3>Hello, {{ userInfo.name }}</h3>
            <p><strong>Phone Number:</strong> {{ userInfo.phoneNumber || 'Not provided' }}</p>
            <p><strong>Address:</strong> {{ userInfo.address || 'Not provided' }}</p>
            <p><strong>Gender:</strong> {{ userInfo.gender || 'Not specified' }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Change Password -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <form @submit.prevent="changePassword">
              <v-text-field
                v-model="oldPassword"
                label="Old Password"
                type="password"
                prepend-inner-icon="fas fa-lock"
                required
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                prepend-inner-icon="fas fa-lock"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block title="Change Password">Change Password</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Update User Information -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title>Update User Information</v-card-title>
          <v-card-text>
            <form @submit.prevent="updateProfile">
              <v-text-field
                v-model="phoneNumber"
                label="Phone Number"
                prepend-inner-icon="fas fa-phone"
                required
              ></v-text-field>
              <v-text-field
                v-model="address"
                label="Address"
                prepend-inner-icon="fas fa-home"
                required
              ></v-text-field>
              <v-divider class="my-4"></v-divider>
              <p><strong>Gender</strong></p>
              <v-radio-group v-model="gender" row>
                <v-radio label="Male" value="male"></v-radio>
                <v-radio label="Female" value="female"></v-radio>
              </v-radio-group>
              <v-divider class="my-4"></v-divider>
              <v-file-input
                v-model="profilePhoto"
                label="Upload Profile Photo"
                prepend-inner-icon="fas fa-camera"
                accept="image/*"
                @change="handlePhotoUpload"
              ></v-file-input>
              <v-btn type="submit" color="primary" class="mt-4" block title="Update Profile">Update Profile</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Add Payment Method -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title>Add Payment Method</v-card-title>
          <v-card-text>
            <v-radio-group v-model="paymentMethod" row>
              <v-radio label="Card" value="card"></v-radio>
              <v-radio label="PayPal" value="paypal"></v-radio>
            </v-radio-group>
            <form v-if="paymentMethod === 'card'" @submit.prevent="addPaymentMethod">
              <v-text-field
                v-model="cardNumber"
                label="Card Number"
                prepend-inner-icon="fas fa-credit-card"
                required
              ></v-text-field>
              <v-text-field
                v-model="expiryDate"
                label="Expiry Date (MM/YY)"
                prepend-inner-icon="fas fa-calendar-alt"
                required
              ></v-text-field>
              <v-text-field
                v-model="cvv"
                label="CVV"
                type="password"
                prepend-inner-icon="fas fa-lock"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block title="Add Card">Add Card</v-btn>
            </form>
            <form v-else-if="paymentMethod === 'paypal'" @submit.prevent="addPaymentMethod">
              <v-text-field
                v-model="paypalEmail"
                label="PayPal Email"
                prepend-inner-icon="fas fa-envelope"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block title="Add PayPal">Add PayPal</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, updateProfile as updateFirebaseProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, getFirestore } from 'firebase/firestore';
import compressImage from '@/utils/compressImage.js'; // Ensure the path is correct

export default {
  name: 'UserProfile',
  setup() {
    const phoneNumber = ref('');
    const address = ref('');
    const gender = ref('');
    const profilePhoto = ref(null);
    const oldPassword = ref('');
    const newPassword = ref('');
    const paymentMethod = ref('');
    const cardNumber = ref('');
    const expiryDate = ref('');
    const cvv = ref('');
    const paypalEmail = ref('');
    const userInfo = ref({
      name: '',
      phoneNumber: '',
      address: '',
      gender: '',
      photoURL: '',
      paymentMethods: {}
    });

    const auth = getAuth(); // Initialize the auth instance

    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user info from Firestore
          const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            userInfo.value = {
              ...data,
              name: data.name || 'User',
              photoURL: data.photoURL || '',
              paymentMethods: data.paymentMethods || {}
            };
            phoneNumber.value = data.phoneNumber || '';
            address.value = data.address || '';
            gender.value = data.gender || '';
            console.log('User info fetched:', userInfo.value); // Debugging
          }
        }
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    const handlePhotoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        profilePhoto.value = file;
        console.log('Photo selected:', file); // Debugging
      }
    };

    const updateProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(getFirestore(), 'users', user.uid);
          const profileData = {
            phoneNumber: phoneNumber.value,
            address: address.value,
            gender: gender.value,
            paymentMethods: userInfo.value.paymentMethods || {} // Ensure paymentMethods is not overwritten
          };

          if (profilePhoto.value) {
            console.log('Uploading photo...'); // Debugging
            const compressedPhoto = await compressImage(profilePhoto.value);
            console.log('Photo compressed:', compressedPhoto); // Debugging
            const storage = getStorage();
            const photoRef = storageRef(storage, `profilePhotos/${user.uid}.jpg`);
            await uploadBytes(photoRef, compressedPhoto);
            const photoURL = await getDownloadURL(photoRef);
            profileData.photoURL = photoURL;
            console.log('Photo uploaded, URL:', photoURL); // Debugging
          }

          // Update user document in Firestore
          await updateDoc(userDoc, profileData);
          console.log('Firestore profile updated:', profileData); // Debugging

          if (profilePhoto.value) {
            // Update user profile photo URL in Firebase Auth
            await updateFirebaseProfile(user, { photoURL: profileData.photoURL });
            console.log('Firebase Auth profile updated:', profileData.photoURL); // Debugging
          }

          alert('Profile updated successfully');
          fetchUserInfo(); // Refresh user info after updating
        }
      } catch (error) {
        console.error('Error updating profile', error);
        alert('Failed to update profile. Please try again.');
      }
    };

    const changePassword = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const credential = EmailAuthProvider.credential(user.email, oldPassword.value);
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword.value);
          alert('Password changed successfully');
        }
      } catch (error) {
        console.error('Error changing password', error);
        alert('Failed to change password. Please try again.');
      }
    };

    const addPaymentMethod = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(getFirestore(), 'users', user.uid);
          const paymentMethods = userInfo.value.paymentMethods || {};

          if (paymentMethod.value === 'card') {
            if (paymentMethods.card) {
              alert('You already have a card payment method.');
              return;
            }
            paymentMethods.card = {
              cardNumber: cardNumber.value,
              expiryDate: expiryDate.value,
              cvv: cvv.value,
            };
          } else if (paymentMethod.value === 'paypal') {
            if (paymentMethods.paypal) {
              alert('You already have a PayPal payment method.');
              return;
            }
            paymentMethods.paypal = {
              paypalEmail: paypalEmail.value,
            };
          }

          await updateDoc(userDoc, { paymentMethods });
          alert(`Added ${paymentMethod.value} payment method`);
          fetchUserInfo(); // Refresh user info after adding payment method
        }
      } catch (error) {
        console.error('Error adding payment method', error);
        alert('Failed to add payment method. Please try again.');
      }
    };

    onMounted(() => {
      fetchUserInfo();
    });

    return {
      phoneNumber,
      address,
      gender,
      profilePhoto,
      oldPassword,
      newPassword,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      paypalEmail,
      userInfo,
      updateProfile,
      changePassword,
      addPaymentMethod,
      handlePhotoUpload,
      fetchUserInfo,
    };
  },
};
</script>

<style scoped>
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.text-center {
  text-align: center;
}
</style>
