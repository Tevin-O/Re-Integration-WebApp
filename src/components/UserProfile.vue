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
            <p><strong>Payment Method:</strong> {{ paymentMethodSummary }}</p>
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
              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
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
              <v-btn type="submit" color="primary" class="mt-4" block title="Update Profile">Update Profile</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Change Profile Picture Button and Payment Method Form -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title>Change Profile Picture</v-card-title>
          <v-card-text>
            <v-btn @click="selectProfilePicture" color="primary">Change Profile Picture</v-btn>
            <input type="file" ref="fileInput" @change="uploadProfilePicture" style="display: none;" />
          </v-card-text>
        </v-card>

        <!-- Add or Update Payment Method -->
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title v-if="!hasPaymentMethod">Add Payment Method</v-card-title>
          <v-card-title v-else>Update Payment Method</v-card-title>
          <v-card-text>
            <v-radio-group v-if="!hasPaymentMethod" v-model="paymentMethod" row>
              <v-radio label="Card" value="card"></v-radio>
              <v-radio label="PayPal" value="paypal"></v-radio>
            </v-radio-group>
            <v-radio-group v-else v-model="newPaymentMethod" row>
              <v-radio label="Card" value="card"></v-radio>
              <v-radio label="PayPal" value="paypal"></v-radio>
            </v-radio-group>

            <form v-if="!hasPaymentMethod && paymentMethod === 'card'" @submit.prevent="addPaymentMethod">
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
            <form v-if="!hasPaymentMethod && paymentMethod === 'paypal'" @submit.prevent="addPaymentMethod">
              <v-text-field
                v-model="paypalEmail"
                label="PayPal Email"
                prepend-inner-icon="fas fa-envelope"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block title="Add PayPal">Add PayPal</v-btn>
            </form>

            <form v-if="hasPaymentMethod && newPaymentMethod === 'card'" @submit.prevent="updatePaymentMethod">
              <v-text-field
                v-model="newCardNumber"
                label="Card Number"
                prepend-inner-icon="fas fa-credit-card"
                required
              ></v-text-field>
              <v-text-field
                v-model="newExpiryDate"
                label="Expiry Date (MM/YY)"
                prepend-inner-icon="fas fa-calendar-alt"
                required
              ></v-text-field>
              <v-text-field
                v-model="newCvv"
                label="CVV"
                type="password"
                prepend-inner-icon="fas fa-lock"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block title="Update Card">Update Card</v-btn>
            </form>
            <form v-if="hasPaymentMethod && newPaymentMethod === 'paypal'" @submit.prevent="updatePaymentMethod">
              <v-text-field
                v-model="newPaypalEmail"
                label="PayPal Email"
                prepend-inner-icon="fas fa-envelope"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block title="Update PayPal">Update PayPal</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getAuth, updateProfile as updateFirebaseProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc, getDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default {
  name: 'UserProfile',
  setup() {
    const phoneNumber = ref('');
    const address = ref('');
    const gender = ref('');
    const oldPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const paymentMethod = ref('');
    const newPaymentMethod = ref('');
    const cardNumber = ref('');
    const newCardNumber = ref('');
    const expiryDate = ref('');
    const newExpiryDate = ref('');
    const cvv = ref('');
    const newCvv = ref('');
    const paypalEmail = ref('');
    const newPaypalEmail = ref('');
    const userInfo = ref({
      name: '',
      phoneNumber: '',
      address: '',
      gender: '',
      photoURL: '',
      paymentMethods: {}
    });

    const auth = getAuth();
    const storage = getStorage();
    const fileInput = ref(null);

    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
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
          }
        }
      } catch (error) {
        console.error('Error fetching user info', error);
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
            paymentMethods: userInfo.value.paymentMethods || {}
          };

          await updateDoc(userDoc, profileData);

          userInfo.value.phoneNumber = phoneNumber.value;
          userInfo.value.address = address.value;
          userInfo.value.gender = gender.value;

          alert('Profile updated successfully');
          fetchUserInfo();
        }
      } catch (error) {
        console.error('Error updating profile', error);
        alert('Failed to update profile. Please try again.');
      }
    };

    const changePassword = async () => {
      try {
        if (newPassword.value !== confirmPassword.value) {
          alert('New password and confirmation do not match');
          return;
        }

        const user = auth.currentUser;
        if (user) {
          const credential = EmailAuthProvider.credential(user.email, oldPassword.value);
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword.value);
          
          await sendEmailVerification(user, {
            url: 'http://localhost:8080/loginui',
            handleCodeInApp: true
          });

          alert('Password changed successfully. You will be logged out.');
          auth.signOut();
          window.location.href = '/loginui';
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
          fetchUserInfo();
        }
      } catch (error) {
        console.error('Error adding payment method', error);
        alert('Failed to add payment method. Please try again.');
      }
    };

    const updatePaymentMethod = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(getFirestore(), 'users', user.uid);
          const paymentMethods = {};

          if (newPaymentMethod.value === 'card') {
            paymentMethods.card = {
              cardNumber: newCardNumber.value,
              expiryDate: newExpiryDate.value,
              cvv: newCvv.value,
            };
          } else if (newPaymentMethod.value === 'paypal') {
            paymentMethods.paypal = {
              paypalEmail: newPaypalEmail.value,
            };
          }

          await updateDoc(userDoc, { paymentMethods });
          alert(`Updated to ${newPaymentMethod.value} payment method`);
          fetchUserInfo();
        }
      } catch (error) {
        console.error('Error updating payment method', error);
        alert('Failed to update payment method. Please try again.');
      }
    };

    const selectProfilePicture = () => {
      fileInput.value.click();
    };

    const uploadProfilePicture = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const user = auth.currentUser;
          if (user) {
            const storageReference = storageRef(storage, `profile_pictures/${user.uid}`);
            
            if (userInfo.value.photoURL) {
              const oldPhotoRef = storageRef(storage, userInfo.value.photoURL);
              await deleteObject(oldPhotoRef);
            }
            
            await uploadBytes(storageReference, file);
            const downloadURL = await getDownloadURL(storageReference);
            
            const userDoc = doc(getFirestore(), 'users', user.uid);
            await updateDoc(userDoc, { photoURL: downloadURL });

            userInfo.value.photoURL = downloadURL;
            alert('Profile picture updated successfully');
          }
        } catch (error) {
          console.error('Error uploading profile picture', error);
          alert('Failed to upload profile picture. Please try again.');
        }
      }
    };

    const hasPaymentMethod = computed(() => {
      const methods = userInfo.value.paymentMethods;
      return methods.card || methods.paypal;
    });

    const paymentMethodSummary = computed(() => {
      const methods = userInfo.value.paymentMethods;
      if (methods.card) {
        return 'Card';
      } else if (methods.paypal) {
        return 'PayPal';
      } else {
        return 'Not specified';
      }
    });

    onMounted(() => {
      fetchUserInfo();
    });

    return {
      phoneNumber,
      address,
      gender,
      oldPassword,
      newPassword,
      confirmPassword,
      paymentMethod,
      newPaymentMethod,
      cardNumber,
      newCardNumber,
      expiryDate,
      newExpiryDate,
      cvv,
      newCvv,
      paypalEmail,
      newPaypalEmail,
      userInfo,
      updateProfile,
      changePassword,
      addPaymentMethod,
      updatePaymentMethod,
      fetchUserInfo,
      selectProfilePicture,
      uploadProfilePicture,
      fileInput,
      hasPaymentMethod,
      paymentMethodSummary
    };
  },
};
</script>

<style>
.v-avatar img {
  border-radius: 50%;
}
</style>
