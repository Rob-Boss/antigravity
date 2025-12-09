/* eslint-disable */
// Sequencer Scheduler Worker

let timerID: number | undefined;
let interval = 25; // ms
let currentStep = 0;
let nextNoteTime = 0;
let tempo = 120;
let sequence: any[] = [];
let lookahead = 0.1; // seconds

self.onmessage = function (e) {
    if (e.data === "start") {
        timerID = setInterval(function () {
            // This loop runs in the worker thread
            postMessage("tick");
        }, interval);
    } else if (e.data.type === "init") {
        // Initialize state
        sequence = e.data.sequence || [];
        tempo = e.data.tempo || 120;
        currentStep = 0;
        // Reset nextNoteTime? 
        // No, main thread manages AudioContext.currentTime, but we need to know when to start?
        // Actually, the main thread should tell us "run scheduler" and provide current AudioTime?
        // STRATEGY:
        // The worker is just a "tick" generator that is rock solid?
        // OR the worker holds the logic?
        // The plan said: "Manage the state of sequence, tempo, currentStep, and nextNoteTime"
    } else if (e.data.type === "config") {
        if (e.data.tempo) tempo = e.data.tempo;
        if (e.data.sequence) sequence = e.data.sequence;
    } else if (e.data === "stop") {
        clearInterval(timerID);
        timerID = undefined;
    }
};

// Re-evaluating strategy:
// If Worker manages "nextNoteTime", it needs to know "currentTime".
// But "currentTime" is on the main thread (AudioContext).
// We can't access AudioContext here.
// OPTION A: Main thread sends "currentTime" every tick? No, defeats purpose.
// OPTION B: Worker just sends a "tick" message every X ms, acting as a rock-solid setInterval?
//    This is the "metronome" approach. Main thread handles the logic in onmessage.
//    This isolates the *trigger* from main thread layout jank, BUT main thread still has to execute logic.
//    If main thread is blocked, the onmessage handler is also blocked?
//    YES. If main thread is blocked, worker messages pile up.
//
// However, the issue is often that `setTimeout` on main thread is throttled/delayed by layout.
// Worker `setInterval` is NOT throttled by main thread layout.
// So sending messages is better.
//
// Improved Strategy:
// The Worker acts as the Scheduler Loop.
// It keeps its OWN time? No, it needs to sync with AudioContext.
//
// Standard approach for "Tale of Two Clocks":
// The Worker runs a setInterval (e.g. 25ms).
// Inside that interval, it sends a "tick" message to Main Thread.
// Main Thread receives "tick", checks `ctx.currentTime`, and schedules notes.
//
// WAIT. If Main Thread is blocked for 100ms, the "tick" message handler is delayed 100ms.
// If we schedule 0.1s ahead, and we are blocked for 0.1s, we glitch.
//
// Can we move MORE logic here?
// We don't have AudioContext.
//
// Let's implement the "Metronome" pattern first.
// The Worker simply ticks. 
// "tick" -> Main Thread -> Scheduler().
// This is exactly what we had before (`setTimeout` loop), but now the loop driver is offline.
// This prevents `setTimeout` clamping/throttling by the browser when the tab is backgrounded (though it's foreground here)
// or when the main thread is busy?
// Actually, `setInterval` on Main Thread is subject to jank. `setInterval` in Worker is not.
// But the *delivery* of the message is subject to Main Thread availability.
//
// So we must schedule FARTHER ahead to tolerate main thread blocks?
// Or we just rely on Worker being more consistent.
//
// Let's implement the worker as a simple ticker first, as that is the standard pattern.

// Redefining based on "Metronome" pattern
// Worker sends "tick" every `interval` ms.

self.onmessage = function (e) {
    if (e.data === "start") {
        // clear just in case
        if (timerID) clearInterval(timerID);
        timerID = setInterval(function () {
            postMessage("tick");
        }, interval);
    } else if (e.data === "stop") {
        clearInterval(timerID);
        timerID = undefined;
    } else if (e.data && e.data.interval) {
        interval = e.data.interval;
        if (timerID) {
            clearInterval(timerID);
            timerID = setInterval(function () {
                postMessage("tick");
            }, interval);
        }
    }
};
