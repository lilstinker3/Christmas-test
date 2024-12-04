const names = ["Sam", "Paul", "Clare", "Dad", "Mom", "Evan"];
const forbiddenPairs = [
    ["Paul", "Sam"],
    ["Evan", "Clare"],
    ["Dad", "Mom"],
];
let previousPairs = JSON.parse(localStorage.getItem("previousPairs")) || [];

function isValidPair(giver, receiver, pairs) {
    return (
        giver !== receiver && // Can't pair with themselves
        !forbiddenPairs.some(
            (forbidden) =>
                (giver === forbidden[0] && receiver === forbidden[1]) ||
                (giver === forbidden[1] && receiver === forbidden[0])
        ) &&
        !pairs.some(
            (pair) =>
                (pair[0] === giver && pair[1] === receiver) ||
                (pair[0] === receiver && pair[1] === giver)
        )
    );
}

function drawNames() {
    const remainingGivers = [...names];
    const remainingReceivers = [...names];
    const pairs = [];

    while (remainingGivers.length > 0) {
        const giver = remainingGivers.shift(); // Remove the first giver
        let receiver = null;

        // Try to find a valid receiver
        for (const candidate of remainingReceivers) {
            if (isValidPair(giver, candidate, pairs)) {
                receiver = candidate;
                break;
            }
        }

        if (!receiver) {
            // If no valid receiver is found, restart
            return drawNames();
        }

        // Pair the giver and receiver
        pairs.push([giver, receiver]);
        remainingReceivers.splice(remainingReceivers.indexOf(receiver), 1); // Remove the receiver
    }

    // Update the previous pairs and save to localStorage
    previousPairs = pairs;
    localStorage.setItem("previousPairs", JSON.stringify(previousPairs));
    return pairs;
}

document.getElementById("draw-button").addEventListener("click", () => {
    const pairs = drawNames();
    const pairsDiv = document.getElementById("pairs");
    pairsDiv.innerHTML = pairs.map((pair) => `<p>${pair[0]} 🎁 ${pair[1]}</p>`).join("");
    document.getElementById("message").textContent = "Six pairs successfully drawn!";
});
