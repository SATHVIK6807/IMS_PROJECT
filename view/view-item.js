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

    // Elements
    const inventoryTable = document.getElementById("inventory-table");
    const filterDropdown = document.getElementById("filter");

    // Load Inventory Items
    function loadInventoryItems(selectedCategory = "all") {
        let query = db.collection("inventory").orderBy("addedAt", "desc");

        query.get().then(snapshot => {
            inventoryTable.innerHTML = ""; // Clear previous data
            snapshot.forEach(doc => {
                const item = doc.data();
                const itemId = doc.id;

                // Apply filter
                if (selectedCategory !== "all" && item.category !== selectedCategory) {
                    return;
                }

                const row = `
                    <tr data-id="${itemId}">
                        <td>${item.name}</td>
                        <td>${item.type}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                        <td>${new Date(item.addedAt.toDate()).toLocaleString()}</td>
                        <td>
                            <a href="edit-item.html?id=${itemId}" class="edit-btn">Edit</a>
                            <button onclick="deleteItem('${itemId}')">Delete</button>
                        </td>
                    </tr>
                `;
                inventoryTable.innerHTML += row;
            });
        });
    }

    // Filter function
    filterDropdown.addEventListener("change", function () {
        loadInventoryItems(filterDropdown.value);
    });

    // Delete Item Function
    window.deleteItem = function (itemId) {
        if (confirm("Are you sure you want to delete this item?")) {
            db.collection("inventory").doc(itemId).delete().then(() => {
                alert("Item deleted successfully!");
                loadInventoryItems(filterDropdown.value); // Refresh list
            }).catch(error => {
                console.error("❌ Error deleting item:", error);
                alert("Error deleting item!");
            });
        }
    };

    // Load data on page load
    loadInventoryItems();
});
