const { Form, Input, Textarea, HiddenInput } = require("./_form");

function ContactForm({ uid, language = "de" }) {
    const nameLabel = "Name";
    const mailLabel = language === "de" ? "E-Mail" : "Email";
    const captchaLabel = language === "de" ? "Bitte leer lassen" : "leave this field empty";
    const messageLabel = language === "de" ? "Nachricht" : "Message";
    const permalink = (this.ctx.development ? this.ctx.global.url.test : this.ctx.global.url.live) + this.page.url + "#form-" + uid.substring(0, 4);

    return Form({ uid, language },
        Input({ label: nameLabel, name: "private-name" }),
        Input({ label: mailLabel, name: "private-email", type: "email" }),
        Input({ label: captchaLabel, name: "private-captcha", type: "email", required: false, isHoneypot: true }),
        Textarea({ label: messageLabel, name: "private-message" }),
        HiddenInput({ name: "language", value: language }),
        HiddenInput({ name: "redirect", value: permalink }),
        HiddenInput({ name: "identification", value: permalink }),
    );
}

module.exports = { ContactForm };
