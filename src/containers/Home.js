import React from 'react'
import './Home.css'

export default function Home() {
    return (
        <div className="Home">
            <div className="lander">
                <h1>Digital Toastmaster</h1>
                <p className="text-muted">
                    This is the Home Page. You are in {process.env.NODE_ENV}{' '}
                    environment.
                </p>
            </div>
        </div>
    )
}
