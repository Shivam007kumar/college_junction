"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

function SecurePDFViewerContent() {
    const searchParams = useSearchParams();
    const file = useMemo(() => searchParams.get("file"), [searchParams]);

    useEffect(() => {
        if (!file) return;

        // Prevent Print
        const preventPrint = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeprint", preventPrint);

        // Prevent Developer Tools & Shortcuts
        const blockShortcuts = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) ||
                ["F12", "U", "P", "S"].includes(e.key)
            ) {
                e.preventDefault();
                alert("Action disabled!");
            }
        };

        // Disable Right Click globally
        const disableRightClick = (e: MouseEvent) => e.preventDefault();

        document.addEventListener("keydown", blockShortcuts);
        document.addEventListener("contextmenu", disableRightClick);

        return () => {
            window.removeEventListener("beforeprint", preventPrint);
            document.removeEventListener("keydown", blockShortcuts);
            document.removeEventListener("contextmenu", disableRightClick);
        };
    }, [file]);

    if (!file) {
        return <p style={{ textAlign: "center", color: "red" }}>Error: No PDF selected.</p>;
    }

    return (
        <div 
            style={{
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                position: "relative",
                background: "#121212",
            }}
        >
            {/* PDF Iframe */}
            <iframe
                src={`${file}#toolbar=0&navpanes=0&scrollbar=1`}
                width="100%"
                height="100%"
                style={{ border: "none", background: "#fff" }}
            ></iframe>
        </div>
    );
}

export default function SecurePDFViewer() {
    return (
        <Suspense fallback={<p>Loading PDF Viewer...</p>}>
            <SecurePDFViewerContent />
        </Suspense>
    );
}
