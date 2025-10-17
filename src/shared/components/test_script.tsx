/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";

export default function TestScript(): Component {
    return <>
        <Script
            id="test-script"
            src='/test_script.js'
            strategy="beforeInteractive" />
        <script
            id="test-script-2"
            dangerouslySetInnerHTML={{
                __html: `
      ( function() {
      console.warn('TEST TEST 3', new Date());

      })();
    `,
            }} />
    </>;
}