import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <div className="container home">
                <div className="row">
                    <div className="col col-sm-12 col-md-4 col-lg-5">
                        <h2><Link className='home-link' to={"/manager"}>Manager</Link></h2>
                    </div>
                    <div className="col col-sm-12 col-md-4 col-lg-5">
                        <h2><Link className='home-link' to={"/players"}>Players</Link></h2>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
