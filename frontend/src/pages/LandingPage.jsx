// src/pages/LandingPage.jsx

// This is the static, professional landing page shell for logged-out users.

const LandingPage = () => {
    // Note: We use raw HTML/CSS inside a function component for a static shell.
    // The "Faculty Login" and "Student Login" buttons will be functional links.
    const collegeLogo = "PP"; // Placeholder for the College Logo

    return (
        <div className="landing-page-shell">
            <style jsx="true">{`
                /* CSS Styles copied from the original HTML shell */
                :root {
                    --bg-color: #FFFFFF;
                    --text-color: #2C3E50;
                    --accent-color: #3498DB;
                    --accent-dark: #2980b9;
                    --light-gray: #f8f9fa;
                    --border-color: #ecf0f1;
                    --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }

                .landing-page-shell {
                    min-height: 100vh;
                    font-family: var(--font-family);
                    background-color: var(--bg-color);
                    color: var(--text-color);
                }

                .container {
                    width: 90%;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                h1, h2, h3 {
                    margin-bottom: 0.75rem;
                    line-height: 1.2;
                    color: var(--text-color);
                }

                section {
                    padding: 4.5rem 0;
                }
                
                .btn {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    margin: 0 0.5rem;
                    border: 2px solid var(--accent-color);
                }

                .btn-primary {
                    background-color: var(--accent-color);
                    color: #FFFFFF;
                }
                .btn-primary:hover {
                    background-color: var(--accent-dark);
                    border-color: var(--accent-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .btn-secondary {
                    background-color: transparent;
                    color: var(--accent-color);
                }
                .btn-secondary:hover {
                    background-color: var(--accent-color);
                    color: #FFFFFF;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                /* Header & Sticky Navigation */
                .landing-header {
                    position: sticky;
                    top: 0;
                    width: 100%;
                    background-color: var(--bg-color);
                    box-shadow: 0 2px 10px rgba(44, 62, 80, 0.05);
                    z-index: 1000;
                }
                
                .landing-header .container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                }
                
                .logo-brand {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                }
                
                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--bg-color);
                    margin-right: 0.75rem;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 40px;
                    height: 40px;
                    background: var(--accent-color);
                    border-radius: 8px;
                }

                .brand-name {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: var(--text-color);
                }

                .nav-buttons .btn {
                    padding: 0.5rem 1rem;
                }
                
                /* Hero Section */
                #hero {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    text-align: center;
                }

                #hero .container {
                    max-width: 800px;
                }
                
                #hero h1 {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                }
                
                #hero p {
                    font-size: 1.25rem;
                    color: #555;
                    margin-bottom: 2.5rem;
                }
                
                .hero-buttons .btn {
                    font-size: 1.1rem;
                    padding: 1rem 2rem;
                }

                /* Key Statistics Section */
                #stats {
                    background-color: var(--light-gray);
                    border-top: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    text-align: center;
                }
                
                .stat-card {
                    background: var(--bg-color);
                    padding: 2.5rem 2rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.05);
                }
                
                .stat-card h3 {
                    font-size: 2.75rem;
                    color: var(--accent-color);
                }
                
                .stat-card p {
                    font-size: 1rem;
                    color: #777;
                    font-weight: 500;
                }
                
                /* Recruiter Showcase Section */
                .logo-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 2rem;
                    align-items: center;
                }
                
                .logo-item {
                    background: var(--bg-color);
                    padding: 1.5rem;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    color: #aaa;
                    border: 2px solid var(--border-color);
                    min-height: 80px;
                    filter: grayscale(100%);
                    opacity: 0.8;
                }
                
                .logo-item:hover {
                    border-color: var(--accent-color);
                    filter: grayscale(0);
                    opacity: 1;
                }
                
                /* Footer */
                .landing-footer {
                    background-color: var(--text-color);
                    color: var(--border-color);
                    text-align: center;
                    padding: 2.5rem 0;
                    margin-top: 2rem;
                }
                
                .landing-footer p {
                    color: #ccc;
                }
            `}</style>

            <header className="landing-header">
                <div className="container">
                    <a href="#" className="logo-brand">
                        <span className="logo">{collegeLogo}</span>
                        <span className="brand-name">Placement Portal</span>
                    </a>
                    <div className="nav-buttons">
                        <a href="/login" className="btn btn-secondary">Faculty Login</a>
                        <a href="/login" className="btn btn-primary">Student Login</a>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section id="hero">
                    <div className="container">
                        <h1>Shaping Tomorrow's Workforce</h1>
                        <p>Welcome to the unified portal for students, faculty, and recruiters. Log in to access your dashboard.</p>
                        <div className="hero-buttons">
                            <a href="/login" className="btn btn-secondary">Faculty Login</a>
                            <a href="/login" className="btn btn-primary">Student Login</a>
                        </div>
                    </div>
                </section>

                {/* Key Statistics Section */}
                <section id="stats">
                    <div className="container">
                        <h2 style={{textAlign: 'center', marginBottom: '2.5rem', fontSize: '2.25rem'}}>Our Placement Highlights</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>18 LPA</h3>
                                <p>Highest CTC</p>
                            </div>
                            <div className="stat-card">
                                <h3>95%</h3>
                                <p>Placements Secured</p>
                            </div>
                            <div className="stat-card">
                                <h3>200+</h3>
                                <p>Total Companies</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recruiter Showcase Section */}
                <section id="recruiters">
                    <div className="container">
                        <h2 style={{textAlign: 'center', marginBottom: '2.5rem', fontSize: '2.25rem'}}>Our Top Recruiters</h2>
                        <div className="logo-grid">
                            <div className="logo-item">TechCorp</div>
                            <div className="logo-item">DataCorp</div>
                            <div className="logo-item">GlobalFin</div>
                            <div className="logo-item">EduLink</div>
                            <div className="logo-item">Innovate</div>
                            <div className="logo-item">MechPro</div>
                            <div className="logo-item">ElecSys</div>
                            <div className="logo-item">SoftGrid</div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="container">
                    <p>&copy; 2025 Placement Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;