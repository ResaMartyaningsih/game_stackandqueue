/**
 * main.js
 * Bootstrap entry point for Daily Rush: Stack & Queue Adventure
 */

document.addEventListener('DOMContentLoaded', () => {
    // Start application
    App.init();

    // Log welcome info
    console.log("%c Daily Rush: Stack & Queue Adventure %c Ready! ", 
        "background: #0284c7; color: #fff; font-weight: bold; border-radius: 4px 0 0 4px; padding: 4px 8px;",
        "background: #10b981; color: #fff; font-weight: bold; border-radius: 0 4px 4px 0; padding: 4px 8px;");
});
