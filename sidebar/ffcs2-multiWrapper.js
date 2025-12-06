(function () {
    'use strict';

    let registeredCourses = [];
    let showClashStatus = true;
    let isProcessing = false;

    const slotTimings = {
        'A1': [['MON', 480, 530], ['WED', 535, 585]],
        'A2': [['MON', 840, 890], ['WED', 895, 945], ['FRI', 950, 1000]],
        'B1': [['TUE', 480, 530], ['THU', 535, 585]],
        'B2': [['TUE', 840, 890], ['THU', 895, 945]],
        'C1': [['WED', 480, 530], ['FRI', 535, 585]],
        'C2': [['WED', 840, 890], ['FRI', 895, 945]],
        'D1': [['MON', 590, 640], ['THU', 480, 530]],
        'D2': [['MON', 950, 1000], ['THU', 840, 890]],
        'E1': [['TUE', 590, 640], ['FRI', 480, 530]],
        'E2': [['TUE', 950, 1000], ['FRI', 840, 890]],
        'F1': [['MON', 535, 585], ['WED', 590, 640]],
        'F2': [['MON', 895, 945], ['WED', 950, 1000]],
        'G1': [['TUE', 535, 585], ['THU', 590, 640]],
        'G2': [['TUE', 895, 945], ['THU', 950, 1000]],
        'TA1': [['FRI', 590, 640]],
        'TA2': [['FRI', 950, 1000]],
        'TB1': [['MON', 645, 695]],
        'TB2': [['MON', 1005, 1055]],
        'TC1': [['TUE', 645, 695]],
        'TC2': [['TUE', 1005, 1055]],
        'TD1': [['WED', 645, 695]],
        'TD2': [['WED', 1005, 1055]],
        'TE1': [['THU', 645, 695]],
        'TE2': [['THU', 1005, 1055]],
        'TF1': [['FRI', 645, 695]],
        'TF2': [['FRI', 1005, 1055]],
        'TG1': [['MON', 700, 750]],
        'TG2': [['MON', 1060, 1110]],
        'TAA1': [['TUE', 700, 750]],
        'TAA2': [['TUE', 1060, 1110]],
        'TBB1': [['WED', 700, 750]],
        'TBB2': [['WED', 1060, 1110]],
        'TCC1': [['THU', 700, 750]],
        'TCC2': [['THU', 1060, 1110]],
        'TDD1': [['FRI', 700, 750]],
        'TDD2': [['FRI', 1060, 1110]],
        'L1': [['MON', 480, 530]], 'L2': [['MON', 530, 580]], 'L3': [['MON', 590, 640]], 'L4': [['MON', 640, 690]],
        'L5': [['MON', 700, 750]], 'L6': [['MON', 750, 800]], 'L7': [['TUE', 480, 530]], 'L8': [['TUE', 530, 580]],
        'L9': [['TUE', 590, 640]], 'L10': [['TUE', 640, 690]], 'L11': [['TUE', 700, 750]], 'L12': [['TUE', 750, 800]],
        'L13': [['WED', 480, 530]], 'L14': [['WED', 530, 580]], 'L15': [['WED', 590, 640]], 'L16': [['WED', 640, 690]],
        'L17': [['WED', 700, 750]], 'L18': [['WED', 750, 800]], 'L19': [['THU', 480, 530]], 'L20': [['THU', 530, 580]],
        'L21': [['THU', 590, 640]], 'L22': [['THU', 640, 690]], 'L23': [['THU', 700, 750]], 'L24': [['THU', 750, 800]],
        'L25': [['FRI', 480, 530]], 'L26': [['FRI', 530, 580]], 'L27': [['FRI', 590, 640]], 'L28': [['FRI', 640, 690]],
        'L29': [['FRI', 700, 750]], 'L30': [['FRI', 750, 800]], 'L31': [['MON', 840, 890]], 'L32': [['MON', 890, 940]],
        'L33': [['MON', 950, 1000]], 'L34': [['MON', 1000, 1050]], 'L35': [['MON', 1060, 1110]], 'L36': [['MON', 1110, 1160]],
        'L37': [['TUE', 840, 890]], 'L38': [['TUE', 890, 940]], 'L39': [['TUE', 950, 1000]], 'L40': [['TUE', 1000, 1050]],
        'L41': [['TUE', 1060, 1110]], 'L42': [['TUE', 1110, 1160]], 'L43': [['WED', 840, 890]], 'L44': [['WED', 890, 940]],
        'L45': [['WED', 950, 1000]], 'L46': [['WED', 1000, 1050]], 'L47': [['WED', 1060, 1110]], 'L48': [['WED', 1110, 1160]],
        'L49': [['THU', 840, 890]], 'L50': [['THU', 890, 940]], 'L51': [['THU', 950, 1000]], 'L52': [['THU', 1000, 1050]],
        'L53': [['THU', 1060, 1110]], 'L54': [['THU', 1110, 1160]], 'L55': [['FRI', 840, 890]], 'L56': [['FRI', 890, 940]],
        'L57': [['FRI', 950, 1000]], 'L58': [['FRI', 1000, 1050]], 'L59': [['FRI', 1060, 1110]], 'L60': [['FRI', 1110, 1160]]
    };

    function timeOverlaps(t1, t2) {
        const [day1, start1, end1] = t1;
        const [day2, start2, end2] = t2;
        return day1 === day2 && start1 < end2 && start2 < end1;
    }

    function slotsClash(slot1, slot2) {
        const timings1 = slotTimings[slot1] || [];
        const timings2 = slotTimings[slot2] || [];
        for (let t1 of timings1) {
            for (let t2 of timings2) {
                if (timeOverlaps(t1, t2)) return true;
            }
        }
        return false;
    }

    // function extractRegisteredCourses() {
    //     console.log('[FFCS] Extracting registered courses...');
    //     registeredCourses = [];

    //     const wrapper = document.getElementById('page-wrapper-timetable');
    //     if (!wrapper) return;

    //     const tables = wrapper.querySelectorAll('table.w3-table-all');
    //     console.log('[FFCS] Found tables:', tables.length);

    //     let registeredTable = null;
    //     for (let table of tables) {
    //         if (table.textContent.includes('Class Detail')) {
    //             registeredTable = table;
    //             break;
    //         }
    //     }

    //     if (!registeredTable) return;

    //     const tbody = registeredTable.querySelector('tbody');
    //     if (!tbody) return;

    //     const rows = tbody.querySelectorAll('tr');
    //     console.log('[FFCS] Found rows:', rows.length);

    //     rows.forEach((row, idx) => {
    //         const cells = row.querySelectorAll('td');
    //         if (cells.length < 7) return;

    //         const courseDetail = cells[1]?.textContent?.trim();
    //         const classDetail = cells[6]?.textContent?.trim().replace(/\s+/g, ' '); // Normalize whitespace

    //         console.log(`[FFCS] Row ${idx}: "${courseDetail?.substring(0, 15)}" -> "${classDetail}"`);

    //         if (!courseDetail || !classDetail) return;

    //         // More flexible regex to handle whitespace
    //         const match = classDetail.match(/([A-Z0-9+]+)\s*-\s*[A-Z]/);
    //         if (match) {
    //             const fullSlot = match[1].trim();
    //             const slots = fullSlot.split('+').map(s => s.trim()).filter(s => s);
                
    //             const course = {
    //                 name: courseDetail.split(' - ')[1] || courseDetail,
    //                 code: courseDetail.split(' - ')[0] || courseDetail,
    //                 slots: slots,
    //                 fullSlot: fullSlot
    //             };

    //             registeredCourses.push(course);
    //             console.log(`[FFCS] ✓ ${course.code} (${fullSlot}) slots: ${slots.join(', ')}`);
    //         } else {
    //             console.log(`[FFCS] ✗ No match for: "${classDetail}"`);
    //         }
    //     });

    //     console.log('[FFCS] Total courses:', registeredCourses.length);
    //     console.log('[FFCS] Registered slots:', registeredCourses.map(c => c.fullSlot).join(', '));
    // }

    function extractRegisteredCourses() {
        registeredCourses = [];

        const wrapper = document.getElementById('page-wrapper-timetable');
        if (!wrapper) return;

        const tables = wrapper.querySelectorAll('table.w3-table-all');

        let registeredTable = null;
        for (let table of tables) {
            if (table.textContent.includes('Class Detail')) {
                registeredTable = table;
                break;
            }
        }

        if (!registeredTable) return;

        const tbody = registeredTable.querySelector('tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');

        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 7) return;

            const courseDetail = cells[1]?.textContent?.trim();
            const classDetail = cells[6]?.textContent?.trim().replace(/\s+/g, ' ');

            if (!courseDetail || !classDetail) return;

            const parts = classDetail.split(' - ').map(p => p.trim());
            const regId   = parts[0] || "";
            const slotStr = parts[1] || "";
            const room    = parts[2] || "";

            const slots = (slotStr === "NIL") 
                ? [] 
                : slotStr.split('+').map(s => s.trim()).filter(Boolean);

            const course = {
                name: courseDetail.split(' - ')[1] || courseDetail,
                code: courseDetail.split(' - ')[0] || courseDetail,
                regId: regId,
                fullSlot: slotStr,
                slots: slots,
                room: room
            };

            registeredCourses.push(course);
        });
    }


    function detectClashes(slotString) {
        const checkSlots = slotString.split('+').map(s => s.trim()).filter(s => s);
        const clashes = [];
        const seen = new Set();

        for (let course of registeredCourses) {
            for (let regSlot of course.slots) {
                for (let checkSlot of checkSlots) {
                    if (slotsClash(regSlot, checkSlot)) {
                        const key = `${course.code}-${regSlot}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            clashes.push({
                                courseName: course.name,
                                courseCode: course.code,
                                conflictSlot: regSlot,
                                checkingSlot: checkSlot,
                                fullSlot: course.fullSlot
                            });
                        }
                        break;
                    }
                }
            }
        }

        return clashes;
    }

    function addClashInfo() {
        const pageWrapper = document.getElementById('page-wrapper');
        if (!pageWrapper) return;

        const tables = pageWrapper.querySelectorAll('table.w3-table-all');

        tables.forEach((table) => {
            const allRows = table.querySelectorAll('thead tr, tbody tr');
            
            let headerRow = null;
            let slotIdx = -1, facultyIdx = -1;

            for (let row of allRows) {
                const cells = row.querySelectorAll('th');
                if (cells.length >= 3) {
                    const headers = Array.from(cells).map(th => th.textContent.trim());
                    
                    slotIdx = headers.indexOf('Slot');
                    facultyIdx = headers.indexOf('Faculty');
                    
                    if (slotIdx >= 0 && facultyIdx >= 0) {
                        headerRow = row;
                        break;
                    }
                }
            }

            if (!headerRow) return;

            let startProcessing = false;

            allRows.forEach((row) => {
                if (row === headerRow) {
                    startProcessing = true;
                    return;
                }

                if (!startProcessing) return;

                const cells = row.querySelectorAll('td');
                if (cells.length === 0) return;

                if (cells[0].colSpan > 1 || cells[0].textContent.trim().includes('Slots')) {
                    return;
                }

                if (cells.length <= slotIdx) return;

                const slotCell = cells[slotIdx];
                const slot = slotCell?.textContent?.trim();

                if (!slot) return;

                if (!slotCell.dataset.original) {
                    slotCell.dataset.original = slotCell.innerHTML;
                }

                if (!showClashStatus) {
                    slotCell.innerHTML = slotCell.dataset.original;
                    row.style.backgroundColor = '';
                    return;
                }

                const clashes = detectClashes(slot);
                const original = slotCell.dataset.original;

                if (clashes.length === 0) {
                    row.style.backgroundColor = '#d4edda';
                    slotCell.innerHTML = `${original}<br><span style="color:#155724;font-weight:bold;font-size:11px;">No Clash</span>`;
                } else {
                    row.style.backgroundColor = '#f8d7da';
                    const details = clashes.map(c => `${c.courseCode}`).join(', ');
                    slotCell.innerHTML = `${original}<br><span style="color:#721c24;font-weight:bold;font-size:10px;">${details}</span>`;
                    slotCell.title = clashes.map(c => 
                        `CLASH: ${c.courseName} (${c.courseCode})\nYour slot: ${c.fullSlot}\nConflict: ${c.conflictSlot} ↔ ${c.checkingSlot}`
                    ).join('\n\n');
                }
            });
        });
    }

    function toggleClash() {
        showClashStatus = !showClashStatus;
        
        const btn = document.getElementById('ffcs-toggle-btn');
        if (btn) {
            const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" style="vertical-align:middle;margin-right:8px;"><path fill="#88ae45" d="M13 27A2 2 0 1 0 13 31A2 2 0 1 0 13 27Z"></path><path fill="#f1bc19" d="M77 12A1 1 0 1 0 77 14A1 1 0 1 0 77 12Z"></path><path fill="#e6edb7" d="M50 13A37 37 0 1 0 50 87A37 37 0 1 0 50 13Z"></path><path fill="#f1bc19" d="M83 11A4 4 0 1 0 83 19A4 4 0 1 0 83 11Z"></path><path fill="#88ae45" d="M87 22A2 2 0 1 0 87 26A2 2 0 1 0 87 22Z"></path><path fill="#fbcd59" d="M81 74A2 2 0 1 0 81 78 2 2 0 1 0 81 74zM15 59A4 4 0 1 0 15 67 4 4 0 1 0 15 59z"></path><path fill="#88ae45" d="M25 85A2 2 0 1 0 25 89A2 2 0 1 0 25 85Z"></path><path fill="#fff" d="M18.5 51A2.5 2.5 0 1 0 18.5 56A2.5 2.5 0 1 0 18.5 51Z"></path><path fill="#f1bc19" d="M21 66A1 1 0 1 0 21 68A1 1 0 1 0 21 66Z"></path><path fill="#fff" d="M80 33A1 1 0 1 0 80 35A1 1 0 1 0 80 33Z"></path><g><path fill="#fdfcee" d="M50 26.042A23.958 23.958 0 1 0 50 73.958A23.958 23.958 0 1 0 50 26.042Z"></path><path fill="#472b29" d="M50,26.4c13.013,0,23.6,10.587,23.6,23.6S63.013,73.6,50,73.6S26.4,63.013,26.4,50 S36.987,26.4,50,26.4 M50,25c-13.807,0-25,11.193-25,25s11.193,25,25,25s25-11.193,25-25S63.807,25,50,25L50,25z"></path><path fill="#93bc39" d="M49.999 30.374999999999996A19.626 19.626 0 1 0 49.999 69.627A19.626 19.626 0 1 0 49.999 30.374999999999996Z"></path><path fill="#b7cc6b" d="M49.999,33.375c10.333,0,18.781,7.99,19.55,18.126 c0.038-0.497,0.076-0.994,0.076-1.5c0-10.839-8.787-19.626-19.626-19.626c-10.839,0-19.626,8.787-19.626,19.626 c0,0.506,0.038,1.003,0.076,1.5C31.218,41.365,39.667,33.375,49.999,33.375z"></path><path fill="#472b29" d="M49.999,30.75c10.615,0,19.251,8.635,19.251,19.249c0,10.615-8.636,19.251-19.251,19.251 c-10.614,0-19.249-8.636-19.249-19.251C30.75,39.385,39.385,30.75,49.999,30.75 M49.999,30C38.972,30,30,38.972,30,49.999 C30,61.027,38.972,70,49.999,70C61.027,70,70,61.027,70,49.999S61.027,30,49.999,30L49.999,30z"></path></g><g><path fill="#fdfcee" d="M52.8,38h-6.3c-3.038,0-5.5,2.462-5.5,5.5v10.379l-0.82-0.82C40.141,53.02,40.089,53,40.038,53 c-0.051,0-0.103,0.02-0.141,0.059l-1.838,1.838C38.02,54.936,38,54.987,38,55.038c0,0.051,0.02,0.102,0.059,0.141l4.3,4.3 c0.078,0.078,0.205,0.078,0.283,0l4.3-4.3c0.078-0.078,0.078-0.205,0-0.283l-1.838-1.838c-0.078-0.078-0.205-0.078-0.283,0 L44,53.879V43.5c0-1.381,1.119-2.5,2.5-2.5h6.3c0.11,0,0.2-0.09,0.2-0.2v-2.6C53,38.09,52.91,38,52.8,38z"></path><path fill="#472b29" d="M52.5,38.5v2h-6c-1.654,0-3,1.346-3,3v10.379v1.207l0.854-0.854l0.608-0.608l1.414,1.414 L42.5,58.914l-3.876-3.876l1.414-1.414l0.608,0.608l0.854,0.854v-1.207V43.5c0-2.757,2.243-5,5-5H52.5 M52.8,38h-6.3 c-3.038,0-5.5,2.462-5.5,5.5v10.379l-0.82-0.82C40.141,53.02,40.089,53,40.038,53c-0.051,0-0.103,0.02-0.141,0.059l-1.838,1.838 C38.02,54.936,38,54.987,38,55.038c0,0.051,0.02,0.102,0.059,0.141l4.3,4.3c0.039,0.039,0.09,0.059,0.141,0.059 s0.102-0.02,0.141-0.059l4.3-4.3c0.078-0.078,0.078-0.205,0-0.283l-1.838-1.838C45.064,53.02,45.013,53,44.962,53 s-0.102,0.02-0.141,0.059L44,53.879V43.5c0-1.381,1.119-2.5,2.5-2.5h6.3c0.11,0,0.2-0.09,0.2-0.2v-2.6C53,38.09,52.91,38,52.8,38 L52.8,38z"></path><g><path fill="#fdfcee" d="M47.2,62h6.3c3.038,0,5.5-2.462,5.5-5.5V46.121l0.82,0.82C59.859,46.98,59.911,47,59.962,47 c0.051,0,0.103-0.02,0.141-0.059l1.838-1.838C61.98,45.064,62,45.013,62,44.962c0-0.051-0.02-0.102-0.059-0.141l-4.3-4.3 c-0.078-0.078-0.205-0.078-0.283,0l-4.3,4.3c-0.078,0.078-0.078,0.205,0,0.283l1.838,1.838c0.078,0.078,0.205,0.078,0.283,0 l0.82-0.82V56.5c0,1.381-1.119,2.5-2.5,2.5h-6.3c-0.11,0-0.2,0.09-0.2,0.2v2.6C47,61.91,47.09,62,47.2,62z"></path><path fill="#472b29" d="M57.5,41.086l3.876,3.876l-1.414,1.414l-0.608-0.608L58.5,44.914v1.207V56.5c0,2.757-2.243,5-5,5 h-6v-2h6c1.654,0,3-1.346,3-3V46.121v-1.207l-0.854,0.854l-0.608,0.608l-1.414-1.414L57.5,41.086 M57.5,40.462 c-0.051,0-0.102,0.02-0.141,0.059l-4.3,4.3c-0.078,0.078-0.078,0.205,0,0.283l1.838,1.838C54.936,46.98,54.987,47,55.038,47 s0.102-0.02,0.141-0.059l0.82-0.82V56.5c0,1.381-1.119,2.5-2.5,2.5h-6.3c-0.11,0-0.2,0.09-0.2,0.2v2.6c0,0.11,0.09,0.2,0.2,0.2 h6.3c3.038,0,5.5-2.462,5.5-5.5V46.121l0.82,0.82C59.859,46.98,59.911,47,59.962,47c0.051,0,0.103-0.02,0.141-0.059l1.838-1.838 C61.98,45.064,62,45.013,62,44.962c0-0.051-0.02-0.102-0.059-0.141l-4.3-4.3C57.602,40.481,57.551,40.462,57.5,40.462L57.5,40.462 z"></path></g></g></svg>';
            btn.innerHTML = showClashStatus ? svgIcon + 'Hide Clash' : svgIcon + 'Show Clash';
            btn.style.backgroundColor = showClashStatus ? '#ff9800' : '#4CAF50';
        }
        
        addClashInfo();
    }

    function loadTimetable() {
        if (isProcessing) return;

        isProcessing = true;

        const wrapper = document.getElementById('page-wrapper-timetable');
        const mainForm = document.getElementById('mainPageForm');

        if (!wrapper || !mainForm) {
            isProcessing = false;
            return;
        }

        wrapper.innerHTML = '<div style="text-align:center;padding:40px;"><img src="assets/img/482.GIF"><br>Loading...</div>';

        fetch('viewRegistered', {
            method: 'POST',
            body: new FormData(mainForm),
            credentials: 'include'
        })
        .then(res => res.text())
        .then(html => {
            wrapper.innerHTML = html;
            
            setTimeout(() => {
                extractRegisteredCourses();
                addClashInfo();
                isProcessing = false;
            }, 300);
        })
        .catch(() => {
            wrapper.innerHTML = '<div style="color:red;padding:20px;text-align:center;">Error loading</div>';
            isProcessing = false;
        });
    }

    function createControls() {
        if (document.getElementById('ffcs-controls')) return;

        const pageWrapper = document.getElementById('page-wrapper');
        if (!pageWrapper) return;

        const controls = document.createElement('div');
        controls.id = 'ffcs-controls';
        controls.style.cssText = 'text-align:center;padding:20px;margin:20px 0;display:flex;gap:15px;justify-content:center;flex-wrap:wrap;border:2px solid #4CAF50;background:#f9f9f9;border-radius:8px;';

        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" style="vertical-align:middle;margin-right:8px;"><path fill="#88ae45" d="M13 27A2 2 0 1 0 13 31A2 2 0 1 0 13 27Z"></path><path fill="#f1bc19" d="M77 12A1 1 0 1 0 77 14A1 1 0 1 0 77 12Z"></path><path fill="#e6edb7" d="M50 13A37 37 0 1 0 50 87A37 37 0 1 0 50 13Z"></path><path fill="#f1bc19" d="M83 11A4 4 0 1 0 83 19A4 4 0 1 0 83 11Z"></path><path fill="#88ae45" d="M87 22A2 2 0 1 0 87 26A2 2 0 1 0 87 22Z"></path><path fill="#fbcd59" d="M81 74A2 2 0 1 0 81 78 2 2 0 1 0 81 74zM15 59A4 4 0 1 0 15 67 4 4 0 1 0 15 59z"></path><path fill="#88ae45" d="M25 85A2 2 0 1 0 25 89A2 2 0 1 0 25 85Z"></path><path fill="#fff" d="M18.5 51A2.5 2.5 0 1 0 18.5 56A2.5 2.5 0 1 0 18.5 51Z"></path><path fill="#f1bc19" d="M21 66A1 1 0 1 0 21 68A1 1 0 1 0 21 66Z"></path><path fill="#fff" d="M80 33A1 1 0 1 0 80 35A1 1 0 1 0 80 33Z"></path><g><path fill="#fdfcee" d="M50 26.042A23.958 23.958 0 1 0 50 73.958A23.958 23.958 0 1 0 50 26.042Z"></path><path fill="#472b29" d="M50,26.4c13.013,0,23.6,10.587,23.6,23.6S63.013,73.6,50,73.6S26.4,63.013,26.4,50 S36.987,26.4,50,26.4 M50,25c-13.807,0-25,11.193-25,25s11.193,25,25,25s25-11.193,25-25S63.807,25,50,25L50,25z"></path><path fill="#93bc39" d="M49.999 30.374999999999996A19.626 19.626 0 1 0 49.999 69.627A19.626 19.626 0 1 0 49.999 30.374999999999996Z"></path><path fill="#b7cc6b" d="M49.999,33.375c10.333,0,18.781,7.99,19.55,18.126 c0.038-0.497,0.076-0.994,0.076-1.5c0-10.839-8.787-19.626-19.626-19.626c-10.839,0-19.626,8.787-19.626,19.626 c0,0.506,0.038,1.003,0.076,1.5C31.218,41.365,39.667,33.375,49.999,33.375z"></path><path fill="#472b29" d="M49.999,30.75c10.615,0,19.251,8.635,19.251,19.249c0,10.615-8.636,19.251-19.251,19.251 c-10.614,0-19.249-8.636-19.249-19.251C30.75,39.385,39.385,30.75,49.999,30.75 M49.999,30C38.972,30,30,38.972,30,49.999 C30,61.027,38.972,70,49.999,70C61.027,70,70,61.027,70,49.999S61.027,30,49.999,30L49.999,30z"></path></g><g><path fill="#fdfcee" d="M52.8,38h-6.3c-3.038,0-5.5,2.462-5.5,5.5v10.379l-0.82-0.82C40.141,53.02,40.089,53,40.038,53 c-0.051,0-0.103,0.02-0.141,0.059l-1.838,1.838C38.02,54.936,38,54.987,38,55.038c0,0.051,0.02,0.102,0.059,0.141l4.3,4.3 c0.078,0.078,0.205,0.078,0.283,0l4.3-4.3c0.078-0.078,0.078-0.205,0-0.283l-1.838-1.838c-0.078-0.078-0.205-0.078-0.283,0 L44,53.879V43.5c0-1.381,1.119-2.5,2.5-2.5h6.3c0.11,0,0.2-0.09,0.2-0.2v-2.6C53,38.09,52.91,38,52.8,38z"></path><path fill="#472b29" d="M52.5,38.5v2h-6c-1.654,0-3,1.346-3,3v10.379v1.207l0.854-0.854l0.608-0.608l1.414,1.414 L42.5,58.914l-3.876-3.876l1.414-1.414l0.608,0.608l0.854,0.854v-1.207V43.5c0-2.757,2.243-5,5-5H52.5 M52.8,38h-6.3 c-3.038,0-5.5,2.462-5.5,5.5v10.379l-0.82-0.82C40.141,53.02,40.089,53,40.038,53c-0.051,0-0.103,0.02-0.141,0.059l-1.838,1.838 C38.02,54.936,38,54.987,38,55.038c0,0.051,0.02,0.102,0.059,0.141l4.3,4.3c0.039,0.039,0.09,0.059,0.141,0.059 s0.102-0.02,0.141-0.059l4.3-4.3c0.078-0.078,0.078-0.205,0-0.283l-1.838-1.838C45.064,53.02,45.013,53,44.962,53 s-0.102,0.02-0.141,0.059L44,53.879V43.5c0-1.381,1.119-2.5,2.5-2.5h6.3c0.11,0,0.2-0.09,0.2-0.2v-2.6C53,38.09,52.91,38,52.8,38 L52.8,38z"></path><g><path fill="#fdfcee" d="M47.2,62h6.3c3.038,0,5.5-2.462,5.5-5.5V46.121l0.82,0.82C59.859,46.98,59.911,47,59.962,47 c0.051,0,0.103-0.02,0.141-0.059l1.838-1.838C61.98,45.064,62,45.013,62,44.962c0-0.051-0.02-0.102-0.059-0.141l-4.3-4.3 c-0.078-0.078-0.205-0.078-0.283,0l-4.3,4.3c-0.078,0.078-0.078,0.205,0,0.283l1.838,1.838c0.078,0.078,0.205,0.078,0.283,0 l0.82-0.82V56.5c0,1.381-1.119,2.5-2.5,2.5h-6.3c-0.11,0-0.2,0.09-0.2,0.2v2.6C47,61.91,47.09,62,47.2,62z"></path><path fill="#472b29" d="M57.5,41.086l3.876,3.876l-1.414,1.414l-0.608-0.608L58.5,44.914v1.207V56.5c0,2.757-2.243,5-5,5 h-6v-2h6c1.654,0,3-1.346,3-3V46.121v-1.207l-0.854,0.854l-0.608,0.608l-1.414-1.414L57.5,41.086 M57.5,40.462 c-0.051,0-0.102,0.02-0.141,0.059l-4.3,4.3c-0.078,0.078-0.078,0.205,0,0.283l1.838,1.838C54.936,46.98,54.987,47,55.038,47 s0.102-0.02,0.141-0.059l0.82-0.82V56.5c0,1.381-1.119,2.5-2.5,2.5h-6.3c-0.11,0-0.2,0.09-0.2,0.2v2.6c0,0.11,0.09,0.2,0.2,0.2 h6.3c3.038,0,5.5-2.462,5.5-5.5V46.121l0.82,0.82C59.859,46.98,59.911,47,59.962,47c0.051,0,0.103-0.02,0.141-0.059l1.838-1.838 C61.98,45.064,62,45.013,62,44.962c0-0.051-0.02-0.102-0.059-0.141l-4.3-4.3C57.602,40.481,57.551,40.462,57.5,40.462L57.5,40.462 z"></path></g></g></svg>Refresh';
        refreshBtn.style.cssText = 'background:#4CAF50;color:white;padding:14px 28px;font-size:17px;cursor:pointer;border:none;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);font-weight:bold;display:flex;align-items:center;';
        refreshBtn.onclick = loadTimetable;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'ffcs-toggle-btn';
        toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" style="vertical-align:middle;margin-right:8px;"><path fill="#88ae45" d="M13 27A2 2 0 1 0 13 31A2 2 0 1 0 13 27Z"></path><path fill="#f1bc19" d="M77 12A1 1 0 1 0 77 14A1 1 0 1 0 77 12Z"></path><path fill="#e6edb7" d="M50 13A37 37 0 1 0 50 87A37 37 0 1 0 50 13Z"></path><path fill="#f1bc19" d="M83 11A4 4 0 1 0 83 19A4 4 0 1 0 83 11Z"></path><path fill="#88ae45" d="M87 22A2 2 0 1 0 87 26A2 2 0 1 0 87 22Z"></path><path fill="#fbcd59" d="M81 74A2 2 0 1 0 81 78 2 2 0 1 0 81 74zM15 59A4 4 0 1 0 15 67 4 4 0 1 0 15 59z"></path><path fill="#88ae45" d="M25 85A2 2 0 1 0 25 89A2 2 0 1 0 25 85Z"></path><path fill="#fff" d="M18.5 51A2.5 2.5 0 1 0 18.5 56A2.5 2.5 0 1 0 18.5 51Z"></path><path fill="#f1bc19" d="M21 66A1 1 0 1 0 21 68A1 1 0 1 0 21 66Z"></path><path fill="#fff" d="M80 33A1 1 0 1 0 80 35A1 1 0 1 0 80 33Z"></path><g><path fill="#fdfcee" d="M50 26.042A23.958 23.958 0 1 0 50 73.958A23.958 23.958 0 1 0 50 26.042Z"></path><path fill="#472b29" d="M50,26.4c13.013,0,23.6,10.587,23.6,23.6S63.013,73.6,50,73.6S26.4,63.013,26.4,50 S36.987,26.4,50,26.4 M50,25c-13.807,0-25,11.193-25,25s11.193,25,25,25s25-11.193,25-25S63.807,25,50,25L50,25z"></path><path fill="#93bc39" d="M49.999 30.374999999999996A19.626 19.626 0 1 0 49.999 69.627A19.626 19.626 0 1 0 49.999 30.374999999999996Z"></path><path fill="#b7cc6b" d="M49.999,33.375c10.333,0,18.781,7.99,19.55,18.126 c0.038-0.497,0.076-0.994,0.076-1.5c0-10.839-8.787-19.626-19.626-19.626c-10.839,0-19.626,8.787-19.626,19.626 c0,0.506,0.038,1.003,0.076,1.5C31.218,41.365,39.667,33.375,49.999,33.375z"></path><path fill="#472b29" d="M49.999,30.75c10.615,0,19.251,8.635,19.251,19.249c0,10.615-8.636,19.251-19.251,19.251 c-10.614,0-19.249-8.636-19.249-19.251C30.75,39.385,39.385,30.75,49.999,30.75 M49.999,30C38.972,30,30,38.972,30,49.999 C30,61.027,38.972,70,49.999,70C61.027,70,70,61.027,70,49.999S61.027,30,49.999,30L49.999,30z"></path></g><g><path fill="#fdfcee" d="M52.8,38h-6.3c-3.038,0-5.5,2.462-5.5,5.5v10.379l-0.82-0.82C40.141,53.02,40.089,53,40.038,53 c-0.051,0-0.103,0.02-0.141,0.059l-1.838,1.838C38.02,54.936,38,54.987,38,55.038c0,0.051,0.02,0.102,0.059,0.141l4.3,4.3 c0.078,0.078,0.205,0.078,0.283,0l4.3-4.3c0.078-0.078,0.078-0.205,0-0.283l-1.838-1.838c-0.078-0.078-0.205-0.078-0.283,0 L44,53.879V43.5c0-1.381,1.119-2.5,2.5-2.5h6.3c0.11,0,0.2-0.09,0.2-0.2v-2.6C53,38.09,52.91,38,52.8,38z"></path><path fill="#472b29" d="M52.5,38.5v2h-6c-1.654,0-3,1.346-3,3v10.379v1.207l0.854-0.854l0.608-0.608l1.414,1.414 L42.5,58.914l-3.876-3.876l1.414-1.414l0.608,0.608l0.854,0.854v-1.207V43.5c0-2.757,2.243-5,5-5H52.5 M52.8,38h-6.3 c-3.038,0-5.5,2.462-5.5,5.5v10.379l-0.82-0.82C40.141,53.02,40.089,53,40.038,53c-0.051,0-0.103,0.02-0.141,0.059l-1.838,1.838 C38.02,54.936,38,54.987,38,55.038c0,0.051,0.02,0.102,0.059,0.141l4.3,4.3c0.039,0.039,0.09,0.059,0.141,0.059 s0.102-0.02,0.141-0.059l4.3-4.3c0.078-0.078,0.078-0.205,0-0.283l-1.838-1.838C45.064,53.02,45.013,53,44.962,53 s-0.102,0.02-0.141,0.059L44,53.879V43.5c0-1.381,1.119-2.5,2.5-2.5h6.3c0.11,0,0.2-0.09,0.2-0.2v-2.6C53,38.09,52.91,38,52.8,38 L52.8,38z"></path><g><path fill="#fdfcee" d="M47.2,62h6.3c3.038,0,5.5-2.462,5.5-5.5V46.121l0.82,0.82C59.859,46.98,59.911,47,59.962,47 c0.051,0,0.103-0.02,0.141-0.059l1.838-1.838C61.98,45.064,62,45.013,62,44.962c0-0.051-0.02-0.102-0.059-0.141l-4.3-4.3 c-0.078-0.078-0.205-0.078-0.283,0l-4.3,4.3c-0.078,0.078-0.078,0.205,0,0.283l1.838,1.838c0.078,0.078,0.205,0.078,0.283,0 l0.82-0.82V56.5c0,1.381-1.119,2.5-2.5,2.5h-6.3c-0.11,0-0.2,0.09-0.2,0.2v2.6C47,61.91,47.09,62,47.2,62z"></path><path fill="#472b29" d="M57.5,41.086l3.876,3.876l-1.414,1.414l-0.608-0.608L58.5,44.914v1.207V56.5c0,2.757-2.243,5-5,5 h-6v-2h6c1.654,0,3-1.346,3-3V46.121v-1.207l-0.854,0.854l-0.608,0.608l-1.414-1.414L57.5,41.086 M57.5,40.462 c-0.051,0-0.102,0.02-0.141,0.059l-4.3,4.3c-0.078,0.078-0.078,0.205,0,0.283l1.838,1.838C54.936,46.98,54.987,47,55.038,47 s0.102-0.02,0.141-0.059l0.82-0.82V56.5c0,1.381-1.119,2.5-2.5,2.5h-6.3c-0.11,0-0.2,0.09-0.2,0.2v2.6c0,0.11,0.09,0.2,0.2,0.2 h6.3c3.038,0,5.5-2.462,5.5-5.5V46.121l0.82,0.82C59.859,46.98,59.911,47,59.962,47c0.051,0,0.103-0.02,0.141-0.059l1.838-1.838 C61.98,45.064,62,45.013,62,44.962c0-0.051-0.02-0.102-0.059-0.141l-4.3-4.3C57.602,40.481,57.551,40.462,57.5,40.462L57.5,40.462 z"></path></g></g></svg>Hide Clash';
        toggleBtn.style.cssText = 'background:#ff9800;color:white;padding:14px 28px;font-size:17px;cursor:pointer;border:none;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);font-weight:bold;display:flex;align-items:center;';
        toggleBtn.onclick = toggleClash;

        controls.appendChild(refreshBtn);
        controls.appendChild(toggleBtn);

        pageWrapper.parentNode.insertBefore(controls, pageWrapper.nextSibling);
    }

    function createWrapper() {
        if (document.getElementById('page-wrapper-timetable')) return;

        const pageWrapper = document.getElementById('page-wrapper');
        if (!pageWrapper) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'page-wrapper-timetable';
        wrapper.style.cssText = 'border-top:2px solid #ccc;margin-top:20px;padding:20px;background:#fff;';

        const controls = document.getElementById('ffcs-controls');
        if (controls) {
            controls.parentNode.insertBefore(wrapper, controls.nextSibling);
        } else {
            pageWrapper.parentNode.insertBefore(wrapper, pageWrapper.nextSibling);
        }
    }

    function init() {
        if (!location.href.includes('vtopregcc.vit.ac.in')) return;

        const check = setInterval(() => {
            const pageWrapper = document.getElementById('page-wrapper');
            const mainForm = document.getElementById('mainPageForm');

            if (pageWrapper && mainForm) {
                clearInterval(check);
                
                // Check if feature is enabled
                chrome.storage.local.get(['multiWrapperEnabled'], result => {
                    if (result.multiWrapperEnabled === true) {
                        createControls();
                        createWrapper();
                        loadTimetable();

                        new MutationObserver(() => {
                            if (!isProcessing) {
                                setTimeout(() => {
                                    addClashInfo();
                                }, 500);
                            }
                        }).observe(pageWrapper, { childList: true, subtree: false });
                    }
                });
            }
        }, 500);

        setTimeout(() => clearInterval(check), 15000);
    }

    // Listen for toggle messages from sidebar
    chrome.runtime?.onMessage.addListener((req) => {
        if (req.type === 'MULTI_WRAPPER_TOGGLE') {
            if (req.enabled) {
                // Enable: initialize if not already done
                if (!document.getElementById('ffcs-controls')) {
                    init();
                }
            } else {
                // Disable: remove controls and wrapper
                const controls = document.getElementById('ffcs-controls');
                const wrapper = document.getElementById('page-wrapper-timetable');
                if (controls) controls.remove();
                if (wrapper) wrapper.remove();
            }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();