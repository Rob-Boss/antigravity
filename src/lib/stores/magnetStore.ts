import { writable } from 'svelte/store';
import initialMagnets from '$lib/data/initialMagnets.json';

export interface Magnet {
    id: string;
    word: string;
    x: number;
    y: number;
    z: number;
    rotation: number;
}

function createMagnetStore() {
    const { subscribe, set, update } = writable<Magnet[]>([]);

    return {
        subscribe,
        initialize: () => {
            // Load pre-calculated magnets directly
            set(initialMagnets);
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

