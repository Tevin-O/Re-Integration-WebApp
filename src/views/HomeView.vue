<template>
  <v-app id="home">
    <NavBar />
    <v-container fluid>
      <div class="head">
        <v-row>
          <v-col cols="5">
            <div style="position: relative" class="mt-16">
              <h1 class="text-grey">Hello,</h1>
              <h1 class="text-white">We are Finder Home Community</h1>
              <span class="text-grey">Integration of Institutionalized Children</span><br />

              <v-btn tile dark class="text-yellow mt-8" variant="outlined" @click="scrollToContact">
                Contact Us
              </v-btn>
            </div>
          </v-col>
          <v-col cols="2">
            <div
              style="
                position: absolute;
                z-index: 9999;
                bottom: 0;
                margin-left: auto;
                margin-right: auto;
                left: 0;
                right: 0;
                text-align: center;
              "
              class="mt-16"
            >
              <v-icon>fas fa-angle-double-down</v-icon>
            </div>
          </v-col>
          <v-col cols="5">
            <div class="image-container">
              <v-img :src="i1" class="circular-image" contain></v-img>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-col cols="12" class="mt-16" id="about">
        <div>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="egg">
                <v-img :src="i2" class=""></v-img>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <h5 class="mt-16">Who Are We?</h5>
              <div style="width: 120px">
                <v-slider
                  v-model="slider2"
                  color="yellow"
                  label="We are Finder Home Community"
                ></v-slider>
              </div>
              <h4 class="mt-n4">Our Mission is to reconnect families</h4>
              <h4 class="">And make vulnerable children experience love again</h4>
              <p class="text-grey">
                Based on the Kenyan government's initiative to phase out children's homes, 
                Finder Home Organization was established to reconnect institutionalized children with their families through our web application, Finder Home.
              </p>
              <br />
              <p class="text-grey">
                Our web application enables families to provide information about missing children and facilitates the reconnection process. Our dedicated team works tirelessly to reunite families and ensure the well-being of vulnerable children.
              </p>
              <v-btn tile dark color="yellow" class="mt-4">
                Download Our Mission
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <div class="text-center mt-4">
        <h2>What We Do</h2>
        <div style="width: 120px; margin: 0 auto">
          <v-slider
            v-model="slider2"
            color="yellow"
            label="We aim to reconnect families and ensure a happier society"
          ></v-slider>
        </div>
      </div>
      <v-col cols="12" class="padd" id="mission">
        <div class="first" id="project">
          <v-row>
            <v-col cols="12" md="4">
              <div class="child">
                <v-btn
                  icon="fas fa-handshake"
                  color="#FBDF7E"
                  class="text-white"
                ></v-btn>
                <h3 class="ml-3 mt-4">Reconnect Families</h3>
                <p class="text-grey ml-3 mt-4 text-caption">
                  Facilitating the reconnection of institutionalized children with their families.
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="child">
                <v-btn
                  icon="fas fa-heartbeat"
                  color="#FBDF7E"
                  class="text-white"
                ></v-btn>
                <h3 class="ml-3 mt-4">Check Well-Being</h3>
                <p class="text-grey ml-3 mt-4 text-caption">
                  Monitoring the well-being of children after reintegration.
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="child">
                <v-btn
                  icon="fas fa-donate"
                  color="#FBDF7E"
                  class="text-white"
                ></v-btn>
                <h3 class="ml-3 mt-4">Provide Financial Support</h3>
                <p class="text-grey ml-3 mt-4 text-caption">
                  Offering financial assistance to support reintegrated children.
                </p>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </div>
      </v-col>
      <v-col cols="12" sm="12" id="services">
        <div class="d-flex justify-center mb-6">
          <v-btn color="#FBDF7E" class="mr-2">All</v-btn>
          <v-btn class="mr-2" variant="tonal">Reconnected Families</v-btn>
          <v-btn class="mr-2" variant="tonal">Community</v-btn>
          <v-btn class="mr-2" variant="tonal">Upcoming Projects</v-btn>
          <v-btn variant="tonal"> Illustration</v-btn>
        </div>
      </v-col>
      <v-col cols="12" class="imgHover">
        <v-row class="fill-height" align="center" justify="center">
          <template v-for="(item, i) in items" :key="i">
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :elevation="isHovering ? 12 : 2"
                  :class="{ 'on-hover': isHovering }"
                  v-bind="props"
                >
                  <v-img :src="item.img" height="225px" cover> </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </template>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="d-flex justify-center mb-6">
          <v-btn color="#FBDF7E" class="mt-4">Load More</v-btn>
        </div>
      </v-col>
      <v-col cols="12" id="testimonials">
        <div class="testimonials">
          <h2 class="mt-5">What Families Say</h2>
          <v-row>
            <!-- Testimonial 1 -->
            <v-col cols="12" sm="4">
              <v-card class="mx-auto my-3" max-width="344" height="">
                <v-img :src="i10" height="200px" cover></v-img>
                <v-card-title> Astonished </v-card-title>
                <v-card-subtitle>
                  By Jane Mutiso | 10 Jan 2024
                </v-card-subtitle>
                <v-card-text>
                  A friend of mine lost their child in 2010 after the child was playing in 
                  the estate. However recently while I was scrolling through Finder Home Website
                  I came across an image of the child and initiated the connection process which was 
                  successful. - Thank you Finder Home.
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Testimonial 2 -->
            <v-col cols="12" sm="4">
              <v-card class="mx-auto my-3" max-width="344" height="">
                <v-img :src="i11" height="200px" cover></v-img>
                <v-card-title> Forever Grateful </v-card-title>
                <v-card-subtitle>
                  By Mercy Njeri | 12 Feb 2024
                </v-card-subtitle>
                <v-card-text>
                  Back in the day my child was taken to a children's home 
                  after our house caught fire but after a few months of searching 
                  I was reconnected with him by the Finder Home Community. - God Bless You.
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Testimonial 3 -->
            <v-col cols="12" sm="4">
              <v-card class="mx-auto my-3" max-width="344" height="">
                <v-img :src="i12" height="200px" cover></v-img>
                <v-card-title> My Happiest Day </v-card-title>
                <v-card-subtitle>
                  By Oliver Otieno | 15 May 2024
                </v-card-subtitle>
                <v-card-text>
                  I had lost the whereabouts of my child in 2008 and I had
                  really exhausted all means of finding them but recently I was introduced to Finder
                  Home where they reconnected me with my lost child. - Thank You.
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>  
      <v-col cols="12" id="howtohelp">
        <div class="hire">
          <v-row>
            <v-col cols="12" sm="8">
              <h1 class="mt-9">Let Us Work Together</h1>
              <p class="text-grey">
                Your support can make a difference in the lives of vulnerable children. Join us in our mission to reconnect families and provide a brighter future.
              </p>
            </v-col>
            <v-col cols="12" sm="4">
              <div id="paypal-button-container"></div>
            </v-col>
          </v-row>
        </div>
      </v-col>      
      <v-col cols="12" sm="12" class="px-16" id="contact">
        <v-row>
          <v-col cols="12" sm="6" class="mb-4">
            <div class="child">
              <h1>Contact Info</h1>
              <v-btn
                icon="fas fa-map-marker-alt"
                color=""
                class="mt-10"
                variant="outlined"
                @click="openLocation"
              ></v-btn><br />
              <span class="text-caption">Nairobi, Kenya</span><br />
              <v-btn
                icon="fas fa-phone-alt"
                color=""
                class="mt-10"
                variant="outlined"
                @click="copyToClipboard('+2541234567', 'Phone number copied to clipboard')"
              ></v-btn><br />
              <span class="text-caption">+2541234567</span><br />
              <v-btn
                icon="fas fa-envelope"
                color=""
                class="mt-10"
                variant="outlined"
                @click="copyToClipboard('finderhome@gmail.com', 'Email address copied to clipboard')"
              ></v-btn><br />
              <span class="text-caption">finderhome@gmail.com</span><br />
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <h1 class="mt-8">Send Your Message</h1>
            <v-divider></v-divider>
            <span class="text-caption">
              For any inquiries on what we do or how you can be part of us, kindly fill the form and let us know how we can improve your user experience.
            </span>
            <v-row class="mt-10">
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  label="Name"
                  persistent-hint
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="phoneNumber"
                  label="Phone No"
                  persistent-hint
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="message"
                  label="Message"
                  persistent-hint
                  variant="outlined"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-btn color="#FBDF7E" class="mt-2" @click="submitInquiry">Submit Now</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
    <FooterView />
  </v-app>
