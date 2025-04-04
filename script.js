document.addEventListener("DOMContentLoaded", function () {
    // Ensure Firebase SDK is loaded before using it
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase SDK not loaded. Check script order in index.html.");
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

    // Initialize Firebase (Avoid multiple initializations)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Firestore Database Reference
    const db = firebase.firestore();
    console.log("✅ Firebase Initialized Successfully!");

    // Elements
    const totalItemsEl = document.getElementById("total-items");
    const totalValueEl = document.getElementById("total-value");
    const recentItemsTable = document.getElementById("recent-items-table");
    const searchInput = document.getElementById("search");
    const filterDropdown = document.getElementById("filter");

    let categoryChart = null; // Store chart instance

    // Load analytics data
    function loadAnalytics() {
        db.collection("inventory").get().then(snapshot => {
            let totalItems = 0;
            let totalValue = 0;
            let categoryData = {};

            snapshot.forEach(doc => {
                const item = doc.data();
                totalItems += item.quantity;
                totalValue += item.quantity * item.price;

                // Track category distribution
                if (categoryData[item.category]) {
                    categoryData[item.category] += item.quantity;
                } else {
                    categoryData[item.category] = item.quantity;
                }
            });

            totalItemsEl.textContent = totalItems;
            totalValueEl.textContent = `$${totalValue.toLocaleString()}`;

            console.log("📊 Category Data:", categoryData);

            // Check if categoryData is empty
            if (Object.keys(categoryData).length > 0) {
                renderCategoryChart(categoryData);
            } else {
                console.warn("⚠️ No data available for category distribution.");
            }
        });
    }

    // Load recent inventory items with filter
    function loadRecentItems(selectedCategory = "all") {
        let query = db.collection("inventory").orderBy("addedAt", "desc").limit(10);

        query.get().then(snapshot => {
            recentItemsTable.innerHTML = ""; // Clear old data
            snapshot.forEach(doc => {
                const item = doc.data();

                // Apply filter
                if (selectedCategory !== "all" && item.category !== selectedCategory) {
                    return;
                }

                const row = `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.type}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                        <td>${new Date(item.addedAt.toDate()).toLocaleString()}</td>
                    </tr>
                `;
                recentItemsTable.innerHTML += row;
            });
        });
    }

    // Render category distribution chart
    function renderCategoryChart(categoryData) {
        const ctx = document.getElementById("categoryChart").getContext("2d");

        // Destroy previous chart instance if it exists
        if (categoryChart) {
            categoryChart.destroy();
        }

        categoryChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    label: "Category Distribution",
                    data: Object.values(categoryData),
                    backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });

        console.log("✅ Chart Rendered Successfully!");
    }

    // Search function
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        const rows = recentItemsTable.getElementsByTagName("tr");

        for (let row of rows) {
            const itemName = row.getElementsByTagName("td")[0].textContent.toLowerCase();
            row.style.display = itemName.includes(searchText) ? "" : "none";
        }
    });

    // Filter function
    filterDropdown.addEventListener("change", function () {
        loadRecentItems(filterDropdown.value);
    });

    // Load data on page load
    loadAnalytics();
    loadRecentItems();
});
