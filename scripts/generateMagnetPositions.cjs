const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MANIFEST_PATH = path.join(__dirname, '../src/lib/data/fridgeManifest.ts');
const OUTPUT_PATH = path.join(__dirname, '../src/lib/data/initialMagnets.json');

function generateMagnets() {
    console.log('Reading manifest...');
    const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');

    // Extract the array using simple string manipulation/regex
    // Matches everything between "export const WORD_MANIFEST =" and the end, 
    // assuming it starts with [ and ends with ];
    const match = manifestContent.match(/WORD_MANIFEST\s*=\s*(\[\s*[\s\S]*?\]);/);

    if (!match) {
        console.error('Could not find WORD_MANIFEST in file');
        process.exit(1);
    }

    // Evaluate the array string to get the actual data
    // This is safe since we trust our own source code
    const WORD_MANIFEST = eval(match[1]);

    console.log(`Loaded ${WORD_MANIFEST.length} word entries.`);
    console.log('Generating magnet positions...');

    const magnets = [];

    // Helper to check collision
    const checkCollision = (x, y, width, height, existingMagnets) => {
        const padding = 0.01;
        for (const m of existingMagnets) {
            const mWidth = 0.02 + m.word.length * 0.02;
            const mHeight = 0.06;

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

    let totalAttempts = 0;
    let totalPlaced = 0;

    WORD_MANIFEST.forEach(item => {
        for (let i = 0; i < item.count; i++) {
            const width = 0.02 + item.word.length * 0.02;
            const height = 0.06;
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 500) {
                attempts++;
                totalAttempts++;

                const isFreezer = Math.random() > 0.7;
                let y;

                if (isFreezer) {
                    // Freezer range: 0.75 to 1.55
                    y = 0.75 + Math.random() * 0.7;
                } else {
                    // Fridge range: -1.6 to 0.6
                    y = -1.6 + Math.random() * 2.1;
                }

                const x = (Math.random() - 0.5) * 1.7;

                if (!checkCollision(x, y, width, height, magnets)) {
                    magnets.push({
                        id: crypto.randomUUID(),
                        word: item.word,
                        x: x,
                        y: y,
                        z: 0.56,
                        rotation: (Math.random() - 0.5) * 0.1
                    });
                    placed = true;
                    totalPlaced++;
                }
            }

            // Fallback
            if (!placed) {
                // console.warn(`Could not place word "${item.word}" after 500 attempts`);
                magnets.push({
                    id: crypto.randomUUID(),
                    word: item.word,
                    x: (Math.random() - 0.5) * 1.7,
                    y: Math.random() > 0.5 ? 0.75 + Math.random() * 0.7 : -1.6 + Math.random() * 2.1,
                    z: 0.56,
                    rotation: (Math.random() - 0.5) * 0.1
                });
                totalPlaced++;
            }
        }
    });

    console.log(`Placed ${totalPlaced} magnets with ${totalAttempts} total attempts.`);

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(magnets, null, 2));
    console.log(`Wrote magnets to ${OUTPUT_PATH}`);
}

generateMagnets();
