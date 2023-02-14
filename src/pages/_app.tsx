import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {ThemeProvider, DefaultTheme} from 'styled-components'
import Head from "next/head";

const theme: DefaultTheme = {
    colors: {
        primary: '#111',
        secondary: '#0070f3',
    },
}

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Head>
                    <link rel="manifest" href="/manifest.webmanifest"/>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                </Head>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}
