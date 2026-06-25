export default function ContactForm() {
  const handleSendEmail = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch("/api/mailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      alert(data.error || "Email sent successfully!");
      console.log(data);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };
  return (
    <form onSubmit={handleSendEmail} className="space-y-2">
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input"
      />
      <textarea
        rows={3}
        name="message"
        placeholder="Message"
        required
        className="textarea"
      ></textarea>
      <button type="submit" className="btn btn-primary">
        Send Email
      </button>
    </form>
  );
}