</template>



<script>
import { defineComponent, ref } from "vue";
import NavBar from "../components/NavBar.vue";
import FooterView from "../components/FooterView.vue";
import i1 from "@/assets/i1.png";
import i2 from "@/assets/i2.png";
import i3 from "@/assets/i3.png";
import i4 from "@/assets/i4.png";
import i5 from "@/assets/i5.png";
import i6 from "@/assets/i6.png";
import i9 from "@/assets/i9.png";
import i8 from "@/assets/i8.png";
import i10 from "@/assets/i10.png";
import i11 from "@/assets/i11.png";
import i12 from "@/assets/i12.png";
import { getFirestore, addDoc, collection } from "firebase/firestore";

export default defineComponent({
  name: "HomeView",
  setup() {
    const db = getFirestore();
    const name = ref('');
    const phoneNumber = ref('');
    const message = ref('');

    const loadPaypalSdk = (callback) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AQm-T_k_iDWUG8UcV-NIO1sBpwAsPJMeoMRylJXtXqYowbhIb-QW85s5P0LZ-o7jeCSJ7xoMhJRuAfKN&components=buttons,marks&enable-funding=venmo,card`;
      script.onload = callback;
      document.head.appendChild(script);
    };

    const renderPaypalButtons = () => {
      paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '10.00'
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');
    };

    loadPaypalSdk(renderPaypalButtons);

    const openLocation = () => {
      window.open('https://www.google.com/maps?q=Nairobi,Kenya', '_blank');
    };

    const copyToClipboard = (text, message) => {
      navigator.clipboard.writeText(text).then(() => {
        alert(message);
      });
    };

    const scrollToContact = () => {
      const contactSection = document.getElementById('contact');
      contactSection.scrollIntoView({ behavior: 'smooth' });
    };

    const submitInquiry = async () => {
      try {
        await addDoc(collection(db, 'inquiries'), {
          name: name.value,
          phoneNumber: phoneNumber.value,
          message: message.value,
        });
        alert('Inquiry submitted successfully');
        name.value = '';
        phoneNumber.value = '';
        message.value = '';
      } catch (error) {
        console.error('Error submitting inquiry: ', error);
      }
    };

    return {
      i1,
      i2,
      i10,
      i11,
      i12,
      name,
      phoneNumber,
      message,
      openLocation,
      copyToClipboard,
      scrollToContact,
      submitInquiry,
      items: [
        { img: i3 },
        { img: i4 },
        { img: i5 },
        { img: i6 },
        { img: i9 },
        { img: i8 },
      ],
    };
  },
  components: {
    NavBar,
    FooterView
  },
});
</script>



<style scoped>
.v-container {
  padding: 16px 0 16px 0;
}

.head {
  position: relative;
  text-align: center;
  padding: 12px;
  margin-bottom: 6px;
  height: 400px;
  width: 100%;
  color: white;
  background-color: black; /* Ensure the background is black */
}
.head:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  background: black;
  transform: skew(0deg, 6deg);
}
.head:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 50%;
  background: black;
  transform: skew(0deg, -6deg);
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 9999;
  margin-top: 32px; /* Added spacing */
  padding: 16px; /* Added padding */
}

.circular-image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
}

.egg {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  width: 300px; /* Adjust width as needed */
  height: 300px; /* Adjust height as needed */
  background-color: #fbdf7e;
  border-radius: 50%; /* Make it a circle */
  overflow: hidden; /* Ensure the image stays within the circle */
  position: relative;
}

.egg img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the container */
  border-radius: 50%; /* Make the image fit the circle */
}

.first {
  width: 100%;
  height: 280px;
  text-align: center;
  padding: 2rem 2rem;
}

.child {
  display: inline-block;
  padding: 2rem 1rem;
  vertical-align: middle;
  text-align: center;
  margin-right: 8px;
}

.imgHover {
  padding: 0 200px;
}

.pre {
  width: 100%;
  height: 380px;
  text-align: center;
  padding: 0 200px;
  background-color: #f5f5f5;
}

.hire {
  width: 100%;
  height: 200px;
  padding: 0 200px;
  background-color: #e9e9e9;
  margin-top: -24px;
}

.footer {
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
}
</style>
