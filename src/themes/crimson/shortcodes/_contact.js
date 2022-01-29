const { Form, Input, Textarea } = require("./_form");

function ContactForm({ uid, language }) {
    language = language || "de";
    const nameLabel = "Name";
    const mailLabel = language === "de" ? "E-Mail" : "Email";
    const messageLabel = language === "de" ? "Nachricht" : "Message";

    return Form(
        Input({ label: nameLabel, name: "private-name" })
        + Input({ label: mailLabel, name: "private-email", type: "email" })
        + Textarea({ label: messageLabel, name: "private-message" }),
        { uid, language });
}

module.exports = { ContactForm };
