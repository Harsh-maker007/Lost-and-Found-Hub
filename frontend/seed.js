import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNW5K9IflVblKL6AJcY7Hdhsqd4gEvFYs",
  authDomain: "lost-and-found-hub-dfdf2.firebaseapp.com",
  projectId: "lost-and-found-hub-dfdf2",
  storageBucket: "lost-and-found-hub-dfdf2.firebasestorage.app",
  messagingSenderId: "739896672619",
  appId: "1:739896672619:web:8e56fa0cbcf55f3e480c2e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dummyUser = {
  id: "dummy-user-123",
  name: "Harsh Shandilya",
};

const samplePosts = [
  {
    title: "Black Leather Wallet",
    description: "Lost my black leather wallet near Central Park. Contains my ID and some cards. Please contact if found!",
    type: "lost",
    category: "Wallets/Bags",
    location: "Central Park, NY",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    createdBy: dummyUser
  },
  {
    title: "Found Golden Retriever",
    description: "Found a very friendly Golden Retriever wandering around 5th Avenue. Has a red collar but no tag.",
    type: "found",
    category: "Pets",
    location: "5th Avenue, NY",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 50000000).toISOString(),
    createdBy: dummyUser
  },
  {
    title: "Apple AirPods Pro",
    description: "Found a pair of AirPods Pro in a white case on the subway (L train). Connect to them to verify they are yours.",
    type: "found",
    category: "Electronics",
    location: "L Train Subway",
    imageUrl: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=600&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 20000000).toISOString(),
    createdBy: dummyUser
  },
  {
    title: "Lost Blue Backpack",
    description: "I left my blue Jansport backpack in the library. Has my laptop and notebooks inside.",
    type: "lost",
    category: "Wallets/Bags",
    location: "City Library",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    createdBy: dummyUser
  }
];

async function seed() {
  console.log("Starting seeding...");
  try {
    for (const post of samplePosts) {
      await addDoc(collection(db, "posts"), post);
      console.log("Added post:", post.title);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding:", error);
  }
  process.exit();
}

seed();
