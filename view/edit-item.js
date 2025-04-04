document.addEventListener("DOMContentLoaded", function () {
    // Ensure Firebase is loaded
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK not loaded.");
        return;
    }

    console.log("✅ Firebase SDK loaded successfully.");

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCymHpF7TcGBrjgOOqj6qIX1Djl4TSm-38",
        authDomain: "inventorymanager-ac0b9.firebaseapp.com",
        projectId: "inventorymanager-ac0b9",
        storageBucket: "inventorymanager-ac0b9.firebasestorage.app",
        messagingSenderId: "950166134114",
        appId: "1:950166134114:web:b853b87b957da39506e03b"
      };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Firestore Reference
    const db = firebase.firestore();

    // Get Item ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get("id");

    if (!itemId) {
        alert("❌ No item ID found!");
        window.location.href = "view-item.html";
    }

    // Form Elements
    const editItemForm = document.getElementById("edit-item-form");
    const statusMessage = document.getElementById("status-message");

    // Populate Form with Existing Data
    db.collection("inventory").doc(itemId).get().then(doc => {
        if (doc.exists) {
            const item = doc.data();
            document.getElementById("name").value = item.name;
            document.getElementById("type").value = item.type;
            document.getElementById("category").value = item.category;
            document.getElementById("quantity").value = item.quantity;
            document.getElementById("price").value = item.price;
        } else {
            alert("❌ Item not found!");
            window.location.href = "view-item.html";
        }
    }).catch(error => {
        console.error("❌ Error fetching item:", error);
        alert("Error fetching item details!");
    });

    // Handle Form Submission (Update Item)
    editItemForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get Updated Values
        const name = document.getElementById("name").value;
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const quantity = parseInt(document.getElementById("quantity").value);
        const price = parseFloat(document.getElementById("price").value);

        // Validate Input
        if (!name || !type || !category || quantity <= 0 || price <= 0) {
            statusMessage.textContent = "❌ Please fill all fields correctly!";
            statusMessage.style.color = "red";
            return;
        }

        // Update Item in Firestore
        db.collection("inventory").doc(itemId).update({
            name,
            type,
            category,
            quantity,
            price
        }).then(() => {
            statusMessage.textContent = "✅ Item updated successfully!";
            statusMessage.style.color = "green";
            setTimeout(() => {
                window.location.href = "view-item.html"; // Redirect back
            }, 1500);
        }).catch(error => {
            console.error("❌ Error updating item:", error);
            statusMessage.textContent = "❌ Error updating item!";
            statusMessage.style.color = "red";
        });
    });
});
