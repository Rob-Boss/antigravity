import { writable, derived } from 'svelte/store';

export const images = [
    "/car-viewer/cool cars/320323059e18d10e4e0a50610a18af75.jpg",
    "/car-viewer/cool cars/5ab0c2cac90a5bf1d5cbba23b273c325.jpg",
    "/car-viewer/cool cars/a3f30952dad606e2a022ebec37643cc6.jpg",
    "/car-viewer/cool cars/ade9dcd92eea3f026ec8dc354d4eeb1a.jpg",
    "/car-viewer/cool cars/cfc6b75f9df2530aae2ae356d5606fdd.jpg",
    "/car-viewer/cool cars/d416275c58e6598da16769b2556d64e7.jpg",
    "/car-viewer/cool cars/dfc337e5cbe1ee7ecdd55fbc5caeb013.jpg",
];

export function createViewerStore() {
    const currentIndex = writable(0);
    const direction = writable(1); // 1 for right, -1 for left

    function nextImage() {
        direction.set(1);
        currentIndex.update(n => (n + 1) % images.length);
    }

    function prevImage() {
        direction.set(-1);
        currentIndex.update(n => (n - 1 + images.length) % images.length);
    }

    function selectRandomImage() {
        currentIndex.update(current => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * images.length);
            } while (newIndex === current && images.length > 1);

            // Random direction for fun
            direction.set(Math.random() > 0.5 ? 1 : -1);
            return newIndex;
        });
    }

    return {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage
    };
}
