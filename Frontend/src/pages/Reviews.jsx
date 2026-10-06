import React, { useEffect, useState } from 'react'

import {
  FiStar,
  FiMessageCircle,
  FiEdit3
} from 'react-icons/fi'

import Swal from 'sweetalert2'


const Reviews = () => {

  const [showReviewForm, setShowReviewForm] =
    useState(false)

  const [selectedRating, setSelectedRating] =
    useState(0)

  const [reviewText, setReviewText] =
    useState('')

  const [reviews, setReviews] =
    useState([])

  const [partners, setPartners] =
    useState([])

  const [selectedPartner, setSelectedPartner] =
    useState('')

  const [averageRating, setAverageRating] =
    useState(0)

  const [reviewCount, setReviewCount] =
    useState(0)

  const [breakdown, setBreakdown] =
    useState({
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    })

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)


  // =========================
  // FETCH REVIEWS
  // =========================

  useEffect(() => {

    const fetchReviews = async () => {

      const token =
        localStorage.getItem('token')


      if (!token) {

        window.location.href =
          '/login'

        return

      }


      try {

        const [
          reviewsResponse,
          statsResponse,
          partnersResponse
        ] = await Promise.all([

          fetch(
            'http://localhost:5000/api/reviews',
            {
              headers: {
                'Authorization':
                  `Bearer ${token}`
              }
            }
          ),

          fetch(
            'http://localhost:5000/api/reviews/stats',
            {
              headers: {
                'Authorization':
                  `Bearer ${token}`
              }
            }
          ),

          fetch(
            'http://localhost:5000/api/reviews/partners',
            {
              headers: {
                'Authorization':
                  `Bearer ${token}`
              }
            }
          )

        ])


        // =========================
        // SESSION EXPIRED
        // =========================

        if (
          reviewsResponse.status === 401 ||
          statsResponse.status === 401 ||
          partnersResponse.status === 401
        ) {

          localStorage.removeItem(
            'token'
          )

          localStorage.removeItem(
            'user'
          )

          await Swal.fire({

            icon: 'error',

            title:
              'Session Expired',

            text:
              'Please login again.',

            confirmButtonText:
              'Go to Login'

          })


          window.location.href =
            '/login'

          return

        }


        const reviewsData =
          await reviewsResponse.json()

        const statsData =
          await statsResponse.json()

        const partnersData =
          await partnersResponse.json()


        // =========================
        // REVIEWS
        // =========================

        if (reviewsResponse.ok) {

          const formattedReviews =
            (reviewsData.reviews || [])
              .map(review => ({

                id:
                  review._id,

                name:
                  review.reviewer?.name ||
                  'User',

                avatar:
                  review.reviewer?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  '?',

                skill:
                  'Skill Exchange',

                rating:
                  review.rating,

                text:
                  review.text,

                date:
                  new Date(
                    review.createdAt
                  ).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric'
                    }
                  )

              }))


          setReviews(
            formattedReviews
          )

        }


        // =========================
        // STATS
        // =========================

        if (statsResponse.ok) {

          setAverageRating(
            statsData.average || 0
          )

          setReviewCount(
            statsData.total || 0
          )

          setBreakdown(
            statsData.breakdown || {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0
            }
          )

        }


        // =========================
        // REVIEW PARTNERS
        // =========================

        if (partnersResponse.ok) {

          setPartners(
            partnersData.partners || []
          )

        }

      } catch (error) {

        console.error(
          'Reviews fetch error:',
          error
        )

      } finally {

        setLoading(false)

      }

    }


    fetchReviews()

  }, [])


  // =========================
  // SUBMIT REVIEW
  // =========================

  const handleSubmitReview = async () => {

    if (!selectedPartner) {

      Swal.fire({

        icon: 'warning',

        title:
          'Select Exchange',

        text:
          'Please select an exchange partner.'

      })

      return

    }


    if (selectedRating === 0) {

      Swal.fire({

        icon: 'warning',

        title:
          'Rating Required',

        text:
          'Please select a rating.'

      })

      return

    }


    if (!reviewText.trim()) {

      Swal.fire({

        icon: 'warning',

        title:
          'Review Required',

        text:
          'Please write your review.'

      })

      return

    }


    const token =
      localStorage.getItem('token')


    try {

      setSubmitting(true)


      const response =
        await fetch(
          'http://localhost:5000/api/reviews',
          {
            method: 'POST',

            headers: {

              'Content-Type':
                'application/json',

              'Authorization':
                `Bearer ${token}`

            },

            body: JSON.stringify({

              exchangeRequestId:
                selectedPartner,

              rating:
                selectedRating,

              text:
                reviewText.trim()

            })

          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        Swal.fire({

          icon: 'error',

          title:
            'Unable to Submit',

          text:
            data.message ||
            'Something went wrong.'

        })

        return

      }


      // =========================
      // SUCCESS
      // =========================

      const newReview = {

        id:
          data.review._id,

        name:
          'You',

        avatar:
          'Y',

        skill:
          'Skill Exchange',

        rating:
          data.review.rating,

        text:
          data.review.text,

        date:
          new Date(
            data.review.createdAt
          ).toLocaleDateString(
            'en-US',
            {
              month: 'long',
              day: '2-digit',
              year: 'numeric'
            }
          )

      }


      setReviews(prev => [
        newReview,
        ...prev
      ])


      setReviewText('')

      setSelectedRating(0)

      setSelectedPartner('')

      setShowReviewForm(false)


      // =========================
      // REFRESH STATS
      // =========================

      const statsResponse =
        await fetch(
          'http://localhost:5000/api/reviews/stats',
          {
            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        )


      const statsData =
        await statsResponse.json()


      if (statsResponse.ok) {

        setAverageRating(
          statsData.average || 0
        )

        setReviewCount(
          statsData.total || 0
        )

        setBreakdown(
          statsData.breakdown || {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        )

      }


      // =========================
      // REFRESH PARTNERS
      // =========================

      const partnersResponse =
        await fetch(
          'http://localhost:5000/api/reviews/partners',
          {
            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        )


      const partnersData =
        await partnersResponse.json()


      if (partnersResponse.ok) {

        setPartners(
          partnersData.partners || []
        )

      }


      Swal.fire({

        icon: 'success',

        title:
          'Review Submitted!',

        text:
          'Your review has been saved successfully.',

        timer: 1800,

        showConfirmButton: false

      })

    } catch (error) {

      console.error(
        'Submit review error:',
        error
      )

      Swal.fire({

        icon: 'error',

        title:
          'Error',

        text:
          'Unable to submit review.'

      })

    } finally {

      setSubmitting(false)

    }

  }


  // =========================
  // CALCULATE BREAKDOWN %
  // =========================

  const getPercentage = (rating) => {

    if (reviewCount === 0) {
      return 0
    }

    return Math.round(
      (
        (breakdown[rating] || 0) /
        reviewCount
      ) * 100
    )

  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="reviews-page">

        <div className="container">

          <div className="reviews-section">

            <h3>
              Loading reviews...
            </h3>

            <p>
              Please wait while we fetch your reviews.
            </p>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="reviews-page">

      <div className="container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="reviews-header">

          <span>
            COMMUNITY FEEDBACK
          </span>

          <h1>
            Reviews
          </h1>

          <p>
            See what people say about your skill exchanges.
          </p>

        </div>


        {/* =========================
            RATING OVERVIEW
        ========================= */}

        <div className="row g-4 mb-4">


          {/* Overall Rating */}

          <div className="col-12 col-md-4">

            <div className="rating-card">

              <div className="rating-icon">
                <FiStar />
              </div>

              <h2>
                {averageRating || '0.0'}
              </h2>

              <div className="stars">

                {[1, 2, 3, 4, 5].map(star => (

                  <FiStar
                    key={star}
                    className={
                      star <=
                      Math.round(
                        averageRating
                      )
                        ? 'star-filled'
                        : ''
                    }
                  />

                ))}

              </div>

              <p>
                Overall Rating
              </p>

              <span>
                Based on {reviewCount} reviews
              </span>

            </div>

          </div>


          {/* Rating Breakdown */}

          <div className="col-12 col-md-8">

            <div className="rating-breakdown">

              <h3>
                Rating Breakdown
              </h3>


              {[5, 4, 3, 2].map(
                rating => {

                  const percentage =
                    getPercentage(
                      rating
                    )

                  return (

                    <div
                      className="rating-row"
                      key={rating}
                    >

                      <span>
                        {rating}
                      </span>

                      <FiStar />

                      <div className="rating-bar">

                        <div
                          style={{
                            width:
                              `${percentage}%`
                          }}
                        ></div>

                      </div>

                      <span>
                        {percentage}%
                      </span>

                    </div>

                  )

                }
              )}

            </div>

          </div>

        </div>


        {/* =========================
            REVIEWS SECTION
        ========================= */}

        <div className="reviews-section">


          <div className="reviews-section-header">

            <div>

              <span className="section-label">
                FEEDBACK
              </span>

              <h2>
                Recent Reviews
              </h2>

              <p>
                Feedback from your recent exchanges.
              </p>

            </div>


            <button
              className="write-review-btn"
              onClick={() =>
                setShowReviewForm(
                  !showReviewForm
                )
              }
            >

              <FiEdit3 />

              {showReviewForm
                ? 'Close'
                : 'Write a Review'
              }

            </button>

          </div>


          {/* =========================
              REVIEW FORM
          ========================= */}

          {showReviewForm && (

            <div className="review-form">

              <h3>
                Write Your Review
              </h3>

              <p>
                Share your experience with the community.
              </p>


              {/* Exchange Partner */}

              <div
                className="review-form-rating"
                style={{
                  marginBottom: '20px'
                }}
              >

                <span>
                  Select Exchange
                </span>

                <select
                  value={selectedPartner}
                  onChange={(e) =>
                    setSelectedPartner(
                      e.target.value
                    )
                  }
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#fff'
                  }}
                >

                  <option value="">
                    Select an exchange partner
                  </option>

                  {partners.map(partner => (

                    <option
                      key={partner.requestId}
                      value={partner.requestId}
                    >
                      {partner.name} — {partner.skill}
                    </option>

                  ))}

                </select>

              </div>


              {/* Rating */}

              <div className="review-form-rating">

                <span>
                  Your Rating
                </span>


                <div className="select-stars">

                  {[1, 2, 3, 4, 5].map(
                    star => (

                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setSelectedRating(
                            star
                          )
                        }
                        className={
                          selectedRating >= star
                            ? 'selected'
                            : ''
                        }
                      >

                        <FiStar />

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* Review */}

              <textarea
                className="review-textarea"
                rows="4"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) =>
                  setReviewText(
                    e.target.value
                  )
                }
              />


              {/* Submit */}

              <button
                className="submit-review-btn"
                onClick={
                  handleSubmitReview
                }
                disabled={submitting}
              >

                <FiMessageCircle />

                {submitting
                  ? 'Submitting...'
                  : 'Submit Review'
                }

              </button>

            </div>

          )}


          {/* =========================
              REVIEW LIST
          ========================= */}

          {reviews.length > 0 ? (

            reviews.map(
              review => (

                <div
                  className="review-card"
                  key={review.id}
                >

                  <div className="review-user">

                    <div className="review-avatar">

                      {review.avatar}

                    </div>

                    <div>

                      <h3>
                        {review.name}
                      </h3>

                      <span>
                        {review.skill}
                      </span>

                    </div>

                  </div>


                  <div className="review-rating">

                    <div className="review-stars">

                      {[1, 2, 3, 4, 5].map(
                        star => (

                          <FiStar
                            key={star}
                            className={
                              star <=
                              review.rating
                                ? 'star-filled'
                                : ''
                            }
                          />

                        )
                      )}

                    </div>

                    <span>
                      {review.rating}
                    </span>

                  </div>


                  <p className="review-text">
                    "{review.text}"
                  </p>


                  <span className="review-date">
                    {review.date}
                  </span>

                </div>

              )
            )

          ) : (

            <div className="review-card">

              <div className="review-user">

                <div className="review-avatar">
                  ?
                </div>

                <div>

                  <h3>
                    No reviews yet
                  </h3>

                  <span>
                    Complete skill exchanges to receive reviews.
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  )

}


export default Reviews