import React from 'react';
import { useQuery } from 'react-query';
import About from "../../components/Landing/About";
import Main from "../../components/Landing/Main";
import Skills from "../../components/Landing/Skills";

import Contact from "../../components/Landing/Contact";
import Case from "../../components/Landing/Case";
import Navbar from "../../components/Landing/Navbar";
import FormPage from "../FormPage";
import ServicesBlock from "../../components/Landing/ServicesBlock";



const Landing = () => {
    // const { isLoading, error, data: user } = useQuery('myProfile', getMyProfile);
    //
    // if (isLoading) {
    //     return <Spin />;
    // }
    //
    // if (error) {
    //     return <Text>Error: {error.message}</Text>;
    // }

    return (
        <div>
            <Navbar />
            <div>
                <title>Clint | Front-End Developer</title>
                <meta name="description" content="I’m a front-end web developer specializing in building (and occasionally designing) exceptional digital experiences." />
                <link rel="icon" href="/fav.png" />
            </div>
            <Main />
            <About />
            <ServicesBlock />
            <Skills />
            <Case />
            {/*<Contact />*/}
            <FormPage />
        </div>
    )
};

export default Landing;