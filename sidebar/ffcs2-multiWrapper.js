(function () {
    'use strict';

    function isFFCS() {
        return location.href.includes("vtopregcc.vit.ac.in");
    }

    let lastRefreshTime = null;
    let lastRefreshInterval = null;

    function updateRefreshAge() {
        if (!lastRefreshTime) return;

        const ageLabel = document.getElementById("timetable-last-refresh");
        if (!ageLabel) return;

        const diff = Math.floor((Date.now() - lastRefreshTime) / 1000);
        let text;

        if (diff < 60) text = `${diff}s ago`;
        else if (diff < 3600) text = `${Math.floor(diff / 60)}m ago`;
        else text = `${Math.floor(diff / 3600)}h ago`;

        ageLabel.textContent = `Last refreshed: ${text}`;
    }

    function createTimetableWrapper() {
        const base = document.getElementById("page-wrapper");
        if (!base) return;

        let timetable = document.getElementById("page-wrapper-timetable");
        if (timetable) return;

        timetable = document.createElement("div");
        timetable.id = "page-wrapper-timetable";
        timetable.style.cssText = "border-top: 2px solid #ccc; margin-top: 20px; padding: 20px;";

        // Centering wrapper for btn + time label
        const controls = document.createElement("div");
        controls.style.cssText = "text-align:center; margin-bottom:15px; display:flex; flex-direction:column; gap:8px; align-items:center;";

        const refreshBtn = document.createElement("button");
        refreshBtn.textContent = "Refresh Timetable";
        refreshBtn.className = "btn-primary w3-btn w3-round-large";
        refreshBtn.style.cssText = "background-color:#4CAF50;color:white;padding:12px 24px;font-size:16px;cursor:pointer;border:none;border-radius:8px;";
        refreshBtn.onclick = loadTimetable;

        const lastRef = document.createElement("span");
        lastRef.id = "timetable-last-refresh";
        lastRef.style.cssText = "font-size:13px;color:#666;";

        controls.appendChild(refreshBtn);
        controls.appendChild(lastRef);

        timetable.appendChild(controls);

        const content = document.createElement("div");
        content.id = "timetable-content";
        timetable.appendChild(content);

        base.parentNode.insertBefore(timetable, base.nextSibling);
    }

    function loadTimetable() {
        const content = document.getElementById("timetable-content");
        const mainForm = document.getElementById("mainPageForm");

        if (!content || !mainForm) return;

        content.innerHTML = '<div style="text-align:center;padding:40px;"><img src="assets/img/482.GIF"><br> Loading timetable...</div>';

        const bindData = new FormData(mainForm);

        const done = () => {
            lastRefreshTime = Date.now();
            updateRefreshAge();

            if (lastRefreshInterval) clearInterval(lastRefreshInterval);
            lastRefreshInterval = setInterval(updateRefreshAge, 10000); // update every 10s
        };

        if (window.jQuery && window.jQuery.ajax) {
            window.jQuery.ajax({
                url: "viewRegistered",
                type: "POST",
                data: bindData,
                cache: false,
                processData: false,
                contentType: false,
                success: function(response) {
                    content.innerHTML = response;
                    done();
                },
                error: function() {
                    content.innerHTML = '<div style="color:red;text-align:center;padding:20px;">Error loading timetable. Please try again.</div>';
                }
            });
        } else {
            fetch("viewRegistered", {
                method: "POST",
                body: bindData,
                credentials: "include"
            })
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                done();
            })
            .catch(error => {
                content.innerHTML = '<div style="color:red;text-align:center;padding:20px;">Error loading timetable. Please try again.</div>';
                console.error("Timetable load error:", error);
            });
        }
    }

    function init() {
        if (!isFFCS()) return;

        const checkInterval = setInterval(() => {
            const base = document.getElementById("page-wrapper");
            const mainForm = document.getElementById("mainPageForm");

            if (base && mainForm) {
                clearInterval(checkInterval);
                createTimetableWrapper();
                loadTimetable();
            }
        }, 500);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
