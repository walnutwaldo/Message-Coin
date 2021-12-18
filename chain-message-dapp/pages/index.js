import Head from 'next/head';
import React from "react";

import Inbox from "../components/Inbox";
import Navbar from "../components/Navbar"
import MessagePurchase from "../components/MessagePurchase";

function Header() {
    return (<Head>
        <meta charSet="utf-8"/>
        <link rel="icon" href="./favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="theme-color" content="#000000"/>
        <meta
            name="description"
            content="Dapp for chain message."
        />
        <link rel="apple-touch-icon" href="./logo192.png"/>
        <link rel="manifest" href="./manifest.json"/>

        <title>Chain Message</title>
    </Head>);
}

function Home() {
    return (
        <div>
            <Header/>
            <div className="bg-gray-200 h-full">
                <div className="body text-gray-100 pt-16">
                    <Navbar/>
                    <div className="max-w-6xl mx-auto p-4">
                        <div className="flex">
                            <Inbox className="w-2/3 mr-4"/>
                            <MessagePurchase className="w-1/3"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* This makes the page full height */}
            <style global jsx>{`
              html,
              body,
              body > div:first-child,
              div#__next,
              div#__next > div {
                height: 100%;
              }
            `}</style>

        </div>
    )
}

export default Home;