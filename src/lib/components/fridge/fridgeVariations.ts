export interface FridgeConfig {
    name: string;
    bodyColor: string;
    doorColor: string;
    handleColor: string;
    roughness: number;
    metalness: number;
    envMapIntensity?: number;
    radius?: number; // For rounded corners
    handleRadius?: number;
}

export const FRIDGE_VARIATIONS: FridgeConfig[] = [
    {
        name: "Classic Cream",
        bodyColor: "#f2e8d5",
        doorColor: "#fdfdd0",
        handleColor: "#cccccc",
        roughness: 0.4,
        metalness: 0.1,
        radius: 0.1,
        handleRadius: 0.01
    },
    {
        name: "Stainless Steel",
        bodyColor: "#888888",
        doorColor: "#a0a0a0",
        handleColor: "#555555",
        roughness: 0.2,
        metalness: 0.9,
        envMapIntensity: 1.5,
        radius: 0.05,
        handleRadius: 0.02
    },
    {
        name: "Retro Red",
        bodyColor: "#8a1c1c",
        doorColor: "#d92b2b",
        handleColor: "#eeeeee",
        roughness: 0.1,
        metalness: 0.3,
        radius: 0.25, // Very rounded
        handleRadius: 0.02
    },
    {
        name: "Matte Black",
        bodyColor: "#1a1a1a",
        doorColor: "#222222",
        handleColor: "#000000",
        roughness: 0.9,
        metalness: 0.1,
        radius: 0.02, // Sharp
        handleRadius: 0.01
    },
    {
        name: "Mint Green",
        bodyColor: "#98ff98",
        doorColor: "#b0ffb0",
        handleColor: "#ffffff",
        roughness: 0.5,
        metalness: 0.0,
        radius: 0.15,
        handleRadius: 0.02
    },
    {
        name: "Cyberpunk Neon",
        bodyColor: "#2b0057",
        doorColor: "#00ffcc", // Glowing door look via color
        handleColor: "#ff00ff",
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 2.0,
        radius: 0.05,
        handleRadius: 0.01
    },
    {
        name: "Rustic Wood",
        bodyColor: "#5c4033",
        doorColor: "#8b5a2b",
        handleColor: "#2e1e0f",
        roughness: 0.8,
        metalness: 0.0,
        radius: 0.05,
        handleRadius: 0.03
    },
    {
        name: "Frosted Glass",
        bodyColor: "#aaddff",
        doorColor: "#cceeff",
        handleColor: "#ffffff",
        roughness: 0.1,
        metalness: 0.5,
        envMapIntensity: 1.2,
        radius: 0.02,
        handleRadius: 0.01
    },
    {
        name: "Luxury Gold",
        bodyColor: "#b8860b",
        doorColor: "#ffd700",
        handleColor: "#daa520",
        roughness: 0.1,
        metalness: 1.0,
        envMapIntensity: 2.5,
        radius: 0.1,
        handleRadius: 0.02
    },
    {
        name: "Industrial Blue",
        bodyColor: "#2c3e50",
        doorColor: "#34495e",
        handleColor: "#7f8c8d",
        roughness: 0.6,
        metalness: 0.4,
        radius: 0.01, // Very sharp
        handleRadius: 0.01
    }
];
