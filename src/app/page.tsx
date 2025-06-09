"use client";

import { Section, Block } from "@/devlink/_Builtin";

export default function Home() {
  return (
    <>
      <Section
        tag="section"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
        }}
      >
        <Block tag="div" className="container">
          <Block
            tag="div"
            className="hero-split"
            style={{
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h1
              className="margin-bottom-24px"
              style={{
                fontSize: "3rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #dc2626, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "din-2014-narrow, sans-serif",
              }}
            >
              🏃‍♀️ Fitness Coach Chatbot
            </h1>
            <Block
              tag="p"
              className="margin-bottom-24px"
              style={{
                fontSize: "1.25rem",
                color: "#6b7280",
                fontFamily: "Droid Sans, sans-serif",
                lineHeight: "1.6",
              }}
            >
              Your AI-powered fitness companion, integrated with your Webflow site.
              Get personalized coaching based on your real fitness data and goals.
            </Block>

            <Block
              tag="div"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem",
                marginTop: "3rem",
                marginBottom: "3rem",
              }}
            >
              <Block
                tag="div"
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #fecaca",
                }}
              >
                <h3 style={{
                  fontFamily: "din-2014-narrow, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "#dc2626"
                }}>
                  💪 Context-Aware
                </h3>
                <p style={{
                  fontFamily: "Droid Sans, sans-serif",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  lineHeight: "1.5"
                }}>
                  Knows your goals, progress, and challenges for personalized coaching
                </p>
              </Block>

              <Block
                tag="div"
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #fecaca",
                }}
              >
                <h3 style={{
                  fontFamily: "din-2014-narrow, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "#dc2626"
                }}>
                  🎨 Brand Consistent
                </h3>
                <p style={{
                  fontFamily: "Droid Sans, sans-serif",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  lineHeight: "1.5"
                }}>
                  Matches your Webflow design system perfectly
                </p>
              </Block>

              <Block
                tag="div"
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #fecaca",
                }}
              >
                <h3 style={{
                  fontFamily: "din-2014-narrow, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "#dc2626"
                }}>
                  📱 Mobile Ready
                </h3>
                <p style={{
                  fontFamily: "Droid Sans, sans-serif",
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  lineHeight: "1.5"
                }}>
                  Responsive design that works on all devices
                </p>
              </Block>
            </Block>

            <Block
              tag="div"
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #fecaca",
                marginBottom: "2rem",
              }}
            >
              <h3 style={{
                fontFamily: "din-2014-narrow, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#dc2626"
              }}>
                🚀 Try It Now
              </h3>
              <p style={{
                fontFamily: "Droid Sans, sans-serif",
                color: "#6b7280",
                marginBottom: "1rem",
                lineHeight: "1.5"
              }}>
                Ready to start your fitness journey? Click the button below to chat with your personal fitness coach!
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                <a
                  href="/chat"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "linear-gradient(135deg, #dc2626, #ef4444)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontFamily: "din-2014-narrow, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 16px rgba(220, 38, 38, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(220, 38, 38, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(220, 38, 38, 0.3)";
                  }}
                >
                  💪 Start Chatting Now
                </a>
                <a
                  href="/activity-converter"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontFamily: "din-2014-narrow, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.3)";
                  }}
                >
                  📏 Activity Converter
                </a>
              </div>
              <p style={{
                fontFamily: "Droid Sans, sans-serif",
                color: "#dc2626",
                fontSize: "0.9rem",
                background: "#fef2f2",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid #fecaca",
                marginTop: "1rem"
              }}>
                <strong>Note:</strong> This is the UI demo. Add your OpenAI API key for intelligent responses!
              </p>
            </Block>
          </Block>
        </Block>
      </Section>


    </>
  );
}
