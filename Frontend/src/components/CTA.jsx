import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

const CTA = () => {

  return (
    <>
      <section className="cta-section">

        <div className="container">

          <div className="cta-content">

            <p className="cta-tag">
              YOUR NEXT SKILL IS WAITING
            </p>

            <h2>
              Ready to exchange
              <span> your skills?</span>
            </h2>

            <p>
              Join SkillSwap and connect with people
              who want to learn what you know.
            </p>

            <button className="cta-btn">
              Join SkillSwap
              <FiArrowRight />
            </button>

          </div>

        </div>

      </section>
    </>
  )
}

export default CTA