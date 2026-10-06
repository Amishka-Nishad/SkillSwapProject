import React from "react";
const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <span className="about-tag">ABOUT SKILLSWAP</span>

          <h1>
            Learn, Share & <span>Grow Together</span>
          </h1>

          <p>
            SkillSwap is a skill-sharing platform where people can connect,
            exchange knowledge, and learn new skills from each other.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="about-container about-grid">

          <div className="about-text">
            <span className="section-tag">WHO WE ARE</span>

            <h2>
              A community built around <span>learning</span>
            </h2>

            <p>
              SkillSwap makes it easier for people to discover useful skills
              and connect with others who are willing to share their knowledge.
            </p>

            <p>
              Instead of traditional learning methods, SkillSwap encourages
              users to learn from one another through skill exchanges,
              collaboration, and real conversations.
            </p>

            <p>
              Whether you want to teach a skill or learn something completely
              new, SkillSwap gives you a simple place to connect with the
              right people.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">↗</div>
            <h3>Learn From Others</h3>
            <p>
              Discover people with skills you want to learn and start
              meaningful skill exchanges.
            </p>
          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-container mission-content">
          <span className="about-tag">OUR MISSION</span>

          <h2>Making knowledge easier to share.</h2>

          <p>
            Our mission is to create a friendly community where everyone can
            teach, learn, collaborate, and grow together — regardless of their
            experience level.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <div className="about-container">

          <div className="features-heading">
            <span className="section-tag">WHY SKILLSWAP</span>
            <h2>Why people choose SkillSwap</h2>
          </div>

          <div className="features-grid">

            <div className="feature-box">
              <div className="feature-number">01</div>
              <h3>Discover Skills</h3>
              <p>
                Find interesting skills and people who can help you learn them.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-number">02</div>
              <h3>Share Knowledge</h3>
              <p>
                Share your own expertise and help someone else improve.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-number">03</div>
              <h3>Build Connections</h3>
              <p>
                Connect with like-minded people and build meaningful learning
                relationships.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;