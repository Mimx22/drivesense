# 🚗 DriveSense

![DriveSense Live App](https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=netlify) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**[👉 View the Live Application Here](https://mimx22-drivesense-app.netlify.app)**

---

## 📖 The "Layman's" Explanation

Imagine you own a car, or maybe a whole business with multiple delivery vans. Keeping track of where those cars are going and how much money is being burned on fuel is usually a stressful guessing game. You give a driver cash for gas, and you just have to *hope* they aren't taking long detours, getting stuck in traffic, or wasting it. 

**DriveSense is like having a super-smart co-pilot that lives on your phone or computer.** It eliminates all the guesswork. 

Here is exactly what it does in 3 simple steps:

### 1. The Fuel Estimator (No More Guessing)
Before you even turn the car key, you type in where you are going (for example, "From the Office to the Airport"). DriveSense instantly looks at the actual roads, considers how heavy the traffic is, checks if you're running the Air Conditioning, and then tells you **exactly how much fuel you will burn and how much it will cost.**

### 2. The Live Map
You can open the app and look at a live map that actually shows your car moving along the streets. Instead of just a generic map, it also flags things that matter—like if the car hit the brakes way too hard or was speeding at a certain spot.

### 3. The Money-Saving 'Scoreboard'
At the end of the week or month, DriveSense takes all those trips and turns them into very simple, colorful charts. You can see at a glance if you are spending too much on fuel this month compared to last month, or if your drivers are taking bad routes. 

**In short:** The app connects to the real-world map to track where you are going, calculates exactly how much fuel it should cost you before you even leave, and puts all your driving history onto one beautiful screen so you can save money!

---

## 🛠 Features & Technology Highlights

DriveSense is a modern, responsive Single Page Application (SPA) designed to empower drivers with smart telemetry, trip mapping, and intelligent fuel consumption tracking.

- **Dynamic Cross-Page Routing Synchronization:** Input your trip in the Fuel log, and watch the Live Map instantly trace the full street-to-street geometry over CartoDB maps using OSRM APIs.
- **Smart Fuel Analytics Engine:** Built-in algorithms that adjust predicted fuel usage based on High/Low Traffic settings and AC consumption multipliers.
- **Real-Time Fleet Dashboards:** Modern, interactive SaaS-inspired statistics dashboards styled with Tailwind CSS and Framer Motion for superior UX.
- **Cloud Linked:** Connects seamlessly with Firebase Firestore for persistent trip logging and aggregation.

## 🚀 Quick Start (Development)

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/mimx22/drivesense.git

# Navigate into the project directory
cd drivesense

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser to see the app running locally!
