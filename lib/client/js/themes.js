export const themes = {
    "Default": {
        gameBg: "rgb(24, 25, 26)",
        outline: "rgb(72, 74, 77)",
        cellBorder: "#ffffff",
        textColor: "rgb(185, 185, 185)",
        pillColors: ["#ff8a97", "#ffff87", "#7aa2ff"],
        virusColors: ["#eb6e6e", "#f5e56e", "#5988d4"]
    },
    "Grey": {
        gameBg: "rgb(24, 25, 26)",
        outline: "rgb(72, 74, 77)",
        cellBorder: "#ffffff",
        textColor: "rgb(185, 185, 185)",
        pillColors: ["#dedede", "#7a7a7a", "#2e2e2e"],
        virusColors: ["#dedede", "#7a7a7a", "#2e2e2e"]
    }
};

export function getSavedTheme() {
    let selectedTheme = localStorage.getItem("theme") || "Default";
    if (!themes[selectedTheme]) { // stored theme is invalid
        localStorage.setItem("theme", "Default")
        return "Default"
    }
    return selectedTheme;
}