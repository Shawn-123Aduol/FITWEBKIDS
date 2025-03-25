// home.js
document.addEventListener('DOMContentLoaded', () => {
    // Welcome Text Animation
    const words = ['healthy', 'happy', 'active', 'strong', 'energetic'];
    let currentWord = 0;
    const dynamicWord = document.getElementById('dynamic-word');

    setInterval(() => {
        dynamicWord.style.opacity = 0;
        setTimeout(() => {
            currentWord = (currentWord + 1) % words.length;
            dynamicWord.textContent = words[currentWord];
            dynamicWord.style.opacity = 1;
        }, 500);
    }, 3000);

    // Star Animation
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.style.animationDelay = `${index * 0.3}s`;
    });

    // Streak Counter
    class StreakCounter {
        constructor() {
            this.streak = localStorage.getItem('streak') || 0;
            this.lastVisit = localStorage.getItem('lastVisit');
            this.updateStreak();
        }

        updateStreak() {
            const today = new Date().toDateString();
            if (this.lastVisit !== today) {
                if (this.daysBetween(new Date(this.lastVisit), new Date()) > 3) {
                    this.streak = 1;
                } else {
                    this.streak++;
                }
                localStorage.setItem('streak', this.streak);
                localStorage.setItem('lastVisit', today);
            }
            document.querySelector('.streak-number').textContent = this.streak;
        }

        daysBetween(date1, date2) {
            return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        }
    }

    const streakCounter = new StreakCounter();

    // Dashboard Modal
    const modal = document.getElementById('dashboardModal');
    const dashboardIcons = document.querySelectorAll('.dashboard-icon');
    const closeBtn = document.querySelector('.close-btn');

    dashboardIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Parent Dashboard Authentication
    const loginForm = document.querySelector('.login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add authentication logic here
        showDashboard();
    });

    function showDashboard() {
        const dashboardContent = document.querySelector('.dashboard-content');
        loginForm.classList.add('hidden');
        dashboardContent.classList.remove('hidden');
        
        // Create dashboard charts
        createActivityChart();
        createProgressChart();
    }

    function createActivityChart() {
        const ctx = document.createElement('canvas');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Activity Minutes',
                    data: [30, 45, 60, 35, 50, 40, 55],
                    backgroundColor: 'rgba(74, 144, 226, 0.6)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        document.querySelector('.dashboard-content').appendChild(ctx);
    }

    // Leaderboard
    class Leaderboard {
        constructor() {
            this.users = [];
            this.initializeLeaderboard();
            this.updateLeaderboard();
        }

        initializeLeaderboard() {
            // Simulate user data
            this.users = [
                { username: 'ActiveKid1', points: 1200, streak: 7, avatar: 'avatar1.png' },
                { username: 'FitChamp', points: 1100, streak: 5, avatar: 'avatar2.png' },
                { username: 'HealthyHero', points: 1000, streak: 4, avatar: 'avatar3.png' }
            ];
        }

        updateLeaderboard() {
            const leaderboardContent = document.querySelector('.leaderboard-content');
            leaderboardContent.innerHTML = '';

            this.users.sort((a, b) => b.points - a.points)
                .forEach((user, index) => {
                    const userCard = this.createUserCard(user, index);
                    leaderboardContent.appendChild(userCard);
                });
        }

        createUserCard(user, index) {
            const card = document.createElement('div');
            card.className = `user-card ${index < 3 ? 'top-three' : ''}`;
            card.innerHTML = `
                <div class="rank">${index + 1}</div>
                <img src="${user.avatar}" alt="${user.username}" class="avatar">
                <div class="user-info">
                    <h3>${user.username}</h3>
                    <p>Points: ${user.points}</p>
                    <p>Streak: ${user.streak} days</p>
                </div>
            `;
            return card;
        }
    }

    const leaderboard = new Leaderboard();

    // Initialize real-time updates
    const socket = io('your-server-url');
    socket.on('updateLeaderboard', (data) => {
        leaderboard.users = data;
        leaderboard.updateLeaderboard();
    });
});