<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Search for a child"
          prepend-inner-icon="fas fa-search"
          @input="searchChild"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="search-message">
          <span class="highlight">Only recent entries</span> are being shown. Please use the search function above to find a specific child by name.
        </div>
      </v-col>
    </v-row>
    <v-row v-if="children.length > 0">
      <v-col v-for="child in displayedChildren" :key="child.id" cols="12" md="4">
        <v-card class="mx-auto my-3" elevation="2" style="background-color: #f0f0f0; border-radius: 10px;">
          <v-img :src="child.photoUrl" height="200px" contain></v-img>
          <v-card-text class="text-center">
            <h3>{{ child.name }}</h3>
            <p><strong>Age:</strong> {{ child.age }}</p>
            <p><strong>Connection Status:</strong> {{ child.connectionStatus }}</p>
            <p><strong>Parents Status:</strong> {{ child.parents }}</p>
            <p><strong>Address:</strong> {{ child.address }}</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="secondary" @click="initiateDonation(child)">
              <i class="fas fa-donate"></i> Help this Child
            </v-btn>
          </v-card-actions>
          <div :id="'donate-button-' + child.id"></div>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>


<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'Donations',
  setup() {
    const searchQuery = ref('');
    const children = ref([]);
    const displayedChildren = ref([]);
    const user = ref(null);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
      } else {
        user.value = null;
        showSnackbar('You need to be logged in to perform this action.', 'error');
      }
    });

    const searchChild = async () => {
      if (searchQuery.value.trim() === '') {
        fetchChildren();  // If search is empty, fetch all children
      } else {
        const q = query(collection(db, 'children'), where('name', '==', searchQuery.value.trim()));
        const querySnapshot = await getDocs(q);
        children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayedChildren.value = children.value.slice(0, 6);  // Display up to 6 children
      }
    };

    const initiateDonation = (child) => {
      const donationAmount = 10; // Set a default or dynamic donation amount
      if (window.paypal) {
        renderPaypalButton(child, donationAmount);
      } else {
        loadPaypalSdk(() => renderPaypalButton(child, donationAmount));
      }
    };

    const renderPaypalButton = (child, donationAmount) => {
      const donationHandler = paypal.Buttons({
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: donationAmount
              }
            }]
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            recordDonation(details, donationAmount, 'PayPal', child.id);
            showSnackbar('Donation successful!', 'success');
          });
        },
        onError: function (err) {
          showSnackbar(`Error: ${err.message}`, 'error');
        }
      });
      donationHandler.render(`#donate-button-${child.id}`);
    };

    const loadPaypalSdk = (callback) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AQm-T_k_iDWUG8UcV-NIO1sBpwAsPJMeoMRylJXtXqYowbhIb-QW85s5P0LZ-o7jeCSJ7xoMhJRuAfKN`;
      script.onload = callback;
      document.head.appendChild(script);
    };

    const recordDonation = async (details, amount, paymentMethod, childId) => {
      try {
        await addDoc(collection(db, 'donations'), {
          amount: amount,
          date: new Date().toISOString(),
          paymentMethod: paymentMethod,
          childId: childId,
          transactionId: details.id
        });
      } catch (error) {
        showSnackbar(`Error recording donation: ${error.message}`, 'error');
      }
    };

    const fetchChildren = () => {
      const q = query(collection(db, 'children'));
      onSnapshot(q, (querySnapshot) => {
        children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayedChildren.value = children.value.slice(0, 6);  // Display up to 6 children
      });
    };

    const showSnackbar = (message, color) => {
      snackbar.value.message = message;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    onMounted(() => {
      fetchChildren();
    });

    return {
      searchQuery,
      children,
      displayedChildren,
      searchChild,
      initiateDonation,
      snackbar
    };
  }
};
</script>

<style scoped>
.v-img {
  border-radius: 10px;
  object-fit: cover;
}
.v-avatar img {
  border-radius: 10px;
}
.v-card {
  border-radius: 10px;
}
.search-message {
  font-size: 16px;
  color: #666;
  background-color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.highlight {
  font-weight: bold;
  color: #333;
}
</style>
