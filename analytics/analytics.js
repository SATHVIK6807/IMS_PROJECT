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

    // UI Elements
    const categoryCountList = document.getElementById("category-count");
    const topStockedList = document.getElementById("top-stocked");
    const inventoryValueDisplay = document.getElementById("inventory-value");
    const lowStockAlertsList = document.getElementById("low-stock-alerts");

    // Chart.js Elements
    let categoryChart, stockedChart;

    // Load Inventory Data
    db.collection("inventory").get().then(snapshot => {
        let categoryCounts = {};
        let totalValue = 0;
        let stockData = [];
        let lowStockItems = [];

        snapshot.forEach(doc => {
            const item = doc.data();
            const { category, quantity, price, name } = item;

            // 1️⃣ Count items per category
            categoryCounts[category] = (categoryCounts[category] || 0) + quantity;

            // 2️⃣ Track stock levels
            stockData.push({ name, quantity });

            // 3️⃣ Calculate total inventory value
            totalValue += quantity * price;

            // 4️⃣ Check for low stock items (threshold: 5)
            if (quantity < 5) {
                lowStockItems.push(`${name} (Only ${quantity} left)`);
            }
        });

        // Display total items per category
        categoryCountList.innerHTML = Object.entries(categoryCounts)
            .map(([category, count]) => `<li>${category}: ${count} items</li>`)
            .join("");

        // Identify the top 3 most stocked items
        stockData.sort((a, b) => b.quantity - a.quantity);
        topStockedList.innerHTML = stockData.slice(0, 3)
            .map(item => `<li>${item.name}: ${item.quantity} in stock</li>`)
            .join("");

        // Show total inventory value
        inventoryValueDisplay.textContent = `Total Inventory Value: $${totalValue.toFixed(2)}`;

        // Display low stock alerts
        lowStockAlertsList.innerHTML = lowStockItems.length > 0
            ? lowStockItems.map(item => `<li>${item}</li>`).join("")
            : "<li>✅ No low stock alerts</li>";

        // Render Charts
        renderCategoryChart(categoryCounts);
        renderStockedChart(stockData.slice(0, 3));
    }).catch(error => {
        console.error("❌ Error loading analytics:", error);
    });

    // 📊 Render Category Distribution Pie Chart
    function renderCategoryChart(categoryData) {
        const ctx = document.getElementById("categoryChart").getContext("2d");
        if (categoryChart) categoryChart.destroy();

        categoryChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: ["#778DA9", "#415A77", "#1B263B", "#E0E1DD"],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // 📊 Render Top Stocked Items Bar Chart
    function renderStockedChart(stockData) {
        const ctx = document.getElementById("stockedChart").getContext("2d");
        if (stockedChart) stockedChart.destroy();

        stockedChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: stockData.map(item => item.name),
                datasets: [{
                    label: "Stock Quantity",
                    data: stockData.map(item => item.quantity),
                    backgroundColor: "#1B263B",
                    borderColor: "#415A77",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }
});
