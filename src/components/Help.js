import React, { useState } from "react";

export default function Help() {
  const [activeTab, setActiveTab] = useState("faq"); // "faq" or "about"

  const faqs = [
    {
      question: "What is SnoRelax?",
      answer:
        "SnoRelax is a mental wellness and community platform designed to help you manage stress, track your mood, connect with others, and access mental health support through an AI chatbot.",
    },
    {
      question: "How do I use the Chatbot?",
      answer:
        "Go to the Chat tab to talk with SnoBot. You can type messages or use voice input (click the microphone icon). The bot supports multiple languages and can answer questions about mental wellness.",
    },
    {
      question: "How does Mood Tracking work?",
      answer:
        "Go to the Mood Tracker to log how you're feeling. You can select your current mood and optionally add notes. Your mood history is saved and helps track patterns over time.",
    },
    {
      question: "How do I join a community group?",
      answer:
        "Go to the Community tab to see all available groups. Click 'Join' on any group that interests you. You can then participate in anonymous group chats using your community nickname.",
    },
    {
      question: "What does anonymous messaging mean?",
      answer:
        "When you join a group, you appear with a community nickname instead of your real name. This maintains your privacy while allowing meaningful conversations. You can edit your nickname in your Profile.",
    },
    {
      question: "Can I create my own group?",
      answer:
        "Yes! In the Community tab, use the 'Create New Group' form. As the admin, you can set the group name, description, and maximum members. You'll be the first member automatically.",
    },
    {
      question: "Can I leave a group?",
      answer:
        "Yes, you can leave any group you've joined (except if you're the admin and it's the only member). Simply find the group and click 'Leave' or use the leave option in the group details.",
    },
    {
      question: "How do I change my community nickname?",
      answer:
        "Go to your Profile (usually in settings or top menu). Find 'Community Nickname' section and click 'Edit Nickname'. You can set any nickname from 3-20 characters (letters, numbers, spaces, emojis). Click 'Save' to apply.",
    },
    {
      question: "What are message violations?",
      answer:
        "We have community guidelines to ensure a safe space for everyone. Violations include harassment, abuse, spam, or inappropriate content. Following these guidelines helps maintain a positive community.",
    },
    {
      question: "Can I delete my messages?",
      answer:
        "Yes! In group chats, you can delete your own messages by clicking the delete button (X) on your message. Group admins can also delete any message that violates community guidelines.",
    },
    {
      question: "Is my data private?",
      answer:
        "Your personal information (name, email, phone) is kept private and secure. Only your community nickname is visible in group chats. Your mood tracking data is also private and only visible to you.",
    },
    {
      question: "How do I contact support?",
      answer:
        "For issues or questions, you can use the Help section in the app or contact our support team through the feedback form. We're here to help!",
    },
  ];

  const aboutSections = [
    {
      title: "About SnoRelax",
      content:
        "SnoRelax is a comprehensive mental wellness platform designed to support individuals on their journey to better mental health. We combine AI-powered chatbot support, community connection, and mood tracking tools to create a holistic wellness experience.",
    },
    {
      title: "Our Mission",
      content:
        "Our mission is to make mental health support accessible, affordable, and stigma-free. We believe that everyone deserves access to resources that help them understand, manage, and improve their mental wellbeing.",
    },
    {
      title: "Key Features",
      content: `
• AI Chatbot: Talk with SnoBot anytime for mental wellness support
• Mood Tracking: Log your emotions and track patterns over time
• Community Groups: Connect with others in safe, anonymous spaces
• Multi-language Support: Available in multiple languages
• Voice Input: Speak to the chatbot naturally
• Real-time Messaging: Instant communication in community groups
      `,
    },
    {
      title: "Community Guidelines",
      content: `
We maintain a safe and respectful community by following these guidelines:
• Be respectful and kind to others
• No harassment, abuse, or discrimination
• No spam or promotional content
• Respect others' privacy and anonymity
• Report violations to our moderation team
• Mental health is not a substitute for professional help - seek professional care when needed
      `,
    },
    {
      title: "Privacy & Security",
      content: `
Your privacy is our priority:
• Your personal information is encrypted and secure
• Community nicknames are anonymous - your real identity is hidden
• Mood data is private and only visible to you
• We don't share your data with third parties
• You can review our full privacy policy in the settings
      `,
    },
    {
      title: "How It Started",
      content:
        "SnoRelax was created with a vision to bridge the gap between those seeking mental health support and the resources available to them. We started with a simple idea: make mental wellness accessible to everyone, everywhere.",
    },
  ];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30, fontSize: 32, color: "#333" }}>
        Help & Support
      </h1>

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 24,
          borderBottom: "2px solid #ddd",
          background: "white",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setActiveTab("faq")}
          style={{
            flex: 1,
            padding: "16px 24px",
            background: activeTab === "faq" ? "#4a90e2" : "#f9f9f9",
            color: activeTab === "faq" ? "white" : "#333",
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: "600",
            borderBottom: activeTab === "faq" ? "3px solid #2e5db8" : "none",
            transition: "all 0.3s ease",
          }}
        >
          📚 FAQ - How to Use Modules
        </button>
        <button
          onClick={() => setActiveTab("about")}
          style={{
            flex: 1,
            padding: "16px 24px",
            background: activeTab === "about" ? "#4a90e2" : "#f9f9f9",
            color: activeTab === "about" ? "white" : "#333",
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: "600",
            borderBottom: activeTab === "about" ? "3px solid #2e5db8" : "none",
            transition: "all 0.3s ease",
          }}
        >
          ℹ️ About This App
        </button>
      </div>

      {/* Content */}
      <div style={{ background: "white", borderRadius: "0 0 8px 8px", padding: 24 }}>
        {activeTab === "faq" ? (
          <div>
            <h2 style={{ marginBottom: 20, fontSize: 24, color: "#333" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "grid", gap: 16 }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    background: "#f9f9f9",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#4a90e2",
                    }}
                  >
                    ❓ {faq.question}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#666", lineHeight: 1.6 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: 20, fontSize: 24, color: "#333" }}>About SnoRelax</h2>
            <div style={{ display: "grid", gap: 20 }}>
              {aboutSections.map((section, idx) => (
                <div key={idx}>
                  <h3 style={{ marginBottom: 10, fontSize: 18, color: "#4a90e2", fontWeight: "bold" }}>
                    {section.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "#666",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: "#e8f4f8",
                  borderLeft: "4px solid #4a90e2",
                  borderRadius: 4,
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#4a90e2" }}>Important Note</h4>
                <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                  SnoRelax is a supportive tool, not a substitute for professional mental health care.
                  If you're experiencing a mental health crisis, please contact a healthcare professional
                  or call a crisis helpline in your area immediately.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          textAlign: "center",
          color: "#999",
          fontSize: 12,
        }}
      >
        <p>
          Need more help? Contact our support team or check back for updates and new features.
        </p>
        <p>© 2025 SnoRelax. All rights reserved.</p>
      </div>
    </div>
  );
}
