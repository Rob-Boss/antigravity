import { writable } from 'svelte/store';

export interface Magnet {
    id: string;
    word: string;
    x: number;
    y: number;
    z: number;
    rotation: number;
}

import { WORD_MANIFEST } from '$lib/data/fridgeManifest';

function createMagnetStore() {
    const { subscribe, set, update } = writable<Magnet[]>([]);

    return {
        subscribe,
        initialize: () => {
            const magnets: Magnet[] = [];

            // Helper to check collision
            const checkCollision = (x: number, y: number, width: number, height: number, existingMagnets: Magnet[]) => {
                const padding = 0.01; // Reduced padding
                for (const m of existingMagnets) {
                    const mWidth = 0.02 + m.word.length * 0.02;
                    const mHeight = 0.06;

                    // Simple AABB collision
                    if (
                        x < m.x + mWidth + padding &&
                        x + width + padding > m.x &&
                        y < m.y + mHeight + padding &&
                        y + height + padding > m.y
                    ) {
                        return true;
                    }
                }
                return false;
            };

            WORD_MANIFEST.forEach(item => {
                for (let i = 0; i < item.count; i++) {
                    const width = 0.02 + item.word.length * 0.02;
                    const height = 0.06;
                    let placed = false;
                    let attempts = 0;

                    while (!placed && attempts < 500) {
                        attempts++;

                        // Randomly assign to Freezer (top) or Fridge (bottom)
                        // Freezer Door: y ~ 1.15, height 0.9 -> range [0.75, 1.55]
                        // Fridge Door: y ~ -0.5, height 2.4 -> range [-1.6, 0.6]

                        const isFreezer = Math.random() > 0.7;
                        let y;

                        if (isFreezer) {
                            // Freezer range: 0.75 to 1.55
                            y = 0.75 + Math.random() * 0.7; // Reduced range slightly to avoid edges
                        } else {
                            // Fridge range: -1.6 to 0.6
                            y = -1.6 + Math.random() * 2.1;
                        }

                        const x = (Math.random() - 0.5) * 1.7; // Width spread [-0.85, 0.85]

                        if (!checkCollision(x, y, width, height, magnets)) {
                            magnets.push({
                                id: crypto.randomUUID(),
                                word: item.word,
                                x: x,
                                y: y,
                                z: 0.56,
                                rotation: (Math.random() - 0.5) * 0.1 // Reduced rotation
                            });
                            placed = true;
                        }
                    }

                    // If not placed after 50 attempts, place it anyway (fallback)
                    if (!placed) {
                        magnets.push({
                            id: crypto.randomUUID(),
                            word: item.word,
                            x: (Math.random() - 0.5) * 1.7,
                            y: Math.random() > 0.5 ? 0.75 + Math.random() * 0.7 : -1.6 + Math.random() * 2.1,
                            z: 0.56,
                            rotation: (Math.random() - 0.5) * 0.1
                        });
                    }
                }
            });

            set(magnets);
        },
        updatePosition: (id: string, x: number, y: number, z?: number) => {
            update(magnets => {
                const magnet = magnets.find(m => m.id === id);
                if (magnet) {
                    // Constrain to door surfaces
                    // Width: -0.9 to 0.9
                    const clampedX = Math.max(-0.9, Math.min(0.9, x));

                    // Height: Split between fridge and freezer
                    // Fridge: -1.6 to 0.6
                    // Freezer: 0.75 to 1.55
                    // Gap: 0.6 to 0.75
                    // Removed snapping logic to allow smooth drag across gap

                    let clampedY = y;

                    // If below fridge
                    if (y < -1.6) {
                        clampedY = -1.6;
                    }
                    // If above freezer
                    else if (y > 1.55) {
                        clampedY = 1.55;
                    }

                    magnet.x = clampedX;
                    magnet.y = clampedY;
                    // Only update Z if provided (e.g. for initialization), otherwise keep existing
                    if (z !== undefined) magnet.z = z;
                }
                return magnets;
            });
        },
        bringToFront: (id: string) => {
            update(magnets => {
                const magnet = magnets.find(m => m.id === id);
                if (magnet) {
                    // Find highest Z
                    const maxZ = Math.max(...magnets.map(m => m.z));
                    // Place slightly in front
                    // Reduced offset now that depth testing is fixed
                    magnet.z = maxZ + 0.001;

                    // Initialize dragging state
                    draggingMagnet.set({ ...magnet });
                }
                return magnets;
            });
        },
        // Transient store for drag updates to avoid re-rendering all magnets
        draggingMagnet: { subscribe: draggingMagnet.subscribe },
        updateDragPosition: (x: number, y: number) => {
            draggingMagnet.update(m => {
                if (!m) return null;

                // Constrain to door surfaces
                const clampedX = Math.max(-0.9, Math.min(0.9, x));
                let clampedY = y;
                if (y < -1.6) clampedY = -1.6;
                else if (y > 1.55) clampedY = 1.55;

                return { ...m, x: clampedX, y: clampedY };
            });
        },
        commitDrag: () => {
            let finalMagnet: Magnet | null = null;
            // Get current drag state
            const unsubscribe = draggingMagnet.subscribe(m => { finalMagnet = m; });
            unsubscribe();

            if (finalMagnet) {
                update(magnets => {
                    const m = magnets.find(mag => mag.id === finalMagnet!.id);
                    if (m) {
                        m.x = finalMagnet!.x;
                        m.y = finalMagnet!.y;
                        m.z = finalMagnet!.z;
                    }
                    return magnets;
                });
            }
            draggingMagnet.set(null);
        }
    };
}

// Create the transient store outside to be accessible
const draggingMagnet = writable<Magnet | null>(null);

export const magnetStore = createMagnetStore();
