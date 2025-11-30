let modify_marks_page = () => {
    // 1) Hide columns in the blue header (outer table)
    const blue_header = document.querySelector(".tableHeader");
    if (blue_header) {
        const blue_header_elements = Array.from(blue_header.querySelectorAll("td"));
        // Sl.No. (1), ClassNbr (2), Course System (6), Course Mode (9)
        [0, 1, 5, 8].forEach(idx => {
            if (blue_header_elements[idx]) blue_header_elements[idx].style.display = "none";
        });
    }

    // 2) Hide corresponding columns in outer content rows
    const all_outer_rows = Array.from(document.querySelectorAll(".tableContent"));
    all_outer_rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll(":scope > td"));
        // Ignore rows that are the wrapper for inner tables (they have colspan)
        if (cells.length && cells[0].hasAttribute("colspan")) return;
        [0, 1, 5, 8].forEach(idx => {
            if (cells[idx]) cells[idx].style.display = "none";
        });
    });

    // 3) Process each inner marks table (customTable-level1)
    const useful_tables = Array.from(document.querySelectorAll(".customTable-level1 > tbody"));

    useful_tables.forEach(tbody => {
        // Hide columns in inner header
        const header = tbody.querySelector(".tableHeader-level1");
        if (header) {
            const hdrCells = Array.from(header.querySelectorAll("td"));
            // Sl.No.(1), Status(5), Class Avg(8), Mark Posted Strength(9), Remark(10)
            [0, 4, 7, 8, 9].forEach(idx => {
                if (hdrCells[idx]) hdrCells[idx].style.display = "none";
            });
        }

        // Totals
        let tot_max_marks = 0;
        let tot_weightage_percent = 0;
        let tot_scored = 0;
        let tot_weightage_equi = 0;

        // Hide columns and accumulate totals in inner content rows
        const rows = Array.from(tbody.querySelectorAll(".tableContent-level1"));
        rows.forEach(row => {
            // Skip if this is already a totals row (has background set)
            if (row.style.background && row.style.background !== "") return;

            const cells = Array.from(row.querySelectorAll("td, output"));

            // Hide columns: Sl.No.(1), Status(5), Class Avg(8), Mark Posted Strength(9), Remark(10)
            // Note: inner rows are <td><output> combos; the nth-child mapping still aligns by cell position.
            [0, 4, 7, 8, 9].forEach(idx => {
                const td = row.querySelector(`td:nth-child(${idx + 1})`);
                if (td) td.style.display = "none";
            });


            // Extract numeric values by position:
            // Indexes based on the header you shared:
            // 0: Sl.No., 1: Mark Title, 2: Max. Mark, 3: Weightage %, 4: Status, 5: Scored Mark,
            // 6: Weightage Mark, 7: Class Average, 8: Mark Posted Strength, 9: Remark


            const getNum = (el) => {
                const txt = (el?.textContent || "").replace(/[^0-9.]+/g, "");
                return txt ? parseFloat(txt) : 0;
            };

            console.log("t mark: " + getNum(cells[4]));
            console.log("t wei: " + getNum(cells[6]));
            console.log("a mark: " + getNum(cells[10]));
            console.log("a wei: " + getNum(cells[12]));

            const maxMarks = getNum(cells[4]);
            const weightagePercent = getNum(cells[6]);

            const scoredMark = getNum(cells[10]);
            const weightageEqui = getNum(cells[12]);

            tot_max_marks += maxMarks;
            tot_weightage_percent += weightagePercent;
            tot_scored += scoredMark;
            tot_weightage_equi += weightageEqui;
        });

        // Append totals row (matching inner table structure; hidden columns included for alignment)
        const totalsRow = document.createElement("tr");
        totalsRow.className = "tableContent-level1";
        totalsRow.style.background = "rgba(60,141,188,0.8)";
        totalsRow.innerHTML = `
      <td style="display:none;"></td>
      <td><b>Total:</b></td>
      <td><b></b></td>
      <td><b>${tot_weightage_percent.toFixed(2)}</b></td>
      <td style="display:none;"></td>
      <td style="display:none;"></td>
      <td><b></b></td>
      <td><b>${tot_weightage_equi.toFixed(2)}</b></td>
      <td style="display:none;"></td>
      <td style="display:none;"></td>
      <td style="display:none;"></td>
    `;
        tbody.appendChild(totalsRow);
    });
};