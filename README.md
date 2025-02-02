<img width="542" alt="image" src="https://github.com/user-attachments/assets/b1af3d86-4792-4883-8af2-b8b6ff1c5a19" /># ⚡ Lightning Network ↔ XRPL Bridge  

<img width="542" alt="image" src="https://github.com/user-attachments/assets/1725dec9-769a-4649-8f32-d92ccaf3522b" />

## 🌉 **Why we built this bridge**  
Currently, there are **no reliable decentralized solutions** for swapping **Bitcoin (BTC) <> XRP**—the only remaining option is centralized exchanges (**CEXs**), which require trust, KYC, and custodial risks.  

To solve this, we created **a simple and efficient bridge** that allows users to swap BTC and XRP using:  
✔ **Lightning Network** for fast, low-fee BTC transactions.  
✔ **XRPL (XRP Ledger)** for seamless XRP settlements.  

Our goal is to **eliminate reliance on CEXs** and provide a **trust-minimized, decentralized, and efficient** way to move between **Bitcoin and XRP** networks.  

---

## **How it works**  

1️⃣ **Send BTC via Lightning Network (LN)**  
Users generate a **Lightning invoice** and send BTC.  

2️⃣ **Bridge processes the swap**  
The bridge detects the payment and **initiates an XRPL transaction**.  

3️⃣ **Receive XRP in your wallet**  
Once confirmed, the bridge **automatically delivers XRP** to your provided address.  

4️⃣ **Swap XRP to BTC**  
Users can send **XRP to the bridge** and receive **BTC via Lightning** instantly.  

** 🚀 Fully automated, fast, and low-cost.**  

---

## ⚙️ **Tech Stack**
🟣 **Frontend:** Vue 3 + TailwindCSS + Nuxt UI  
⚡ **Bitcoin Payments:** Lightning Network (LND)  
💎 **XRP Payments:** XRPL (Ripple API)  
📡 **Data API:** CoinGecko (real-time BTC/XRP price feed)  
🔌 **Backend:** Node.js + Express  

---

## 🛠️ **Setup & Run**
### **1️⃣ Clone the repo**
```sh
git clone https://github.com/mathisrgt/ln-xrpl-bridge.git
cd ln-xrpl-bridge
```

### **2️⃣ Install dependencies**
```sh
npm install
```

### **3️⃣ Start the back-end**
```sh
node server.js
```

### **4️⃣ Start the front-end**
```sh
npm run dev
```

🚀 **Now open `http://localhost:3000` to use the bridge.**  

---

## 🔒 **Security & Trust**
✅ **Non-Custodial** – You control your funds.  
✅ **Decentralized Routing** – No intermediaries, direct swaps.  
✅ **Lightning Fast Transactions** – Thanks to **LN & XRPL**.  

We believe in **true decentralization**, and this project is our step toward a **better BTC-XRP ecosystem**.  

---

## 🤝 **Contributions & Support**
We welcome contributions! Feel free to:  
- Open a **Pull Request** for improvements.  
- Report **issues or suggestions** in GitHub Issues.
