document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK not loaded.");
        return;
    }

    console.log("✅ Firebase SDK loaded successfully.");

    const firebaseConfig = {
        apiKey: "AIzaSyCymHpF7TcGBrjgOOqj6qIX1Djl4TSm-38",
        authDomain: "inventorymanager-ac0b9.firebaseapp.com",
        projectId: "inventorymanager-ac0b9",
        storageBucket: "inventorymanager-ac0b9.firebasestorage.app",
        messagingSenderId: "950166134114",
        appId: "1:950166134114:web:b853b87b957da39506e03b"
      };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();
    const addItemForm = document.getElementById("add-item-form");
    const statusMessage = document.getElementById("status-message");

    addItemForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const itemId = document.getElementById("item-id").value.trim();
        const name = document.getElementById("name").value;
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const quantity = parseInt(document.getElementById("quantity").value);
        const price = parseFloat(document.getElementById("price").value);

        if (!itemId || !name || !type || !category || quantity <= 0 || price <= 0) {
            statusMessage.textContent = "❌ Please fill all fields correctly!";
            statusMessage.style.color = "red";
            return;
        }

        // Check if the ID already exists
        db.collection("inventory").doc(itemId).get().then((doc) => {
            if (doc.exists) {
                statusMessage.textContent = "❌ Item ID already exists. Choose a different one.";
                statusMessage.style.color = "red";
            } else {
                // Add item to Firestore with the given ID
                db.collection("inventory").doc(itemId).set({
                    id: itemId,
                    name,
                    type,
                    category,
                    quantity,
                    price,
                    addedAt: firebase.firestore.Timestamp.now()
                }).then(() => {
                    statusMessage.textContent = "✅ Item added successfully!";
                    statusMessage.style.color = "green";
                    addItemForm.reset();
                }).catch(error => {
                    console.error("❌ Error adding item:", error);
                    statusMessage.textContent = "❌ Error adding item!";
                    statusMessage.style.color = "red";
                });
            }
        });
    });
});
