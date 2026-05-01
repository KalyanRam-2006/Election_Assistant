const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
    const msg = (req.body.message || "").toLowerCase();

    let reply = "Ask me about elections 😊 Try: registration, voting, documents, EVMs, or election process!";

    if (msg.includes("register")) {
        reply = "Visit the Election Commission of India website (https://www.eci.gov.in) to register as a voter.";
    } else if (msg.includes("documents") || msg.includes("id") || msg.includes("proof")) {
        reply = "You need ID proof like Aadhaar Card, Voter ID (EPIC), Passport, or Driving License.";
    } else if (msg.includes("vote") || msg.includes("voting")) {
        reply = "Carry your Voter ID (EPIC) and go to your assigned polling booth.";
    } else if (msg.includes("process") || msg.includes("steps")) {
        reply = "Steps: Registration → Nomination → Campaign → Voting → Results. Overseen by the Election Commission of India.";
    } else if (msg.includes("evm") || msg.includes("machine")) {
        reply = "India uses Electronic Voting Machines (EVMs) along with VVPAT for transparent elections.";
    } else if (msg.includes("age") || msg.includes("eligible")) {
        reply = "You must be 18 years or older on the qualifying date to be eligible to vote in India.";
    } else if (msg.includes("booth") || msg.includes("polling")) {
        reply = "Find your polling booth on the Election Commission portal or the Voter Helpline App.";
    }

    res.json({ reply });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));