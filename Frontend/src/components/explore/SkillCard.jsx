import React from 'react'

import {
  FiArrowUpRight,
  FiStar,
  FiUsers
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'


const SkillCard = ({
  skill,
  category,
  description,
  name,
  rating,
  learners,
  initial
}) => {

  const navigate = useNavigate()


  /* =========================
      VIEW SKILL
  ========================= */

  const handleViewSkill = () => {

    navigate(
      `/dashboard/skill-details?skill=${encodeURIComponent(skill)}`
    )

  }


  return (

    <div className="skill-card">


      {/* =========================
          TOP SECTION
      ========================= */}

      <div className="skill-card-top">

        <div className="skill-card-icon">
          {initial}
        </div>

        <span className="skill-category">
          {category}
        </span>

      </div>


      {/* =========================
          SKILL INFORMATION
      ========================= */}

      <div className="skill-card-content">

        <h3>
          {skill}
        </h3>

        <p>
          {description}
        </p>

      </div>


      {/* =========================
          TEACHER
      ========================= */}

      <div className="skill-teacher">

        <div className="teacher-avatar">
          {name ? name.charAt(0).toUpperCase() : 'S'}
        </div>

        <div className="teacher-info">

          <span>
            Taught by
          </span>

          <strong>
            {name}
          </strong>

        </div>

      </div>


      {/* =========================
          RATING
      ========================= */}

      <div className="skill-card-meta">

        <div className="skill-rating">

          <FiStar />

          <span>
            {rating}
          </span>

        </div>


        <div className="skill-learners">

          <FiUsers />

          <span>
            {learners} learners
          </span>

        </div>

      </div>


      {/* =========================
          VIEW SKILL
      ========================= */}

      <button
        className="skill-view-btn"
        onClick={handleViewSkill}
      >

        <span>
          View Skill
        </span>

        <FiArrowUpRight />

      </button>


    </div>

  )
}


export default SkillCard