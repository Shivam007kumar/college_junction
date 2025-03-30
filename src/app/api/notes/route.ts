import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    const publicPath = path.join(process.cwd(), "public");
    let years: string[] = [];
    let branches: Set<string> = new Set();
    let semesters: Set<string> = new Set();
    let notesList: { name: string; path: string; year: string; branch: string; semester: string }[] = [];

    function scanNotes(directory: string, relativePath: string) {
        if (!fs.existsSync(directory)) return;
        const items = fs.readdirSync(directory);

        items.forEach((item) => {
            const itemPath = path.join(directory, item);
            const itemRelativePath = path.join(relativePath, item);

            if (fs.statSync(itemPath).isDirectory()) {
                scanNotes(itemPath, itemRelativePath);
            } else if (item.endsWith(".pdf")) {
                // Extract metadata from the path
                const pathParts = itemRelativePath.split(path.sep);
                if (pathParts.length >= 3) {
                    const [year, branch, semester] = pathParts;
                    years.push(year);
                    branches.add(branch);
                    semesters.add(semester);

                    notesList.push({
                        name: item.replace(".pdf", ""),
                        path: `/${itemRelativePath.replace(/\\/g, "/")}`,
                        year,
                        branch,
                        semester,
                    });
                }
            }
        });
    }

    scanNotes(publicPath, ""); // Scan /public/

    // Remove duplicates and convert Set to an array
    years = [...new Set(years)];
    const branchesArray = Array.from(branches);
    const semestersArray = Array.from(semesters);

    return NextResponse.json({
        years,
        branches: branchesArray,
        semesters: semestersArray,
        notes: notesList,
    });
}
