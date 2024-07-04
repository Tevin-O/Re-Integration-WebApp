<template>
  <v-container>
    <!-- Floating Title Bar with Icon -->
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card-title" elevation="2">
          <v-card-title class="d-flex justify-center align-center">
            <v-icon class="mr-2">fas fa-donate</v-icon>
            <h2 class="title-text">Donations</h2>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search Bar -->
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Search for a child"
          prepend-inner-icon="fas fa-search"
          @input="searchChild"
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Search Message -->
    <v-row v-if="showSearchMessage">
      <v-col cols="12">
        <v-alert 
          type="info" 
          dense 
          dismissible 
          @input="showSearchMessage = false"
          class="search-message">
          <span class="highlight">Only recent entries</span> are being shown. Please use the search function above to find a specific child by name.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Children List -->
    <v-row v-if="children.length > 0">
      <v-col v-for="child in displayedChildren" :key="child.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto my-3 child-card" elevation="2">
          <v-img :src="child.photoUrl" height="120px" contain></v-img>
          <v-card-text class="text-center">
            <h4>{{ child.name }}</h4>
            <p><strong>Age:</strong> {{ child.age }}</p>
            <p><strong>Connection Status:</strong> {{ child.connectionStatus }}</p>
            <p><strong>Parents Status:</strong> {{ child.parents }}</p>
            <p><strong>Address:</strong> {{ child.address }}</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="secondary" @click="initiateDonation(child)" small>
              <i class="fas fa-donate"></i> Help this Child
            </v-btn>
            <div :id="'donate-button-' + child.id"></div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar for Notifications -->
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
      try {
        if (searchQuery.value.trim() === '') {
          fetchChildren();  // If search is empty, fetch all children
        } else {
          const querySnapshot = await getDocs(collection(db, 'children'));
          children.value = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(child => child.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
          displayedChildren.value = children.value.slice(0, 6);  // Display up to 6 children
        }
      } catch (error) {
        showSnackbar(`Error searching children: ${error.message}`, 'error');
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
      snackbar,
      showSearchMessage: ref(true)
    };
  }
};
</script>

<style scoped>
.floating-card-title {
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.floating-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}
.floating-card:hover {
  transform: translateY(-5px);
}
.v-card-title {
  font-size: 24px;
  font-weight: bold;
}
.v-text-field,
.v-textarea {
  margin-bottom: 10px;
}
.v-btn {
  margin-top: 10px;
}
.v-avatar img {
  border-radius: 50%;
}
.v-data-table th,
.v-data-table td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
}
.v-data-table th {
  background-color: #f5f5f5;
}
.v-data-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}
.title-text {
  font-size: 24px;
  font-weight: bold;
}
.v-chip {
  font-size: 16px;
  font-weight: bold;
}
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
  font-size: 14px;
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
.child-card {
  max-width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.v-card-text h4 {
  font-size: 16px;
  margin-bottom: 8px;
}
.v-card-text p {
  font-size: 12px;
  margin: 3px 0;
}
</style>
