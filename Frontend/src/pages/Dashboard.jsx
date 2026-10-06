import React, { useEffect, useState } from 'react'

import {
    FiBookOpen,
    FiUsers,
    FiSend,
    FiRefreshCw
} from 'react-icons/fi'

import {
    Link
} from 'react-router-dom'

import Swal from 'sweetalert2'

import StatsCard from '../components/dashboard/StatsCard'
import MatchCard from '../components/dashboard/MatchCard'
import ExchangeCard from '../components/dashboard/ExchangeCard'
import QuickActions from '../components/dashboard/QuickActions'


const Dashboard = () => {

    const [user, setUser] = useState(null)

    const [greeting, setGreeting] =
        useState('Good morning')

    const [stats, setStats] = useState({
        matches: 0,
        requests: 0,
        activeExchanges: 0
    })


    // =================================
    // GET USER FROM DATABASE
    // =================================

    useEffect(() => {

        const fetchProfile = async () => {

            const token =
                localStorage.getItem('token')

            if (!token) {

                window.location.href = '/login'

                return

            }


            try {

                const response =
                    await fetch(
                        'http://localhost:5000/api/auth/profile',
                        {
                            method: 'GET',

                            headers: {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                        }
                    )


                const data =
                    await response.json()


                // =================================
                // ERROR
                // =================================

                if (!response.ok) {

                    if (
                        response.status === 401
                    ) {

                        localStorage.removeItem(
                            'token'
                        )

                        localStorage.removeItem(
                            'user'
                        )


                        await Swal.fire({

                            icon: 'error',

                            title: 'Session Expired',

                            text:
                                'Please login again.',

                            confirmButtonText:
                                'Go to Login'

                        })


                        window.location.href = '/login'

                        return

                    }


                    console.error(
                        'Dashboard profile error:',
                        data.message
                    )

                    return

                }


                // =================================
                // DATABASE USER
                // =================================

                const userData =
                    data.user


                setUser(userData)


                // =================================
                // UPDATE LOCAL STORAGE
                // =================================

                localStorage.setItem(
                    'user',
                    JSON.stringify(userData)
                )


                // =================================
                // UPDATE NAVBAR
                // =================================

                window.dispatchEvent(
                    new Event('userUpdated')
                )


            } catch (error) {

                console.error(
                    'Dashboard fetch error:',
                    error
                )

            }

        }


        fetchProfile()

    }, [])


    // =================================
    // GET DASHBOARD STATS
    // =================================

    useEffect(() => {

        const fetchDashboardStats = async () => {

            const token =
                localStorage.getItem('token')

            if (!token) {
                return
            }


            try {

                const response =
                    await fetch(
                        'http://localhost:5000/api/dashboard/stats',
                        {
                            method: 'GET',

                            headers: {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                        }
                    )


                const data =
                    await response.json()


                // =================================
                // ERROR
                // =================================

                if (!response.ok) {

                    if (
                        response.status === 401
                    ) {

                        localStorage.removeItem(
                            'token'
                        )

                        localStorage.removeItem(
                            'user'
                        )

                        window.location.href =
                            '/login'

                        return

                    }


                    console.error(
                        'Dashboard stats error:',
                        data.message
                    )

                    return

                }


                // =================================
                // SET STATS
                // =================================

                setStats({

                    matches:
                        data.matches || 0,

                    requests:
                        data.requests || 0,

                    activeExchanges:
                        data.activeExchanges || 0

                })


            } catch (error) {

                console.error(
                    'Dashboard stats fetch error:',
                    error
                )

            }

        }


        fetchDashboardStats()

    }, [])


    // =================================
    // DYNAMIC GREETING
    // =================================

    useEffect(() => {

        const updateGreeting = () => {

            const currentHour =
                new Date().getHours()


            if (
                currentHour >= 5 &&
                currentHour < 12
            ) {

                setGreeting(
                    'Good morning'
                )

            } else if (
                currentHour >= 12 &&
                currentHour < 17
            ) {

                setGreeting(
                    'Good afternoon'
                )

            } else if (
                currentHour >= 17 &&
                currentHour < 21
            ) {

                setGreeting(
                    'Good evening'
                )

            } else {

                setGreeting(
                    'Good night'
                )

            }

        }


        updateGreeting()


        const greetingInterval =
            setInterval(
                updateGreeting,
                60000
            )


        return () => {

            clearInterval(
                greetingInterval
            )

        }

    }, [])


    return (

        <div className="dashboard-page-content">


            {/* =========================
                WELCOME
            ========================= */}

            <div className="dashboard-welcome">

                <h1>

                    {greeting},{' '}

                    {user?.name || 'User'}

                    {' '}👋

                </h1>


                <p>

                    Ready to learn something new today?

                </p>

            </div>


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="row g-4 stats-section">


                <StatsCard

                    icon={<FiBookOpen />}

                    title="My Skills"

                    value={
                        String(
                            (
                                user?.teachSkills?.length || 0
                            ) +
                            (
                                user?.learnSkills?.length || 0
                            )
                        ).padStart(2, '0')
                    }

                    description="Skills added"

                />


                <StatsCard

                    icon={<FiUsers />}

                    title="Skill Matches"

                    value={
                        String(
                            stats.matches
                        ).padStart(2, '0')
                    }

                    description="People matched"

                />


                <StatsCard

                    icon={<FiSend />}

                    title="Requests"

                    value={
                        String(
                            stats.requests
                        ).padStart(2, '0')
                    }

                    description="Pending requests"

                />


                <StatsCard

                    icon={<FiRefreshCw />}

                    title="Active Exchanges"

                    value={
                        String(
                            stats.activeExchanges
                        ).padStart(2, '0')
                    }

                    description="Ongoing exchanges"

                />

            </div>


            {/* =========================
                SKILL MATCHES
            ========================= */}

            <section className="matches-section">


                <div className="section-heading">

                    <h2>

                        Your Skill Matches

                    </h2>


                    <Link

                        to="/dashboard/matches"

                        className="view-all"

                    >

                        View All →

                    </Link>

                </div>


                <div className="row g-4">


                    <MatchCard

                        name="No matches yet"

                        skill="Find people to exchange skills"

                        match="--"

                        initial="?"

                    />

                </div>

            </section>


            {/* =========================
                UPCOMING EXCHANGES
            ========================= */}

            <section className="exchanges-section">


                <div className="section-heading">

                    <h2>

                        Upcoming Exchanges

                    </h2>


                    <Link

                        to="/dashboard/exchanges"

                        className="view-all"

                    >

                        View All →

                    </Link>

                </div>


                <div className="exchange-list">


                    <ExchangeCard

                        name="No upcoming exchanges"

                        skillOne="Start a skill exchange"

                        skillTwo="with another learner"

                        date="--"

                        time="--"

                        initial="?"

                    />

                </div>

            </section>


            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <QuickActions />


        </div>

    )

}


export default Dashboard