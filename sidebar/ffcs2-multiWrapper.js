(function () {
    'use strict';

    console.log('[FFCS] Script initialized');

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
        console.log('[FFCS] Extracting registered courses...');
        registeredCourses = [];

        const wrapper = document.getElementById('page-wrapper-timetable');
        if (!wrapper) return;

        const tables = wrapper.querySelectorAll('table.w3-table-all');
        console.log('[FFCS] Found tables:', tables.length);

        let registeredTable = null;
        for (let table of tables) {
            if (table.textContent.includes('Class Detail')) {
                registeredTable = table;
                break;
            }
        }

        if (!registeredTable) {
            console.log('[FFCS] ❗ Class Detail table not found');
            return;
        }

        const tbody = registeredTable.querySelector('tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        console.log('[FFCS] Found rows:', rows.length);

        rows.forEach((row, idx) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 7) return;

            const courseDetail = cells[1]?.textContent?.trim();
            const classDetail = cells[6]?.textContent?.trim().replace(/\s+/g, ' ');

            console.log(`[FFCS] Row ${idx}: "${courseDetail?.substring(0, 15)}" -> "${classDetail}"`);

            if (!courseDetail || !classDetail) return;

            // Split strict VTOP structure: REGID - SLOT - ROOM
            const parts = classDetail.split(' - ').map(p => p.trim());
            const regId   = parts[0] || "";
            const slotStr = parts[1] || "";
            const room    = parts[2] || "";

            // handle NIL
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
            console.log(`[FFCS] ✓ ${course.code} slots: ${slots.join(', ') || 'NIL'} (${slotStr})`);
        });

        console.log('[FFCS] Total courses:', registeredCourses.length);
        console.log('[FFCS] Registered slots:', registeredCourses.map(c => c.fullSlot).join(', '));
    }


    function detectClashes(slotString) {
        const checkSlots = slotString.split('+').map(s => s.trim()).filter(s => s);
        const clashes = [];
        const seen = new Set();

        console.log(`[FFCS] Checking "${slotString}" -> [${checkSlots.join(', ')}]`);

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
                            console.log(`[FFCS]   ⚠ Clash: ${regSlot} (${course.code}) ↔ ${checkSlot}`);
                        }
                        break;
                    }
                }
            }
        }

        return clashes;
    }

    function addClashInfo() {
        console.log('[FFCS] Adding clash info...');
        
        const pageWrapper = document.getElementById('page-wrapper');
        if (!pageWrapper) return;

        const tables = pageWrapper.querySelectorAll('table.w3-table-all');
        console.log('[FFCS] Found tables:', tables.length);

        tables.forEach((table, tableIdx) => {
            const allRows = table.querySelectorAll('thead tr, tbody tr');
            
            // Find header
            let headerRow = null;
            let slotIdx = -1, venueIdx = -1, facultyIdx = -1;

            for (let row of allRows) {
                const cells = row.querySelectorAll('th');
                if (cells.length >= 3) {
                    const headers = Array.from(cells).map(th => th.textContent.trim());
                    
                    slotIdx = headers.indexOf('Slot');
                    venueIdx = headers.indexOf('Venue');
                    facultyIdx = headers.indexOf('Faculty');
                    
                    if (slotIdx >= 0 && facultyIdx >= 0) {
                        headerRow = row;
                        console.log(`[FFCS] Table ${tableIdx}: Found header`);
                        break;
                    }
                }
            }

            if (!headerRow) return;

            let startProcessing = false;
            let processed = 0;

            allRows.forEach((row, rowIdx) => {
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

                // Store original
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
                    // No clash - light green row
                    row.style.backgroundColor = '#d4edda';
                    slotCell.innerHTML = `${original}<br><span style="color:#155724;font-weight:bold;font-size:11px;">✓ No Clash</span>`;
                } else {
                    // Clash - light red row
                    row.style.backgroundColor = '#f8d7da';
                    const details = clashes.map(c => `${c.courseCode}`).join(', ');
                    slotCell.innerHTML = `${original}<br><span style="color:#721c24;font-weight:bold;font-size:10px;">⚠ ${details}</span>`;
                    slotCell.title = clashes.map(c => 
                        `CLASH: ${c.courseName} (${c.courseCode})\nYour slot: ${c.fullSlot}\nConflict: ${c.conflictSlot} ↔ ${c.checkingSlot}`
                    ).join('\n\n');
                }

                processed++;
            });

            console.log(`[FFCS] Table ${tableIdx}: Processed ${processed} rows`);
        });
    }

    function toggleClash() {
        showClashStatus = !showClashStatus;
        console.log('[FFCS] Clash:', showClashStatus ? 'ON' : 'OFF');
        
        const btn = document.getElementById('ffcs-toggle-btn');
        if (btn) {
            btn.textContent = showClashStatus ? '🔍 Hide Clash' : '🔍 Show Clash';
            btn.style.backgroundColor = showClashStatus ? '#ff9800' : '#4CAF50';
        }
        
        addClashInfo();
    }

    function loadTimetable() {
        if (isProcessing) return;

        console.log('[FFCS] Loading timetable...');
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
            console.log('[FFCS] Timetable loaded');
            
            setTimeout(() => {
                extractRegisteredCourses();
                addClashInfo();
                isProcessing = false;
            }, 300);
        })
        .catch(err => {
            console.error('[FFCS] Error:', err);
            wrapper.innerHTML = '<div style="color:red;padding:20px;text-align:center;">Error loading</div>';
            isProcessing = false;
        });
    }

    function createControls() {
        if (document.getElementById('ffcs-controls')) return;

        const pageWrapper = document.getElementById('page-wrapper');
        if (!pageWrapper) return;

        console.log('[FFCS] Creating controls...');

        const controls = document.createElement('div');
        controls.id = 'ffcs-controls';
        controls.style.cssText = 'text-align:center;padding:20px;margin:20px 0;display:flex;gap:15px;justify-content:center;flex-wrap:wrap;border:2px solid #4CAF50;background:#f9f9f9;border-radius:8px;';

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '🔄 Refresh Timetable';
        refreshBtn.style.cssText = 'background:#4CAF50;color:white;padding:14px 28px;font-size:17px;cursor:pointer;border:none;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);font-weight:bold;';
        refreshBtn.onclick = loadTimetable;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'ffcs-toggle-btn';
        toggleBtn.textContent = '🔍 Hide Clash';
        toggleBtn.style.cssText = 'background:#ff9800;color:white;padding:14px 28px;font-size:17px;cursor:pointer;border:none;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);font-weight:bold;';
        toggleBtn.onclick = toggleClash;

        controls.appendChild(refreshBtn);
        controls.appendChild(toggleBtn);

        pageWrapper.parentNode.insertBefore(controls, pageWrapper.nextSibling);
        console.log('[FFCS] Controls created');
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

        console.log('[FFCS] Initializing...');

        const check = setInterval(() => {
            const pageWrapper = document.getElementById('page-wrapper');
            const mainForm = document.getElementById('mainPageForm');

            if (pageWrapper && mainForm) {
                clearInterval(check);
                console.log('[FFCS] DOM ready');
                
                createControls();
                createWrapper();
                loadTimetable();

                new MutationObserver(() => {
                    if (!isProcessing) {
                        setTimeout(() => {
                            console.log('[FFCS] Page updated');
                            addClashInfo();
                        }, 500);
                    }
                }).observe(pageWrapper, { childList: true, subtree: false });
            }
        }, 500);

        setTimeout(() => clearInterval(check), 15000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();