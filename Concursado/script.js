
// Os registros de cada conta permanecem separados no navegador.
// Os registros legados sem prefixo não são apagados nem importados automaticamente.
function userStorageKey(key) {
    const uid = window.CONCURSADO_USER_ID;
    if (!uid) throw new Error("Sessão necessária para acessar dados locais.");
    return `concursado_${uid}_${key}`;
}

/* =========================================================
   CONCURSADO
   Sistema principal
   ========================================================= */


/* =========================================================
   DADOS
========================================================= */

const defaultSimulations = [
    {
        id: 1,
        name: "Simulado 01",
        date: "04/10",
        hours: 2,
        minutes: 0,
        questions: 80,
        correct: 54,
        subjects: [
            { name: "Português", questions: 15, correct: 11 },
            { name: "Matemática", questions: 15, correct: 9 },
            { name: "História", questions: 10, correct: 7 },
            { name: "Geografia", questions: 10, correct: 8 },
            { name: "Direito", questions: 20, correct: 13 },
            { name: "Informática", questions: 10, correct: 6 }
        ]
    },
    {
        id: 2,
        name: "Simulado 02",
        date: "05/10",
        hours: 2,
        minutes: 0,
        questions: 80,
        correct: 59,
        subjects: [
            { name: "Português", questions: 15, correct: 12 },
            { name: "Matemáica", questions: 15, correct: 11 },
            { name: "História", questions: 10, correct: 8 },
            { name: "Geografia", questions: 10, correct: 8 },
            { name: "Direito", questions: 20, correct: 14 },
            { name: "Informática", questions: 10, correct: 6 }
        ]
    },
    {
        id: 3,
        name: "Simulado 03",
        date: "06/10",
        hours: 2,
        minutes: 0,
        questions: 80,
        correct: 65,
        subjects: [
            { name: "Português", questions: 15, correct: 13 },
            { name: "Matemática", questions: 15, correct: 12 },
            { name: "História", questions: 10, correct: 8 },
            { name: "Geografia", questions: 10, correct: 9 },
            { name: "Direito", questions: 20, correct: 16 },
            { name: "Informática", questions: 10, correct: 7 }
        ]
    },
    {
        id: 4,
        name: "Simulado 04",
        date: "07/10",
        hours: 2,
        minutes: 0,
        questions: 80,
        correct: 70,
        subjects: [
            { name: "Português", questions: 15, correct: 14 },
            { name: "Matemática", questions: 15, correct: 13 },
            { name: "História", questions: 10, correct: 9 },
            { name: "Geografia", questions: 10, correct: 9 },
            { name: "Direito", questions: 20, correct: 18 },
            { name: "Informática", questions: 10, correct: 7 }
        ]
    }
];


let simulations = loadJSON(
    userStorageKey("aprovado_simulations"),
    defaultSimulations
);

let subjects = loadJSON(
    userStorageKey("aprovado_subjects"),
    []
);

const SUBJECT_PALETTE = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#ec4899', '#eab308', '#14b8a6', '#f97316'];
function validSubjectColor(value) { return /^#[0-9a-fA-F]{6}$/.test(String(value || '')); }
function getSubjectColor(name) {
    const index = subjects.findIndex(s => String(s.name || '').toLocaleLowerCase('pt-BR') === String(name || '').toLocaleLowerCase('pt-BR'));
    if (index < 0) return '#22c55e';
    return validSubjectColor(subjects[index].color) ? subjects[index].color : SUBJECT_PALETTE[index % SUBJECT_PALETTE.length];
}
function nextSubjectColor() { return SUBJECT_PALETTE[subjects.length % SUBJECT_PALETTE.length]; }
let studies = loadJSON(
    userStorageKey("aprovado_studies"),
    []
);


/* =========================================================
   UTILITÁRIOS
========================================================= */

function loadJSON(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        const parsed = JSON.parse(data);

        return parsed ?? fallback;

    } catch (error) {

        console.error(
            `Erro ao carregar ${key}:`,
            error
        );

        return fallback;
    }
}


function saveStudies() {
    localStorage.setItem(
        userStorageKey("aprovado_studies"),
        JSON.stringify(studies)
    );
}


function saveSubjects() {
    localStorage.setItem(
        userStorageKey("aprovado_subjects"),
        JSON.stringify(subjects)
    );
}


function saveSimulations() {
    localStorage.setItem(
        userStorageKey("aprovado_simulations"),
        JSON.stringify(simulations)
    );
}


function getDateKey(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function parseStudyDate(study) {

    if (!study || !study.date) {
        return null;
    }

    const parts = String(
        study.date
    ).split("-");

    if (parts.length !== 3) {
        return null;
    }

    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    date.setHours(0, 0, 0, 0);

    return date;
}


function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

const sections = document.querySelectorAll(".section");

const sectionButtons = document.querySelectorAll(
    "[data-section]"
);


function showSection(id) {

    sections.forEach(section => {

        section.classList.toggle(
            "active",
            section.id === id
        );

    });


    document.querySelectorAll(
        "[data-section]"
    ).forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === id
        );

    });


    const mobileMenu =
        document.getElementById("mobileMenu");

    if (mobileMenu) {
        mobileMenu.classList.remove("open");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


sectionButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const section =
                button.dataset.section;

            if (section) {
                showSection(section);
            }

        }
    );

});


const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");


if (menuBtn && mobileMenu) {

    menuBtn.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );

}


/* Fechar menu de navegação ao clicar fora */

document.addEventListener("click", (event) => {
    if (!menuBtn || !mobileMenu) return;

    const clicouNoBotao = menuBtn.contains(event.target);
    const clicouNoMenu = mobileMenu.contains(event.target);

    if (!clicouNoBotao && !clicouNoMenu) {
        mobileMenu.classList.remove("open");
    }
});

/* Fechar menu ao pressionar ESC */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu) {
        mobileMenu.classList.remove("open");
    }
});


/* =========================================================
   SAUDAÇÃO
========================================================= */

function updateGreeting() {

    const greeting =
        document.getElementById("greeting");

    if (!greeting) {
        return;
    }

    const hour =
        new Date().getHours();

    if (hour >= 5 && hour < 12) {

        greeting.textContent =
            "Bom dia!";

    } else if (hour >= 12 && hour < 18) {

        greeting.textContent =
            "Boa tarde!";

    } else {

        greeting.textContent =
            "Boa noite!";

    }
}


/* =========================================================
   CALENDÁRIO SEMANAL
   DOMINGO → SÁBADO
========================================================= */

function renderWeek() {

    const container =
        document.getElementById("weekDays");

    if (!container) {
        return;
    }


    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const weekNames = [
        "DOM",
        "SEG",
        "TER",
        "QUA",
        "QUI",
        "SEX",
        "SÃB"
    ];


    /*
        Descobre o domingo da semana atual.

        Exemplo:

        Quarta-feira 07/10/2026

        DOM 04
        SEG 05
        TER 06
        QUA 07
        QUI 08
        SEX 09
        SÁB 10
    */

    const sunday =
        new Date(today);

    sunday.setDate(
        today.getDate() - today.getDay()
    );


    container.innerHTML = "";


    for (let i = 0; i < 7; i++) {

        const date =
            new Date(sunday);

        date.setDate(
            sunday.getDate() + i
        );


        const dateKey =
            getDateKey(date);


        const dayStudies =
            studies.filter(
                study =>
                    study.date === dateKey
            );


        const totalMinutes =
            dayStudies.reduce(
                (sum, study) =>
                    sum + getStudyMinutes(study),
                0
            );


        const totalQuestions =
            dayStudies.reduce(
                (sum, study) =>
                    sum + Number(study.questions || 0),
                0
            );


        const isToday =
            date.getTime() === today.getTime();


        const hasStudy =
            dayStudies.length > 0;


        const day =
            document.createElement("div");


        day.className = "day";


        if (isToday) {
            day.classList.add("today");
        }


        if (hasStudy) {
            day.classList.add("has-study");
        }


        /*
            Dias que pertencem a outro mês continuam
            aparecendo normalmente.
        */

        const isOtherMonth =
            date.getMonth() !== today.getMonth();


        if (isOtherMonth) {
            day.classList.add(
                "other-month"
            );
        }


        const dayNumber =
            String(
                date.getDate()
            ).padStart(2, "0");


        let studyInfo = "";


        if (totalMinutes > 0) {

            studyInfo = `
                <small
                    style="
                        display:block;
                        margin-top:4px;
                        font-size:9px;
                        color:inherit;
                        opacity:.75;
                    "
                >
                    ${formatStudyDuration(totalMinutes)}
                </small>
            `;

        } else if (totalQuestions > 0) {

            studyInfo = `
                <small
                    style="
                        display:block;
                        margin-top:4px;
                        font-size:9px;
                        color:inherit;
                        opacity:.75;
                    "
                >
                    ${totalQuestions}q
                </small>
            `;

        }


        day.innerHTML = `
            <span>
                ${weekNames[i]}
            </span>

            <strong>
                ${dayNumber}
            </strong>

            ${studyInfo}
        `;


        day.title =
            `${weekNames[i]} ${dayNumber}/${String(date.getMonth() + 1).padStart(2, "0")}`;


        container.appendChild(day);
    }


    updateCurrentWeekSummary();
}


/* =========================================================
   RESUMO DA SEMANA
========================================================= */

function updateCurrentWeekSummary() {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const sunday =
        new Date(today);

    sunday.setDate(
        today.getDate() - today.getDay()
    );


    const saturday =
        new Date(sunday);

    saturday.setDate(
        sunday.getDate() + 6
    );


    const startKey =
        getDateKey(sunday);

    const endKey =
        getDateKey(saturday);


    const weekStudies =
        studies.filter(study => {

            return (
                study.date >= startKey &&
                study.date <= endKey
            );

        });


    const totalMinutes =
        weekStudies.reduce(
            (sum, study) =>
                sum + getStudyMinutes(study),
            0
        );


    const totalQuestions =
        weekStudies.reduce(
            (sum, study) =>
                sum + Number(study.questions || 0),
            0
        );


    /*
        Seu HTML usa weekHours.
        Mantemos também weekTime caso exista
        em alguma versão anterior.
    */

    setText(
        "weekHours",
        formatStudyDuration(totalMinutes)
    );


    setText(
        "weekTime",
        formatStudyDuration(totalMinutes)
    );


    setText(
        "weekQuestions",
        totalQuestions
    );
}


/* =========================================================
   TEMPO DE ESTUDO
========================================================= */

function getStudyMinutes(study) {

    if (!study) {
        return 0;
    }


    if (
        typeof study.time === "number" &&
        Number.isFinite(study.time)
    ) {

        return Math.max(
            0,
            study.time
        );

    }


    if (
        typeof study.time === "string"
    ) {

        const value =
            study.time.trim();


        if (!value) {
            return 0;
        }


        /*
            HH:MM:SS
        */

        if (
            value.split(":").length === 3
        ) {

            const [
                hours,
                minutes,
                seconds
            ] = value.split(":").map(Number);


            return (
                (hours || 0) * 60 +
                (minutes || 0) +
                (seconds || 0) / 60
            );
        }


        /*
            HH:MM
        */

        if (
            value.split(":").length === 2
        ) {

            const [
                hours,
                minutes
            ] = value.split(":").map(Number);


            return (
                (hours || 0) * 60 +
                (minutes || 0)
            );
        }


        const numeric =
            Number(value);


        if (
            Number.isFinite(numeric)
        ) {

            return Math.max(
                0,
                numeric
            );

        }

    }


    return 0;
}


function formatStudyDuration(minutes) {

    const totalSeconds =
        Math.max(
            0,
            Math.round(
                Number(minutes || 0) * 60
            )
        );


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const mins =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    if (hours > 0) {

        return `${hours}h ${String(mins).padStart(2, "0")}m`;

    }


    if (mins > 0) {

        return `${mins}m ${String(seconds).padStart(2, "0")}s`;

    }


    return `${seconds}s`;
}


/* =========================================================
   FORMULÁRIO DE ESTUDO MANUAL
========================================================= */

const studyForm =
    document.getElementById("studyForm");


if (studyForm) {

    studyForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const subject =
                document.getElementById(
                    "studySubject"
                )?.value.trim();


            const time =
                document.getElementById(
                    "studyTime"
                )?.value;


            const questions =
                Number(
                    document.getElementById(
                        "studyQuestions"
                    )?.value || 0
                );


            const correct =
                Number(
                    document.getElementById(
                        "studyCorrect"
                    )?.value || 0
                );


            const category =
                document.getElementById(
                    "studyCategory"
                )?.value ||
                "Teoria";


            if (!subject) {

                showToast(
                    "Informe a matéria."
                );

                return;
            }


            const minutes =
                parseTimeInputToMinutes(
                    time
                );


            if (minutes <= 0) {

                showToast(
                    "Informe um tempo válido."
                );

                return;
            }


            const safeQuestions =
                Math.max(
                    0,
                    questions
                );


            const safeCorrect =
                Math.min(
                    Math.max(0, correct),
                    safeQuestions
                );


            studies.push({

                id: Date.now(),

                subject,

                time: minutes,

                questions:
                    safeQuestions,

                correct:
                    safeCorrect,

                category,

                date:
                    getDateKey(
                        new Date()
                    )

            });


            saveStudies();


            studyForm.reset();


            showToast(
                "Estudo registrado!"
            );


            updateAll();

        }
    );

}


/* =========================================================
   CONVERSO DE TEMPO
========================================================= */

function parseTimeInputToMinutes(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return 0;
    }


    const text =
        String(value).trim();


    if (!text) {
        return 0;
    }


    /*
        HH:MM:SS
    */

    if (
        text.split(":").length === 3
    ) {

        const [
            h,
            m,
            s
        ] =
            text
                .split(":")
                .map(Number);


        return (
            (h || 0) * 60 +
            (m || 0) +
            (s || 0) / 60
        );
    }


    /*
        HH:MM
    */

    if (
        text.split(":").length === 2
    ) {

        const [
            h,
            m
        ] =
            text
                .split(":")
                .map(Number);


        return (
            (h || 0) * 60 +
            (m || 0)
        );
    }


    const numeric =
        Number(text);


    return Number.isFinite(numeric)
        ? Math.max(0, numeric)
        : 0;
}


/* =========================================================
   HISTÓRICO
========================================================= */

/* =========================================================
   FILTROS DO HISTÓRICO
========================================================= */

const historyFilters = document.querySelectorAll(
    "[data-history-filter]"
);

// Temporário: futuramente será definido pelo login e assinatura.
const historyPremiumActive = false;

let historyCustomStart = null;
let historyCustomEnd = null;

const premiumHistoryFilters = [
    "month",
    "year",
    "all",
    "custom"
];

historyFilters.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.historyFilter;

        if (
            premiumHistoryFilters.includes(filter) &&
            !historyPremiumActive
        ) {
            alert(
                "🔒 Recurso Premium!\n\n" +
                "Assine o CONCURSADO Premium para acessar " +
                "os filtros Mês, Ano, Tudo e Personalizado."
            );
            return;
        }

        if (filter === "custom") {
            openHistoryDateModal();
            return;
        }

        historyFilters.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        renderHistory(filter);
    });
});


function openHistoryDateModal() {
    const overlay = document.getElementById("historyDateOverlay");
    if (!overlay) return;
    const today = getDateKey(new Date());
    document.getElementById("historyDateStart").value = historyCustomStart || today;
    document.getElementById("historyDateEnd").value = historyCustomEnd || today;
    document.getElementById("historyDateError").classList.add("hidden");
    overlay.classList.remove("hidden");
    document.body.classList.add("conc-modal-open");
    document.getElementById("historyDateStart").focus();
}

function closeHistoryDateModal() {
    document.getElementById("historyDateOverlay")?.classList.add("hidden");
    document.body.classList.remove("conc-modal-open");
}

const historyDateForm = document.getElementById("historyDateForm");
historyDateForm?.addEventListener("submit", event => {
    event.preventDefault();
    const start = document.getElementById("historyDateStart").value;
    const end = document.getElementById("historyDateEnd").value;
    const error = document.getElementById("historyDateError");
    if (!start || !end || start > end) {
        error.classList.remove("hidden");
        return;
    }
    error.classList.add("hidden");
    historyCustomStart = start;
    historyCustomEnd = end;
    historyFilters.forEach(item => item.classList.toggle("active", item.dataset.historyFilter === "custom"));
    closeHistoryDateModal();
    renderHistory("custom");
});
for (const id of ["closeHistoryDates", "cancelHistoryDates"]) {
    document.getElementById(id)?.addEventListener("click", closeHistoryDateModal);
}
document.getElementById("historyDateOverlay")?.addEventListener("click", event => {
    if (event.target.id === "historyDateOverlay") closeHistoryDateModal();
});

function parseHistoryInputDate(value) {
    const match = String(value).trim().match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
}


function getHistoryStartDate(filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "today") {
        return today;
    }

    if (filter === "week") {
        const start = new Date(today);

        // Semana começa no domingo
        start.setDate(
            today.getDate() - today.getDay()
        );

        return start;
    }

    if (filter === "month") {
        return new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
    }

    if (filter === "year") {
        return new Date(
            today.getFullYear(),
            0,
            1
        );
    }

    return null;
}


function renderHistory(filter = "today") {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!container) {
        return;
    }


    // Proteção de interface para filtros Premium
    if (
        premiumHistoryFilters.includes(filter) &&
        !historyPremiumActive
    ) {
        filter = "today";
    }

    const startDate = getHistoryStartDate(filter);

    let filtered = [...studies];

    if (filter === "custom") {

        filtered = filtered.filter(study => {
            return (
                historyCustomStart &&
                historyCustomEnd &&
                study.date >= historyCustomStart &&
                study.date <= historyCustomEnd
            );
        });

    } else if (startDate) {

        const startKey = getDateKey(startDate);
        const todayKey = getDateKey(new Date());

        filtered = filtered.filter(study => {
            return (
                study.date >= startKey &&
                study.date <= todayKey
            );
        });
    }


    filtered.sort(
        (a, b) =>
            String(b.date)
                .localeCompare(
                    String(a.date)
                )
    );


    if (!filtered.length) {

        container.innerHTML = `
            <div class="history-empty">
                Nenhum estudo registrado nesse período.
            </div>
        `;

        return;
    }


    const groups = {};


    filtered.forEach(study => {

        if (!groups[study.date]) {
            groups[study.date] = [];
        }

        groups[study.date].push(
            study
        );

    });


    container.innerHTML = "";


    Object.keys(groups)
        .sort()
        .reverse()
        .forEach(dateKey => {

            const entries =
                groups[dateKey];


            const day =
                document.createElement(
                    "div"
                );


            day.className =
                "history-day";


            const date =
                parseStudyDate({
                    date: dateKey
                });


            const title =
                formatHistoryDate(
                    date
                );


            day.innerHTML = `
                <div class="history-date">
                    <strong>
                        ${title.main}
                    </strong>

                    <span>
                        ${title.secondary}
                    </span>
                </div>
            `;


            entries.forEach(
                study => {

                    const entry =
                        document.createElement(
                            "div"
                        );


                    entry.className =
                        "history-entry";


                    const questions =
                        Number(
                            study.questions || 0
                        );


                    const correct =
                        Number(
                            study.correct || 0
                        );


                    const percent =
                        questions > 0
                            ? Math.round(
                                (
                                    correct /
                                    questions
                                ) * 100
                            )
                            : 0;


                    entry.innerHTML = `
                        <div class="history-entry-main">

                            <span class="history-entry-subject">
                                ${escapeHTML(
                        study.subject ||
                        "Sem matéria"
                    )}
                            </span>

                            <span class="history-entry-category">
                                ${escapeHTML(
                        study.category ||
                        "Teoria"
                    )}
                            </span>

                        </div>

                        <div class="history-entry-stats">

                            <div class="history-stat">
                                <span>Tempo</span>
                                <strong>
                                    ${formatStudyDuration(
                        getStudyMinutes(study)
                    )}
                                </strong>
                            </div>

                            <div class="history-stat">
                                <span>Questões</span>
                                <strong>
                                    ${questions}
                                </strong>
                            </div>

                            <div class="history-stat">
                                <span>Acertos</span>
                                <strong>
                                    ${correct}
                                    ${questions > 0
                            ? ` (${percent}%)`
                            : ""}
                                </strong>
                            </div>

                        </div>
                    `;


                    day.appendChild(
                        entry
                    );

                }
            );


            container.appendChild(
                day
            );

        });
}


function formatHistoryDate(date) {

    if (!date) {

        return {
            main: "Data desconhecida",
            secondary: ""
        };
    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const yesterday =
        new Date(today);

    yesterday.setDate(
        yesterday.getDate() - 1
    );


    if (
        date.getTime() ===
        today.getTime()
    ) {

        return {
            main: "HOJE",
            secondary:
                `${String(date.getDate()).padStart(2, "0")} ${getMonthName(date.getMonth())}`
        };
    }


    if (
        date.getTime() ===
        yesterday.getTime()
    ) {

        return {
            main: "ONTEM",
            secondary:
                `${String(date.getDate()).padStart(2, "0")} ${getMonthName(date.getMonth())}`
        };
    }


    return {

        main:
            `${String(date.getDate()).padStart(2, "0")} ${getMonthName(date.getMonth())}`,

        secondary:
            String(
                date.getFullYear()
            )

    };
}


function getMonthName(month) {

    const months = [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ"
    ];


    return months[month];
}


/* =========================================================
   CICLO
========================================================= */

function renderCycle() {

    const totalPlannedMinutes =
        cycleActiveSubjects().reduce(
            (sum, subject) =>
                sum +
                Number(subject.hours || 0) * 60,
            0
        );


    const activeNames = new Set(cycleActiveSubjects().map(s => s.name.toLowerCase()));
    const totalStudiedMinutes = studies.filter(study => activeNames.has(String(study.subject).toLowerCase())).reduce(
        (sum, study) => sum + getStudyMinutes(study), 0
    );


    const activeCycle = cycleActiveSubjects();
    const percent = activeCycle.length ? Math.round(activeCycle.reduce((sum, s) => sum + cyclePercentFor(s), 0) / activeCycle.length) : 0;

    setText(
        "cyclePercent",
        `${percent}%`
    );


    setText(
        "cyclePagePercent",
        `${percent}%`
    );


    const donut =
        document.getElementById(
            "cycleDonut"
        );


    if (donut) {

        donut.style.background = `
            conic-gradient(
                var(--green) 0deg,
                var(--green) ${percent * 3.6}deg,
                #27322d ${percent * 3.6}deg,
                #27322d 360deg
            )
        `;

    }


    const nextSubject =
        getNextSubject();


    if (nextSubject) {

        const progress =
            getSubjectProgress(
                nextSubject.name
            );


        const plannedMinutes =
            Number(
                nextSubject.hours || 0
            ) * 60;


        const studiedMinutes =
            getSubjectStudiedMinutes(
                nextSubject.name
            );


        const remaining =
            Math.max(
                0,
                plannedMinutes -
                studiedMinutes
            );


        setText(
            "nextSubject",
            nextSubject.name
        );


        setText(
            "cyclePageNextSubject",
            nextSubject.name
        );


        const questionOnly = nextSubject.cycleMode === "questions";
        const remainingLabel = questionOnly
            ? `${Math.max(0, Number(nextSubject.questions || 0) - cycleQuestionsDone(nextSubject.name))} questões`
            : formatStudyDuration(remaining);

        setText("nextRemaining", remainingLabel);
        setText("cyclePageNextRemaining", `${remainingLabel} restantes`);

    } else {

        setText(
            "nextSubject",
            "Nenhuma matéria cadastrada"
        );


        setText(
            "cyclePageNextSubject",
            "Nenhuma matéria"
        );


        setText(
            "nextRemaining",
            "0h"
        );


        setText(
            "cyclePageNextRemaining",
            "0h restantes"
        );

    }


    renderCycleSubjects();
}


function getSubjectStudiedMinutes(
    subjectName
) {

    return studies
        .filter(
            study =>
                String(
                    study.subject
                ).toLowerCase() ===
                String(
                    subjectName
                ).toLowerCase()
        )
        .reduce(
            (sum, study) =>
                sum + getStudyMinutes(study),
            0
        );
}


function getNextSubject() {

    if (!subjects.length) {
        return null;
    }


    return [...subjects]
        .sort(
            (a, b) =>
                getSubjectProgress(a.name) -
                getSubjectProgress(b.name)
        )[0];
}


function getSubjectProgress(
    subjectName
) {

    const subject =
        subjects.find(
            item =>
                String(
                    item.name
                ).toLowerCase() ===
                String(
                    subjectName
                ).toLowerCase()
        );


    if (!subject) {
        return 0;
    }


    const planned =
        Number(
            subject.hours || 0
        ) * 60;


    if (planned <= 0) {
        return 0;
    }


    const studied =
        getSubjectStudiedMinutes(
            subjectName
        );


    return Math.min(
        100,
        (
            studied /
            planned
        ) * 100
    );
}


function renderCycleSubjects() {

    const container =
        document.getElementById(
            "cycleSubjectsList"
        );


    if (!container) {
        return;
    }


    if (!cycleActiveSubjects().length) {

        container.innerHTML = `
            <div class="settings-empty">
                Nenhuma matéria cadastrada.
                <br><br>
                Vá em Configurações para adicionar suas matérias.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    cycleActiveSubjects().forEach(subject => {

        const planned =
            Number(
                subject.hours || 0
            ) * 60;


        const studied =
            getSubjectStudiedMinutes(
                subject.name
            );


        const percent = cyclePercentFor(subject);


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "cycle-subject-row";


        row.innerHTML = `

            <div class="cycle-subject-top">

                <span class="cycle-subject-name">
                    <span class="subject-color-dot" style="background:${getSubjectColor(subject.name)}"></span>${escapeHTML(
            subject.name
        )}
                </span>

                <span class="cycle-subject-percent">
                    ${percent}%
                </span>

            </div>


            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width:${percent}%;background:${getSubjectColor(subject.name)}"
                ></div>

            </div>


            
<div class="cycle-subject-meta">

    <span>
        ${subject.cycleMode === 'questions'
            ? `Resolvidas: ${cycleQuestionsDone(subject.name)} questões`
            : subject.cycleMode === 'both'
                ? `Estudado: ${formatStudyDuration(studied)} | Resolvidas: ${cycleQuestionsDone(subject.name)} questões`
                : `Estudado: ${formatStudyDuration(studied)}`
        }
    </span>


                <span>
                    Meta:
                    ${subject.cycleMode === 'questions' ? subject.questions + ' questões' : subject.cycleMode === 'both' ? formatStudyDuration(planned) + ' + ' + subject.questions + ' questões' : formatStudyDuration(planned)}
                </span>

            </div>

        `;


        container.appendChild(
            row
        );

    });
}


/* =========================================================
   CONFIGURAÇÕES DE MATÉRIAS
========================================================= */


/* Conversão de duração para o formulário de matérias. */
function textoParaHoras(value) {
    const text = String(value ?? '').trim();
    if (!text) return NaN;
    if (/^\d+(?::[0-5]\d){2}$/.test(text)) {
        const [h,m,s] = text.split(':').map(Number);
        return h + m / 60 + s / 3600;
    }
    if (/^\d+(?::[0-5]\d)$/.test(text)) {
        const [h,m] = text.split(':').map(Number);
        return h + m / 60;
    }
    const n = Number(text.replace(',', '.'));
    return Number.isFinite(n) && n >= 0 ? n : NaN;
}
function horasParaTexto(value) {
    const total = Math.max(0, Math.round(Number(value || 0) * 3600));
    const h = Math.floor(total / 3600);
    const m = Math.floor(total % 3600 / 60);
    const s = total % 60;
    return [h,m,s].map(x => String(x).padStart(2,'0')).join(':');
}

const subjectForm =
    document.getElementById(
        "subjectForm"
    );


if (subjectForm) {

    subjectForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const editingId =
                document.getElementById(
                    "editingSubjectId"
                )?.value;


            const name =
                document.getElementById(
                    "subjectName"
                )?.value.trim();


            const hours = textoParaHoras(
                document.getElementById("subjectHours").value
            );


            const questions =
                Number(
                    document.getElementById(
                        "subjectQuestions"
                    )?.value || 0
                );


            if (!name) {

                showToast(
                    "Informe o nome da matéria."
                );

                return;
            }


            const color = document.getElementById('subjectColor')?.value;
            if (editingId) {

                const subject =
                    subjects.find(
                        item =>
                            String(item.id) ===
                            String(editingId)
                    );


                if (subject) {

                    subject.color = validSubjectColor(color) ? color : getSubjectColor(subject.name);
                    subject.name =
                        name;

                    subject.hours =
                        Math.max(
                            0,
                            hours
                        );

                    subject.questions =
                        Math.max(
                            0,
                            questions
                        );
                }

            } else {

                subjects.push({

                    id: Date.now(),

                    name,
                    color: validSubjectColor(color) ? color : nextSubjectColor(),

                    hours:
                        Math.max(
                            0,
                            hours
                        ),

                    questions:
                        Math.max(
                            0,
                            questions
                        )

                });

            }


            saveSubjects();


            resetSubjectForm();
            if (document.getElementById('subjectColor')) document.getElementById('subjectColor').value = nextSubjectColor();


            renderSettingsSubjects();

            updateSubjectDatalist();

            renderCycle();
            if (typeof updateAll === 'function') updateAll();

            showToast(
                editingId
                    ? "Matéria atualizada!"
                    : "Matéria adicionada!"
            );

        }
    );

}


function renderSettingsSubjects() {

    const container =
        document.getElementById(
            "settingsSubjectsList"
        );


    if (!container) {
        return;
    }


    if (!subjects.length) {

        container.innerHTML = `
            <div class="settings-empty">
                Nenhuma matéria cadastrada.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    subjects.forEach(subject => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "settings-item";


        item.innerHTML = `

            <div class="settings-item-info">

                <span class="settings-item-title">
                    <span class="subject-color-dot" style="background:${getSubjectColor(subject.name)}"></span>${escapeHTML(
            subject.name
        )}
                </span>

                <span class="settings-item-meta">
                    ${Number(subject.hours || 0)}h
                    •
                    ${Number(subject.questions || 0)} questões planejadas
                </span>

            </div>


            <div class="settings-item-actions">

                <button
                    type="button"
                    class="small-btn"
                    data-edit-subject="${subject.id}"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    class="danger-btn"
                    data-delete-subject="${subject.id}"
                >
                    🗑️ Excluir
                </button>

            </div>

        `;


        container.appendChild(
            item
        );

    });


    container
        .querySelectorAll(
            "[data-edit-subject]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editSubject(
                        button.dataset.editSubject
                    );

                }
            );

        });


    container
        .querySelectorAll(
            "[data-delete-subject]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSubject(
                        button.dataset.deleteSubject
                    );

                }
            );

        });
}


function editSubject(id) {
    const subject = subjects.find(item => String(item.id) === String(id));
    const overlay = document.getElementById("subjectEditOverlay");
    if (!subject || !overlay) return;

    document.getElementById("modalSubjectId").value = subject.id;
    document.getElementById("modalSubjectName").value = subject.name || "";
    document.getElementById("modalSubjectColor").value = getSubjectColor(subject.name);
    document.getElementById("modalSubjectHours").value = horasParaTexto(subject.hours);
    document.getElementById("modalSubjectQuestions").value = subject.questions || 0;
    overlay.classList.remove("hidden");
    document.body.classList.add("subject-edit-open");
    document.getElementById("modalSubjectName").focus();
}

function closeSubjectEditModal() {
    document.getElementById("subjectEditOverlay")?.classList.add("hidden");
    document.body.classList.remove("subject-edit-open");
}

const subjectEditModalForm = document.getElementById("subjectEditModalForm");
if (subjectEditModalForm) {
    subjectEditModalForm.addEventListener("submit", event => {
        event.preventDefault();
        const id = document.getElementById("modalSubjectId").value;
        const subject = subjects.find(item => String(item.id) === String(id));
        if (!subject) return;
        const name = document.getElementById("modalSubjectName").value.trim();
        const hours = textoParaHoras(
            document.getElementById("modalSubjectHours").value
        );
        const questions = Number(document.getElementById("modalSubjectQuestions").value);
        if (!Number.isFinite(hours) || hours < 0) {
            alert("Informe um tempo válido no formato HH:MM:SS.");
            return;
        }
        subject.color = document.getElementById('modalSubjectColor').value;
        subject.name = name;
        subject.hours = hours;
        subject.questions = questions;
        saveSubjects();
        closeSubjectEditModal();
        renderSettingsSubjects();
        updateSubjectDatalist();
        renderCycle();
        if (typeof updateAll === "function") updateAll();
        showToast("Matéria atualizada!");
    });
    document.getElementById("closeSubjectEdit")?.addEventListener("click", closeSubjectEditModal);
    document.getElementById("cancelSubjectModal")?.addEventListener("click", closeSubjectEditModal);
    document.getElementById("subjectEditOverlay")?.addEventListener("click", event => {
        if (event.target.id === "subjectEditOverlay") closeSubjectEditModal();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeSubjectEditModal();
    });
}


async function deleteSubject(id) {

    const subject = subjects.find(
        item => String(item.id) === String(id)
    );

    if (!subject) return;

    const confirmed = await showConcursadoConfirm({
        title: "Excluir matéria?",
        message: `Deseja realmente excluir a matéria "${subject.name}"?`,
        confirmLabel: "Excluir matéria"
    });

    if (!confirmed) return;

    subjects = subjects.filter(
        item => String(item.id) !== String(id)
    );

    saveSubjects();
    renderSettingsSubjects();
    updateSubjectDatalist();
    renderCycle();

    showToast("Matéria excluída.");
}


function resetSubjectForm() {

    subjectForm?.reset();


    const editing =
        document.getElementById(
            "editingSubjectId"
        );


    if (editing) {
        editing.value = "";
    }


    const submit =
        subjectForm?.querySelector(
            'button[type="submit"]'
        );


    if (submit) {
        submit.textContent =
            "➕ Adicionar matéria";
    }


    const cancel =
        document.getElementById(
            "cancelSubjectEdit"
        );


    if (cancel) {
        cancel.classList.add(
            "hidden"
        );
    }
}


const cancelSubjectEdit =
    document.getElementById(
        "cancelSubjectEdit"
    );


if (cancelSubjectEdit) {

    cancelSubjectEdit.addEventListener(
        "click",
        resetSubjectForm
    );

}


function updateSubjectDatalist() {

    const selects = [
        document.getElementById("sessionSubject"),
        document.getElementById("stopwatchSubject"),
        document.getElementById("manualSubject")
    ].filter(Boolean);

    selects.forEach(select => {
        const current = select.value;
        select.innerHTML = `<option value="">Selecione uma matéria</option>`;

        subjects.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject.name;
            option.textContent = subject.name;
            select.appendChild(option);
        });

        if (subjects.some(subject => subject.name === current)) {
            select.value = current;
        }
    });

    const datalist = document.getElementById("subjectsDatalist");
    if (datalist) {
        datalist.innerHTML = subjects
            .map(subject => `<option value="${escapeHTML(subject.name)}"></option>`)
            .join("");
    }
}


/* =========================================================
   ESTATÍSTICAS
========================================================= */

const statsTabs =
    document.querySelectorAll(
        "[data-stats]"
    );


const statsContents = {

    tempo:
        document.getElementById(
            "statsTempo"
        ),

    categoria:
        document.getElementById(
            "statsCategoria"
        ),

    desempenho:
        document.getElementById(
            "statsDesempenho"
        ),

    simulado:
        document.getElementById(
            "statsSimulado"
        )

};


statsTabs.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            statsTabs.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            Object.values(
                statsContents
            ).forEach(
                content => {

                    content?.classList.remove(
                        "active"
                    );

                }
            );


            statsContents[
                button.dataset.stats
            ]?.classList.add(
                "active"
            );


            if (
                button.dataset.stats ===
                "simulado"
            ) {

                renderSimulationStatistics();

            }

        }
    );

});


const statsFilters =
    document.querySelectorAll(
        "[data-filter]"
    );


statsFilters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (
                button.classList.contains(
                    "premium"
                )
            ) {

                showToast(
                    "Essa função estará disponível em breve."
                );

                return;
            }


            statsFilters.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            updateStatistics(
                button.dataset.filter
            );

        }
    );

});


function getStudiesByFilter(filter) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    let start =
        new Date(today);


    if (filter === "day") {

        start =
            new Date(today);

    } else if (filter === "week") {

        start.setDate(
            start.getDate() -
            start.getDay()
        );

    } else if (filter === "month") {

        start =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

    } else if (filter === "year") {

        start =
            new Date(
                today.getFullYear(),
                0,
                1
            );

    } else if (filter === "all") {

        return [...studies];

    }


    const startKey =
        getDateKey(start);


    return studies.filter(
        study =>
            study.date >= startKey
    );
}


function updateStatistics(
    filter = "day"
) {

    const filtered =
        getStudiesByFilter(
            filter
        );


    const totalMinutes =
        filtered.reduce(
            (sum, study) =>
                sum + getStudyMinutes(study),
            0
        );


    const totalQuestions =
        filtered.reduce(
            (sum, study) =>
                sum +
                Number(study.questions || 0),
            0
        );


    const totalCorrect =
        filtered.reduce(
            (sum, study) =>
                sum +
                Number(study.correct || 0),
            0
        );


    const sessions =
        filtered.length;


    const average =
        sessions > 0
            ? totalMinutes / sessions
            : 0;


    const percent =
        totalQuestions > 0
            ? Math.round(
                (
                    totalCorrect /
                    totalQuestions
                ) * 100
            )
            : 0;


    /*
        IDs do HTML atual
    */

    setText(
        "statsStudyTime",
        formatStudyDuration(
            totalMinutes
        )
    );


    setText(
        "statsSessions",
        sessions
    );


    setText(
        "statsAverageSession",
        `${Math.round(average)}min`
    );


    setText(
        "statsQuestions",
        totalQuestions
    );


    setText(
        "statsCorrect",
        totalCorrect
    );


    setText(
        "statsAccuracy",
        `${percent}%`
    );


    /*
        IDs de versões anteriores,
        caso existam.
    */

    setText(
        "statStudyTime",
        formatStudyDuration(
            totalMinutes
        )
    );


    setText(
        "statQuestions",
        totalQuestions
    );


    setText(
        "statCorrect",
        totalCorrect
    );


    setText(
        "performanceQuestions",
        totalQuestions
    );


    setText(
        "performanceCorrect",
        totalCorrect
    );


    setText(
        "performancePercent",
        `${percent}%`
    );


    renderCategories(
        filtered
    );


    renderPerformance(
        filtered
    );


    renderTimeChart(
        filtered
    );


    const historyButton =
        document.querySelector(
            "[data-history-filter].active"
        );


    if (historyButton) {

        renderHistory(
            historyButton.dataset.historyFilter
        );

    }
}



/* =========================================================
   GRÁFICO DE TEMPO
   Semana de domingo a sábado
========================================================= */

function renderTimeChart(filtered) {

    const container = document.getElementById("timeChart");

    if (!container) return;

    // Mantém os registros reais de estudo por data.
    const byDate = {};

    filtered.forEach(study => {
        const dateObj = parseStudyDate({ date: study.date });

        if (!dateObj || isNaN(dateObj.getTime())) return;

        const key = [
            dateObj.getFullYear(),
            String(dateObj.getMonth() + 1).padStart(2, "0"),
            String(dateObj.getDate()).padStart(2, "0")
        ].join("-");

        byDate[key] = (byDate[key] || 0) + getStudyMinutes(study);
    });

    // Encontra o domingo da semana atual.
    const today = new Date();

    const sunday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
    );

    // Cria os sete dias, inclusive os que não têm estudos.
    const entries = [];

    for (let i = 0; i < 7; i++) {

        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);

        const key = [
            day.getFullYear(),
            String(day.getMonth() + 1).padStart(2, "0"),
            String(day.getDate()).padStart(2, "0")
        ].join("-");

        entries.push({
            date: day,
            minutes: byDate[key] || 0
        });
    }

    const max = Math.max(
        ...entries.map(item => item.minutes),
        1
    );

    const weekDays = [
        "Dom", "Seg", "Ter", "Qua",
        "Qui", "Sex", "Sáb"
    ];

    container.innerHTML = `
        <div
            style="
                width:100%;
                display:flex;
                align-items:flex-end;
                gap:8px;
                height:220px;
                padding:20px 0;
            "
        >
            ${entries.map(({ date, minutes }, index) => {

                const height = minutes > 0
                    ? Math.max(5, (minutes / max) * 150)
                    : 0;

                return `
                    <div
                        style="
                            flex:1;
                            min-width:0;
                            height:100%;
                            display:flex;
                            flex-direction:column;
                            justify-content:flex-end;
                            align-items:center;
                            gap:7px;
                        "
                    >
                        <small
                            style="
                                font-size:10px;
                                color:var(--muted);
                            "
                        >
                            ${Math.round(minutes)}m
                        </small>

                        <div
                            style="
                                width:100%;
                                max-width:45px;
                                height:${height}px;
                                border-radius:8px 8px 3px 3px;
                                background:linear-gradient(
                                    180deg,
                                    var(--green-light),
                                    var(--green)
                                );
                            "
                        ></div>

                        <small
                            style="
                                font-size:10px;
                                color:var(--muted);
                                text-align:center;
                            "
                        >
                            ${weekDays[index]}
                            ${String(date.getDate()).padStart(2, "0")}
                        </small>
                    </div>
                `;
            }).join("")}
        </div>
    `;

    // ==========================================
    // TEMPO POR MATÉRIA - MANTIDO
    // ==========================================

    const bySubject = {};

    filtered.forEach(study => {
        const name = study.subject || "Sem matéria";

        bySubject[name] =
            (bySubject[name] || 0) + getStudyMinutes(study);
    });

    const total = Object.values(bySubject)
        .reduce((sum, n) => sum + n, 0);

    if (total > 0) {

        container.insertAdjacentHTML(
            "beforeend",
            `
            <div class="subject-chart-breakdown">
                <h3 style="margin:20px 0 12px">
                    Tempo por matéria
                </h3>

                ${Object.entries(bySubject)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, minutes]) => `
                        <div style="margin:12px 0">
                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    gap:10px;
                                    font-size:12px;
                                    margin-bottom:6px;
                                "
                            >
                                <span>
                                    <span
                                        class="subject-color-dot"
                                        style="background:${getSubjectColor(name)}"
                                    ></span>
                                    ${escapeHTML(name)}
                                </span>

                                <strong>
                                    ${formatStudyDuration(minutes)}
                                </strong>
                            </div>

                            <div class="progress-track">
                                <div
                                    class="progress-fill"
                                    style="
                                        width:${minutes / total * 100}%;
                                        background:${getSubjectColor(name)};
                                    "
                                ></div>
                            </div>
                        </div>
                    `).join("")}
            </div>
            `
        );
    }
}



/* =========================================================
   GRÁFICO DE DESEMPENHO
========================================================= */

function renderPerformance(
    filtered
) {

    const container =
        document.getElementById(
            "performanceChart"
        );


    if (!container) {
        return;
    }


    if (!filtered.length) {

        container.innerHTML =
            "Nenhum dado de desempenho no período.";

        return;
    }


    const grouped = {};


    filtered.forEach(study => {

        const subject =
            study.subject ||
            "Sem matéria";


        if (!grouped[subject]) {

            grouped[subject] = {
                questions: 0,
                correct: 0
            };

        }


        grouped[subject].questions +=
            Number(
                study.questions || 0
            );


        grouped[subject].correct +=
            Number(
                study.correct || 0
            );

    });


    const rows =
        Object.entries(grouped)
            .map(
                ([name, data]) => {

                    const percent =
                        data.questions > 0
                            ? Math.round(
                                (
                                    data.correct /
                                    data.questions
                                ) * 100
                            )
                            : 0;


                    return {
                        name,
                        ...data,
                        percent
                    };

                }
            )
            .sort(
                (a, b) =>
                    b.percent -
                    a.percent
            );


    container.innerHTML = `

        <div
            style="
                display:flex;
                flex-direction:column;
                gap:14px;
                width:100%;
            "
        >

            ${rows.map(
        row => `

                    <div
                        style="
                            display:grid;
                            grid-template-columns:
                                120px 1fr 50px;
                            gap:10px;
                            align-items:center;
                        "
                    >

                        <span
                            style="
                                color:var(--muted);
                                font-size:12px;
                                overflow:hidden;
                                text-overflow:ellipsis;
                                white-space:nowrap;
                            "
                        >
                            ${escapeHTML(
            row.name
        )}
                        </span>

                        <div
                            style="
                                height:10px;
                                background:#26312c;
                                border-radius:99px;
                                overflow:hidden;
                            "
                        >

                            <div
                                style="
                                    width:${row.percent}%;
                                    height:100%;
                                    background:${getSubjectColor(row.name)};
                                    border-radius:inherit;
                                "
                            ></div>

                        </div>

                        <strong
                            style="
                                text-align:right;
                                font-size:12px;
                            "
                        >
                            ${row.percent}%
                        </strong>

                    </div>

                `
    ).join("")}

        </div>

    `;
}


/* =========================================================
   CATEGORIAS
========================================================= */

function renderCategories(
    filtered = studies
) {

    const container =
        document.getElementById(
            "categoryBars"
        );


    if (!container) {
        return;
    }


    const categories = {};


    filtered.forEach(study => {

        const category =
            study.category ||
            "Teoria";


        categories[category] =
            (
                categories[category] || 0
            ) +
            getStudyMinutes(study);

    });


    const entries =
        Object.entries(
            categories
        );


    if (!entries.length) {

        container.innerHTML = `
            <div class="settings-empty">
                Nenhum estudo registrado.
            </div>
        `;

        return;
    }


    const max =
        Math.max(
            ...entries.map(
                ([, value]) =>
                    value
            ),
            1
        );


    container.innerHTML =
        entries
            .map(
                ([category, minutes]) => {

                    const percent =
                        (
                            minutes /
                            max
                        ) * 100;


                    return `

                        <div class="bar-row">

                            <span class="bar-label">
                                ${escapeHTML(
                        category
                    )}
                            </span>

                            <div class="bar-track">

                                <div
                                    class="bar-fill"
                                    style="
                                        width:${percent}%;
                                    "
                                ></div>

                            </div>

                            <span class="bar-value">
                                ${formatStudyDuration(
                        minutes
                    )}
                            </span>

                        </div>

                    `;

                }
            )
            .join("");
}


function createBar(
    label,
    value,
    max
) {

    const percent =
        max > 0
            ? (
                value /
                max
            ) * 100
            : 0;


    return `

        <div class="bar-row">

            <span class="bar-label">
                ${escapeHTML(label)}
            </span>

            <div class="bar-track">

                <div
                    class="bar-fill"
                    style="width:${percent}%"
                ></div>

            </div>

            <span class="bar-value">
                ${Math.round(value)}
            </span>

        </div>

    `;
}


/* =========================================================
   RESUMO DO PAINEL
========================================================= */

function updateDashboardSummary() {

    const totalMinutes =
        studies.reduce(
            (sum, study) =>
                sum +
                getStudyMinutes(study),
            0
        );


    const totalQuestions =
        studies.reduce(
            (sum, study) =>
                sum +
                Number(study.questions || 0),
            0
        );


    const totalCorrect =
        studies.reduce(
            (sum, study) =>
                sum +
                Number(study.correct || 0),
            0
        );


    const accuracy =
        totalQuestions > 0
            ? Math.round(
                (
                    totalCorrect /
                    totalQuestions
                ) * 100
            )
            : 0;


    setText(
        "totalStudyTime",
        formatStudyDuration(
            totalMinutes
        )
    );


    setText(
        "totalQuestions",
        totalQuestions
    );


    setText(
        "totalAccuracy",
        `${accuracy}%`
    );

    // A contagem usa o mesmo histórico das outras abas.
    setText(
        "totalSessions",
        studies.length
    );
}


/* =========================================================
   SIMULADOS
========================================================= */

function renderSimulationSelect() {

    const select =
        document.getElementById(
            "simulationSelect"
        );


    const existing =
        document.getElementById(
            "existingSimulationSelect"
        );


    if (select) {

        const current =
            select.value;


        select.innerHTML = `
            <option value="">
                Selecione um simulado
            </option>

            ${simulations.map(
            simulation => `

                    <option
                        value="${simulation.id}"
                    >
                        ${escapeHTML(
                simulation.name
            )}
                    </option>

                `
        ).join("")}
        `;


        if (
            simulations.some(
                simulation =>
                    String(simulation.id) ===
                    String(current)
            )
        ) {

            select.value =
                current;

        }

    }


    if (existing) {

        const current =
            existing.value;


        existing.innerHTML = `
            <option value="">
                Selecione um simulado
            </option>

            ${simulations.map(
            simulation => `

                    <option
                        value="${simulation.id}"
                    >
                        ${escapeHTML(
                simulation.name
            )}
                    </option>

                `
        ).join("")}
        `;


        if (
            simulations.some(
                simulation =>
                    String(simulation.id) ===
                    String(current)
            )
        ) {

            existing.value =
                current;

        }


        renderExistingSimulationInfo();

    }
}


/*
    IMPORTANTE:

    Esses eventos são registrados UMA VEZ.

    Antes eles eram adicionados toda vez que
    renderSimulationSelect() era executado,
    causando vários eventos duplicados.
*/

const simulationSelect =
    document.getElementById(
        "simulationSelect"
    );


if (simulationSelect) {

    simulationSelect.addEventListener(
        "change",
        renderSimulationStatistics
    );

}


const existingSimulationSelect =
    document.getElementById(
        "existingSimulationSelect"
    );


if (existingSimulationSelect) {

    existingSimulationSelect.addEventListener(
        "change",
        renderExistingSimulationInfo
    );

}


function renderExistingSimulationInfo() {

    const select =
        document.getElementById(
            "existingSimulationSelect"
        );


    const info =
        document.getElementById(
            "selectedSimulationInfo"
        );


    if (!select || !info) {
        return;
    }


    const id =
        select.value;


    if (!id) {

        info.innerHTML =
            "Selecione um simulado para ver os detalhes.";

        return;
    }


    const simulation =
        simulations.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!simulation) {

        info.innerHTML =
            "Simulado não encontrado.";

        return;
    }


    const totalSeconds =
        (
            Number(
                simulation.hours || 0
            ) * 3600
        ) +
        (
            Number(
                simulation.minutes || 0
            ) * 60
        );


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds % 3600
            ) / 60
        );



    info.innerHTML = `

    <strong>
        ${escapeHTML(simulation.name)}
    </strong>

    <br>

    Tempo:
    ${hours}h ${String(minutes).padStart(2, "0")}min

`;
}



/* =========================================================
   MODOS DO SIMULADO
========================================================= */

const simulationModeButtons =
    document.querySelectorAll(
        "[data-simulation-mode]"
    );


simulationModeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            simulationModeButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            const mode =
                button.dataset.simulationMode;


            const existingBox =
                document.getElementById(
                    "existingSimulationBox"
                );


            const newBox =
                document.getElementById(
                    "newSimulationBox"
                );


            if (mode === "new") {

                existingBox?.classList.add(
                    "hidden"
                );

                newBox?.classList.remove(
                    "hidden"
                );

            } else {

                existingBox?.classList.remove(
                    "hidden"
                );

                newBox?.classList.add(
                    "hidden"
                );

            }

        }
    );

});


/* =========================================================
   INICIAR SIMULADO EXISTENTE
========================================================= */

const existingSimulationForm =
    document.getElementById(
        "existingSimulationForm"
    );


if (existingSimulationForm) {

    existingSimulationForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "existingSimulationSelect"
                )?.value;


            const simulation =
                simulations.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );


            if (!simulation) {

                showToast(
                    "Selecione um simulado."
                );

                return;
            }


            const totalSeconds =
                (
                    Number(
                        simulation.hours || 0
                    ) * 3600
                ) +
                (
                    Number(
                        simulation.minutes || 0
                    ) * 60
                );


            if (totalSeconds <= 0) {

                showToast(
                    "Esse simulado não possui tempo válido."
                );

                return;
            }


            startSimulationTimer(
                totalSeconds,
                simulation.name
            );

        }
    );

}



/* =========================================================
   CRIAR NOVO SIMULADO
========================================================= */

const simulationForm = document.getElementById("simulationForm");

if (simulationForm) {
    simulationForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("simulationName")?.value.trim();
        const duration = document.getElementById("simulationDuration")?.value.trim();

        if (!name) {
            showToast("Informe o nome do simulado.");
            return;
        }

        const match = duration?.match(/^(\d+):([0-5]\d):([0-5]\d)$/);

        if (!match) {
            showToast("Use o formato HH:MM:SS.");
            return;
        }

        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        const seconds = Number(match[3]);

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalSeconds <= 0) {
            showToast("Informe um tempo maior que zero.");
            return;
        }

        const simulation = {
            id: Date.now(),
            name,
            date: formatDateShort(new Date()),
            hours,
            minutes,
            seconds,
            questions: 0,
            correct: 0,
            subjects: []
        };

        simulations.push(simulation);
        saveSimulations();

        renderSimulationSelect();
        renderSavedSimulations();
        renderSettingsSimulations();
        renderSimulationStatistics();

        simulationForm.reset();

        showToast("Simulado criado!");

        startSimulationTimer(totalSeconds, simulation.name);
    });
}



/* =========================================================
   LISTA DE SIMULADOS SALVOS
========================================================= */

function renderSavedSimulations() {

    const container =
        document.getElementById(
            "savedSimulationsList"
        );


    if (!container) {
        return;
    }


    renderSimulationList(
        container
    );
}


function renderSimulationList(
    container
) {

    if (!container) {
        return;
    }


    if (!simulations.length) {

        container.innerHTML = `
            <div class="settings-empty">
                Nenhum simulado salvo.
            </div>
        `;

        return;
    }


    container.innerHTML =
        simulations
            .map(
                simulation => `

                    <div class="saved-simulation-item">

                        <div class="saved-simulation-info">

                            <strong>
                                ${escapeHTML(
                    simulation.name
                )}
                            </strong>

                            <span>
                                ${simulation.hours || 0}h
                                ${String(
                    simulation.minutes || 0
                ).padStart(2, "0")}min
                                •
                                ${Number(
                    simulation.questions || 0
                )} questões
                            </span>

                        </div>

                        <div class="saved-simulation-actions">

                            <button
                                type="button"
                                class="small-btn"
                                data-use-simulation="${simulation.id}"
                            >
                                ▶ Usar
                            </button>

                            <button
                                type="button"
                                class="danger-btn"
                                data-delete-simulation="${simulation.id}"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>

                `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-use-simulation]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.useSimulation;


                    const select =
                        document.getElementById(
                            "existingSimulationSelect"
                        );


                    if (select) {

                        select.value =
                            id;

                        renderExistingSimulationInfo();

                    }


                    showSection(
                        "simulado"
                    );

                }
            );

        });


    container
        .querySelectorAll(
            "[data-delete-simulation]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSimulation(
                        button.dataset.deleteSimulation
                    );

                }
            );

        });
}


/* =========================================================
   CONFIGURAÇÕES — SIMULADOS
========================================================= */

const settingsSimulationForm =
    document.getElementById(
        "settingsSimulationForm"
    );


if (settingsSimulationForm) {

    settingsSimulationForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const editingId =
                document.getElementById(
                    "editingSimulationId"
                )?.value;


            const name =
                document.getElementById(
                    "settingsSimulationName"
                )?.value.trim();


            const time =
                document.getElementById("settingsSimulationTime")?.value || "00:00:00";

            const [hours, minutes, seconds] =
                time.split(":").map(Number);


            const questions =
                Number(
                    document.getElementById(
                        "settingsSimulationQuestions"
                    )?.value || 0
                );


            if (!name) {

                showToast(
                    "Informe o nome do simulado."
                );

                return;
            }


            if (
                hours <= 0 &&
                minutes <= 0
            ) {

                showToast(
                    "Informe um tempo válido."
                );

                return;
            }


            if (questions <= 0) {

                showToast(
                    "Informe a quantidade de questões."
                );

                return;
            }


            if (editingId) {

                const simulation =
                    simulations.find(
                        item =>
                            String(item.id) ===
                            String(editingId)
                    );


                if (simulation) {

                    simulation.name =
                        name;

                    simulation.hours =
                        Math.max(
                            0,
                            hours
                        );

                    simulation.minutes =
                        Math.min(
                            59,
                            Math.max(
                                0,
                                minutes
                            )
                        );

                    simulation.questions =
                        Math.max(
                            1,
                            questions
                        );

                }

            } else {

                simulations.push({

                    id:
                        Date.now(),

                    name,

                    date:
                        formatDateShort(
                            new Date()
                        ),

                    hours:
                        Math.max(
                            0,
                            hours
                        ),

                    minutes:
                        Math.min(
                            59,
                            Math.max(
                                0,
                                minutes
                            )
                        ),

                    questions:
                        Math.max(
                            1,
                            questions
                        ),

                    correct: 0,

                    subjects: []

                });

            }


            saveSimulations();


            resetSimulationSettingsForm();


            renderSimulationSelect();

            renderSavedSimulations();

            renderSettingsSimulations();

            renderSimulationStatistics();


            showToast(
                editingId
                    ? "Simulado atualizado!"
                    : "Simulado criado!"
            );

        }
    );

}


function renderSettingsSimulations() {

    const container =
        document.getElementById(
            "settingsSimulationsList"
        );


    if (!container) {
        return;
    }


    if (!simulations.length) {

        container.innerHTML = `
            <div class="settings-empty">
                Nenhum simulado cadastrado.
            </div>
        `;

        return;
    }


    container.innerHTML =
        simulations
            .map(
                simulation => `

                    <div class="settings-item">

                        <div class="settings-item-info">

                            <span class="settings-item-title">
                                ${escapeHTML(
                    simulation.name
                )}
                            </span>

                            <span class="settings-item-meta">
                                ${simulation.hours || 0}h
                                ${String(
                    simulation.minutes || 0
                ).padStart(2, "0")}min
                                •
                                ${Number(
                    simulation.questions || 0
                )} questões
                            </span>

                        </div>

                        <div class="settings-item-actions">

                            <button
                                type="button"
                                class="small-btn"
                                data-edit-simulation="${simulation.id}"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="danger-btn"
                                data-delete-settings-simulation="${simulation.id}"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>

                `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-edit-simulation]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editSimulation(
                        button.dataset.editSimulation
                    );

                }
            );

        });


    container
        .querySelectorAll(
            "[data-delete-settings-simulation]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSimulation(
                        button.dataset.deleteSettingsSimulation
                    );

                }
            );

        });
}


function editSimulation(id) {
    const simulation = simulations.find(item => String(item.id) === String(id));
    const overlay = document.getElementById('simulationEditOverlay');
    if (!simulation || !overlay) return;
    document.getElementById('modalSimulationId').value = simulation.id;
    document.getElementById('modalSimulationName').value = simulation.name || '';
    const hours = Math.max(0, Number(simulation.hours) || 0);
    const minutes = Math.max(0, Number(simulation.minutes) || 0);
    document.getElementById('modalSimulationTime').value =
        [hours, minutes, 0].map(n => String(n).padStart(2, '0')).join(':');
    document.getElementById('modalSimulationQuestions').value = simulation.questions || 0;
    overlay.classList.remove('hidden');
    document.body.classList.add('subject-edit-open');
    document.getElementById('modalSimulationName').focus();
}
function closeSimulationEditModal() {
    document.getElementById('simulationEditOverlay')?.classList.add('hidden');
    document.body.classList.remove('subject-edit-open');
}
document.getElementById('simulationEditModalForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const id = document.getElementById('modalSimulationId').value;
    const name = document.getElementById('modalSimulationName').value.trim();
    const time = document.getElementById('modalSimulationTime').value.trim();
    const questions = Number(document.getElementById('modalSimulationQuestions').value);
    const match = time.match(/^(\d+):([0-5]\d):([0-5]\d)$/);
    if (!name || !match || !(questions > 0)) {
        alert('Preencha nome, tempo (HH:MM:SS) e questões corretamente.'); return;
    }
    const simulation = simulations.find(item => String(item.id) === String(id));
    if (!simulation) return;
    simulation.name = name;
    simulation.hours = Number(match[1]);
    simulation.minutes = Number(match[2]) + Number(match[3]) / 60;
    simulation.questions = questions;
    saveSimulations();
    closeSimulationEditModal();
    renderSimulationSelect();
    renderSavedSimulations();
    renderSettingsSimulations();
    if (typeof updateAll === 'function') updateAll();
    showToast('Simulado atualizado!');
});
['closeSimulationEdit','cancelSimulationModal'].forEach(id =>
    document.getElementById(id)?.addEventListener('click', closeSimulationEditModal));
document.getElementById('simulationEditOverlay')?.addEventListener('click', event => {
    if (event.target.id === 'simulationEditOverlay') closeSimulationEditModal();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSimulationEditModal();
});

function resetSimulationSettingsForm() {

    settingsSimulationForm?.reset();


    const editing =
        document.getElementById(
            "editingSimulationId"
        );


    if (editing) {
        editing.remove();
    }


    const submit =
        settingsSimulationForm?.querySelector(
            'button[type="submit"]'
        );


    if (submit) {

        submit.textContent =
            "➕ Criar simulado";

    }


    const cancel =
        document.getElementById(
            "cancelSimulationEdit"
        );


    if (cancel) {

        cancel.classList.add(
            "hidden"
        );

    }
}


async function deleteSimulation(id) {

    const simulation =
        simulations.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!simulation) {
        return;
    }


    const confirmed = await showConcursadoConfirm({
        title: "Excluir simulado?",
        message: `Deseja realmente excluir o simulado "${simulation.name}"?`,
        confirmLabel: "Excluir simulado"
    });


    if (!confirmed) {
        return;
    }


    simulations =
        simulations.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveSimulations();


    renderSimulationSelect();

    renderSavedSimulations();

    renderSettingsSimulations();

    renderSimulationStatistics();


    showToast(
        "Simulado excluído."
    );
}


/* =========================================================
   ESTATÍSTICAS DOS SIMULADOS
========================================================= */

function renderSimulationStatistics() {

    renderSimulationSelect();


    const select =
        document.getElementById(
            "simulationSelect"
        );


    const selectedId =
        select?.value;


    const simulation =
        simulations.find(
            item =>
                String(item.id) ===
                String(selectedId)
        );


    if (!simulation) {

        setText(
            "simulationQuestions",
            "0"
        );


        setText(
            "simulationCorrect",
            "0"
        );


        setText(
            "simulationPercent",
            "0%"
        );

    } else {

        const questions =
            Number(
                simulation.questions || 0
            );


        const correct =
            Number(
                simulation.correct || 0
            );


        const percent =
            questions > 0
                ? Math.round(
                    (
                        correct /
                        questions
                    ) * 100
                )
                : 0;


        setText(
            "simulationQuestions",
            questions
        );


        setText(
            "simulationCorrect",
            correct
        );


        setText(
            "simulationPercent",
            `${percent}%`
        );

    }


    renderSimulationEvolution();

    renderSimulationSubjects();
}


function renderSimulationEvolution() {

    const line =
        document.getElementById(
            "simulationChartLine"
        );


    const area =
        document.getElementById(
            "simulationChartArea"
        );


    const points =
        document.getElementById(
            "simulationChartPoints"
        );


    const labels =
        document.getElementById(
            "simulationChartLabels"
        );


    if (
        !line ||
        !area ||
        !points ||
        !labels
    ) {
        return;
    }


    if (!simulations.length) {

        line.setAttribute(
            "d",
            ""
        );

        area.setAttribute(
            "d",
            ""
        );

        points.innerHTML =
            "";

        labels.innerHTML =
            "";

        return;
    }


    const width =
        800;


    const height =
        230;


    const padding =
        25;


    const data =
        simulations.map(
            simulation => {

                const questions =
                    Number(
                        simulation.questions || 0
                    );


                const correct =
                    Number(
                        simulation.correct || 0
                    );


                return {

                    simulation,

                    percent:
                        questions > 0
                            ? (
                                correct /
                                questions
                            ) * 100
                            : 0

                };

            }
        );


    const maxIndex =
        Math.max(
            1,
            data.length - 1
        );


    const coords =
        data.map(
            (item, index) => {

                const x =
                    padding +
                    (
                        index /
                        maxIndex
                    ) *
                    (
                        width -
                        padding * 2
                    );


                const y =
                    height -
                    padding -
                    (
                        item.percent /
                        100
                    ) *
                    (
                        height -
                        padding * 2
                    );


                return {
                    ...item,
                    x,
                    y
                };

            }
        );


    const path =
        coords
            .map(
                (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
            )
            .join(" ");


    line.setAttribute(
        "d",
        path
    );


    const areaPath =
        coords.length > 0
            ? `${path}
               L ${coords[coords.length - 1].x} ${height - padding}
               L ${coords[0].x} ${height - padding}
               Z`
            : "";


    area.setAttribute(
        "d",
        areaPath
    );


    points.innerHTML =
        coords
            .map(
                point => `

                    <circle
                        class="chart-point"
                        cx="${point.x}"
                        cy="${point.y}"
                        r="6"
                    >
                        <title>
                            ${escapeHTML(
                    point.simulation.name
                )}
                            —
                            ${Math.round(
                    point.percent
                )}%
                        </title>
                    </circle>

                `
            )
            .join("");


    labels.innerHTML =
        coords
            .map(
                point => `

                    <span>
                        ${escapeHTML(
                    point.simulation.name
                )}
                    </span>

                `
            )
            .join("");
}


function renderSimulationSubjects() {

    const container =
        document.getElementById(
            "simulationSubjectBars"
        );


    if (!container) {
        return;
    }


    const grouped = {};


    simulations.forEach(
        simulation => {

            if (
                !Array.isArray(
                    simulation.subjects
                )
            ) {
                return;
            }


            simulation.subjects.forEach(
                subject => {

                    const name =
                        subject.name ||
                        "Sem matéria";


                    if (!grouped[name]) {

                        grouped[name] = {
                            questions: 0,
                            correct: 0
                        };

                    }


                    grouped[name].questions +=
                        Number(
                            subject.questions || 0
                        );


                    grouped[name].correct +=
                        Number(
                            subject.correct || 0
                        );

                }
            );

        }
    );


    const entries =
        Object.entries(
            grouped
        );


    if (!entries.length) {

        container.innerHTML = `
            <div class="settings-empty">
                Ainda não há desempenho por matéria nos simulados.
            </div>
        `;

        return;
    }


    container.innerHTML =
        entries
            .map(
                ([name, data]) => {

                    const percent =
                        data.questions > 0
                            ? Math.round(
                                (
                                    data.correct /
                                    data.questions
                                ) * 100
                            )
                            : 0;


                    return `

                        <div class="simulation-bar-row">

                            <span
                                class="bar-label"
                                title="${escapeHTML(name)}"
                            >
                                ${escapeHTML(name)}
                            </span>

                            <div class="simulation-bar-track">

                                <div
                                    class="simulation-bar-fill"
                                    style="
                                        width:${percent}%;
                                    "
                                ></div>

                            </div>

                            <strong
                                class="bar-value"
                            >
                                ${percent}%
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");
}


/* =========================================================
   TIMER DO SIMULADO
========================================================= */

const SIMULATION_MARKS = [
    [18000, "5h"], [16200, "4h30"], [14400, "4h"],
    [12600, "3h30"], [10800, "3h"], [9000, "2h30"],
    [7200, "2h"], [5400, "1h30"], [3600, "1h"],
    [2700, "45min"], [1800, "30min"], [900, "15min"], [0, "0h"]
];
let simulationInterval = null;
let simulationRemaining = 0;
let simulationInitial = 0;
let simulationRunning = false;
let simulationStarted = false;
let simulationDeadline = 0;

function simulationButtons() {
    const toggle = (id, show) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle("hidden", !show);
    };
    toggle("startSimulation", !simulationStarted);
    toggle("pauseSimulation", simulationStarted && simulationRunning);
    toggle("continueSimulation", simulationStarted && !simulationRunning && simulationRemaining > 0);
}

function startSimulationTimer(seconds, name) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    simulationRemaining = Math.max(0, Math.floor(Number(seconds) || 0));
    simulationInitial = simulationRemaining;
    simulationRunning = false;
    simulationStarted = false;
    document.getElementById("simulationTimer")?.classList.remove("hidden");
    document.getElementById("simulationEndOverlay")?.classList.add("hidden");
    setText("simulationTimerName", name || "Simulado");
    updateSimulationTimerUI();
    simulationButtons();
}


function updateSimulationTimerUI() {
    const total = Math.max(0, Math.ceil(simulationRemaining));

    setText(
        "simulationTimerStatus",
        total === 0
            ? "Tempo encerrado"
            : simulationRunning
                ? "Prova em andamento"
                : simulationStarted
                    ? "Simulado pausado"
                    : "Pronto para iniciar"
    );

    // Esconde o relógio digital
    const digitalClock = document.getElementById(
        "simulationTimerDisplay"
    );

    if (digitalClock) {
        digitalClock.style.display = "none";
    }

    // Quadro de horários
    const board = document.getElementById(
        "simulationTimeBoard"
    );

    if (board) {
        board.innerHTML = total === 0
            ? ""
            : SIMULATION_MARKS
                .filter(([seconds]) => seconds <= simulationInitial)
                .map(([seconds, label]) => {
                    // A marca inicial já fica riscada assim que a prova começa.
                    // As demais são riscadas quando o tempo restante as alcança.
                    const crossed = simulationStarted && total <= seconds;
                    return `<span class="simulation-time-mark${crossed ? ' crossed' : ''}"${crossed ? ' style="text-decoration:line-through !important;text-decoration-thickness:2px !important;text-decoration-color:#ffdf00 !important;opacity:.65"' : ''}>${label}</span>`;
                })
                .join("");
    }
}


function tickSimulation() {
    if (!simulationRunning) return;
    simulationRemaining = Math.max(0, Math.ceil((simulationDeadline - Date.now()) / 1000));
    updateSimulationTimerUI();
    if (simulationRemaining <= 0) finishSimulationTimer(true);
}

function runSimulation() {
    if (simulationRemaining <= 0 || simulationRunning) return;
    simulationStarted = true;
    simulationRunning = true;
    simulationDeadline = Date.now() + simulationRemaining * 1000;
    clearInterval(simulationInterval);
    simulationInterval = setInterval(tickSimulation, 250);
    simulationButtons();
    updateSimulationTimerUI();
}

function pauseSimulationTimer() {
    if (!simulationRunning) return;
    tickSimulation();
    if (!simulationRunning) return;
    simulationRunning = false;
    clearInterval(simulationInterval);
    simulationInterval = null;
    simulationButtons();
    updateSimulationTimerUI();
}

function finishSimulationTimer(automatic = false) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    simulationRunning = false;
    simulationStarted = false;
    simulationRemaining = 0;
    updateSimulationTimerUI();
    simulationButtons();
    if (automatic) {
        document.getElementById("simulationEndOverlay")?.classList.remove("hidden");
    } else {
        document.getElementById("simulationTimer")?.classList.add("hidden");
        document.getElementById("simulationEndOverlay")?.classList.add("hidden");
        showToast("Simulado finalizado.");
    }
}

document.getElementById("startSimulation")?.addEventListener("click", runSimulation);
document.getElementById("pauseSimulation")?.addEventListener("click", pauseSimulationTimer);
document.getElementById("continueSimulation")?.addEventListener("click", runSimulation);
document.getElementById("finishSimulation")?.addEventListener("click", () => finishSimulationTimer(false));
document.getElementById("dismissSimulationEnd")?.addEventListener("click", () => {
    document.getElementById("simulationEndOverlay")?.classList.add("hidden");
});

/* =========================================================
   POMODORO / SESSÃO DE ESTUDO
========================================================= */

const SESSION_STORAGE_KEY =
    userStorageKey("aprovado_active_session");


let timerInterval =
    null;


let timerSeconds =
    0;


let timerRunning =
    false;


let timerMode =
    "focus";


let sessionData =
    null;


/* =========================================================
   SALVAR SESSÃO ATIVA
========================================================= */

function saveActiveSession() {

    if (!sessionData) {
        return;
    }


    const data = {

        ...sessionData,

        elapsedSeconds:
            Number(
                sessionData.elapsedSeconds || 0
            ),

        timerRunning,

        timerMode,

        lastResumeTime:
            timerRunning
                ? Date.now()
                : null

    };


    localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   CARREGAR SESSÃO ATIVA
========================================================= */

function loadActiveSession() {

    const raw =
        localStorage.getItem(
            SESSION_STORAGE_KEY
        );


    if (!raw) {
        return;
    }


    try {

        const data =
            JSON.parse(raw);


        if (!data) {
            return;
        }


        /*
            Corrige sessões antigas que não tinham
            sessionId.
        */

        if (!data.sessionId) {

            data.sessionId =
                `session-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`;

        }


        sessionData = {

            ...data,

            subject:
                data.subject || "",

            totalMinutes:
                Number(
                    data.totalMinutes || 0
                ),

            focus:
                Number(
                    data.focus || 50
                ),

            breakTime:
                Number(
                    data.breakTime || 10
                ),

            questions:
                Number(
                    data.questions || 0
                ),

            category:
                data.category ||
                "Teoria",

            elapsedSeconds:
                Number(
                    data.elapsedSeconds || 0
                ),

            sessionId:
                data.sessionId

        };


        timerMode =
            data.timerMode ||
            "focus";


        /*
            Uma sessão salva nunca deve voltar a rodar sozinha.
            Ao recarregar a página, ela volta pausada e só continua
            quando o usuário clicar em "Continuar".
        */
        timerRunning = false;
        sessionData.timerRunning = false;


        const totalSeconds =
            sessionData.totalMinutes *
            60;


        if (
            sessionData.elapsedSeconds >=
            totalSeconds
        ) {

            sessionData.elapsedSeconds =
                totalSeconds;


            timerRunning =
                false;


            saveActiveSession();


            finishTimerAutomatically();


            return;
        }


        syncTimerFromElapsed();


        updateTimerUI();


        const timerCard =
            document.getElementById(
                "studyTimerCard"
            );


        if (timerCard) {

            timerCard.classList.remove(
                "hidden"
            );

        }


        /*
            Salva imediatamente a nova referência
            de tempo para evitar contagem duplicada.
        */

        saveActiveSession();


        // NÃ£o iniciar automaticamente após recarregar a página.
        // O usuário precisa clicar em "Continuar" no timer.

    } catch (error) {

        console.error(
            "Erro ao carregar sessão:",
            error
        );

        localStorage.removeItem(
            SESSION_STORAGE_KEY
        );

    }
}


/* =========================================================
   SINCRONIZAÇÃO DO TIMER
========================================================= */

function syncTimerFromElapsed() {

    if (!sessionData) {
        return;
    }


    const totalSeconds =
        Number(
            sessionData.totalMinutes || 0
        ) * 60;


    const focusSeconds =
        Math.max(
            1,
            Number(
                sessionData.focus || 50
            ) * 60
        );


    const breakSeconds =
        Math.max(
            0,
            Number(
                sessionData.breakTime || 0
            ) * 60
        );


    let elapsed =
        Math.max(
            0,
            Number(
                sessionData.elapsedSeconds || 0
            )
        );


    elapsed =
        Math.min(
            elapsed,
            totalSeconds
        );


    /*
        Sem pausa
    */

    if (breakSeconds <= 0) {

        timerMode =
            "focus";


        timerSeconds =
            Math.max(
                0,
                totalSeconds - elapsed
            );


        return;
    }


    let remainingSession =
        totalSeconds -
        elapsed;


    if (remainingSession <= 0) {

        timerMode =
            "focus";

        timerSeconds =
            0;

        return;
    }


    /*
        Descobre o ciclo atual.

        foco + pausa
    */

    const cycle =
        focusSeconds +
        breakSeconds;


    let cyclePosition =
        elapsed % cycle;


    if (
        cyclePosition <
        focusSeconds
    ) {

        timerMode =
            "focus";


        timerSeconds =
            Math.min(
                focusSeconds -
                cyclePosition,
                remainingSession
            );

    } else {

        timerMode =
            "break";


        timerSeconds =
            Math.min(
                cycle -
                cyclePosition,
                remainingSession
            );

    }
}


/* =========================================================
   MODOS DE ESTUDO
========================================================= */

let studyMode = "pomodoro";
let stopwatchInterval = null;
let stopwatchRunning = false;
let stopwatchSubject = "";
let stopwatchAccumulatedSeconds = 0;
let stopwatchStartedAt = null;
let pendingCompletion = null;

const PENDING_COMPLETION_KEY = userStorageKey("aprovado_pending_completion");
const STOPWATCH_STORAGE_KEY = userStorageKey("aprovado_active_stopwatch");


function formatSecondsHMS(totalSeconds) {
    const total = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function secondsToStudyTime(totalSeconds) {
    return formatSecondsHMS(totalSeconds);
}


function parseCompletionTimeToSeconds(value) {
    const text = String(value ?? "").trim();

    if (!text) {
        return 0;
    }

    // HH:MM:SS
    if (/^\d{1,3}:\d{1,2}:\d{1,2}$/.test(text)) {
        const [hours, minutes, seconds] = text.split(":").map(Number);

        if (minutes > 59 || seconds > 59) {
            return -1;
        }

        return (hours * 3600) + (minutes * 60) + seconds;
    }

    // Também aceita MM:SS para facilitar a correção de tempos curtos.
    if (/^\d{1,4}:\d{1,2}$/.test(text)) {
        const [minutes, seconds] = text.split(":").map(Number);

        if (seconds > 59) {
            return -1;
        }

        return (minutes * 60) + seconds;
    }

    return -1;
}


function setStudyMode(mode) {
    studyMode = mode;

    document.querySelectorAll("[data-study-mode]").forEach(button => {
        button.classList.toggle("active", button.dataset.studyMode === mode);
    });

    document.getElementById("pomodoroModeBox")?.classList.toggle("hidden", mode !== "pomodoro");
    document.getElementById("stopwatchModeBox")?.classList.toggle("hidden", mode !== "stopwatch");
    document.getElementById("manualModeBox")?.classList.toggle("hidden", mode !== "manual");
}


document.querySelectorAll("[data-study-mode]").forEach(button => {
    button.addEventListener("click", () => setStudyMode(button.dataset.studyMode));
});


function showCompletionForm(completion) {
    pendingCompletion = {
        ...completion,
        seconds: Math.max(0, Math.round(Number(completion.seconds || 0)))
    };

    localStorage.setItem(PENDING_COMPLETION_KEY, JSON.stringify(pendingCompletion));

    const card = document.getElementById("studyCompletionCard");
    const overlay = document.getElementById("studyCompletionOverlay");
    if (!card || !overlay) return;

    document.getElementById("completionSubject").value = pendingCompletion.subject || "Estudo";
    document.getElementById("completionTime").value = secondsToStudyTime(pendingCompletion.seconds);
    document.getElementById("completionQuestions").value = 0;
    document.getElementById("completionCorrect").value = 0;
    document.getElementById("completionCategory").value = pendingCompletion.category || "Teoria";

    overlay.classList.remove("hidden");
    document.body.classList.add("completion-modal-open");
}


function hideCompletionForm() {
    document.getElementById("studyCompletionOverlay")?.classList.add("hidden");
    document.body.classList.remove("completion-modal-open");
}


function saveCompletedStudy(completion, questions, correct, category) {
    const totalQuestions = Math.max(0, Number(questions || 0));
    const totalCorrect = Math.max(0, Number(correct || 0));

    if (totalCorrect > totalQuestions) {
        showToast("Os acertos não podem ser maiores que a quantidade de questões.");
        return false;
    }

    const sessionId = completion.sessionId || `study-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (!studies.some(study => study.sessionId === sessionId)) {
        studies.push({
            id: Date.now(),
            sessionId,
            subject: completion.subject || "Estudo",
            time: secondsToStudyTime(completion.seconds || 0),
            questions: totalQuestions,
            correct: totalCorrect,
            category: category || "Teoria",
            date: getDateKey(new Date())
        });

        saveStudies();
    }

    return true;
}


const studyCompletionForm = document.getElementById("studyCompletionForm");

if (studyCompletionForm) {
    studyCompletionForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!pendingCompletion) {
            showToast("Não há uma sessão para registrar.");
            return;
        }

        const questions = Number(document.getElementById("completionQuestions")?.value || 0);
        const correct = Number(document.getElementById("completionCorrect")?.value || 0);
        const category = document.getElementById("completionCategory")?.value || "Teoria";
        const completionTimeInput = document.getElementById("completionTime");
        const editedSeconds = parseCompletionTimeToSeconds(completionTimeInput?.value);

        if (editedSeconds < 0) {
            showToast("Informe o tempo no formato HH:MM:SS. Ex.: 01:25:30");
            completionTimeInput?.focus();
            return;
        }

        if (editedSeconds <= 0) {
            showToast("O tempo estudado precisa ser maior que zero.");
            completionTimeInput?.focus();
            return;
        }

        // O tempo editado pelo usuário passa a ser o tempo salvo no histórico.
        pendingCompletion.seconds = editedSeconds;

        if (!saveCompletedStudy(pendingCompletion, questions, correct, category)) return;

        pendingCompletion = null;
        localStorage.removeItem(PENDING_COMPLETION_KEY);
        hideCompletionForm();
        updateAll();
        showToast("Estudo registrado e estatísticas atualizadas!");
    });
}


function loadPendingCompletion() {
    const raw = localStorage.getItem(PENDING_COMPLETION_KEY);
    if (!raw) return;

    try {
        const data = JSON.parse(raw);
        if (data && data.subject) {
            pendingCompletion = data;
            showCompletionForm(data);
        }
    } catch {
        localStorage.removeItem(PENDING_COMPLETION_KEY);
    }
}


/* =========================================================
   FORMULÁRIO DO POMODORO
========================================================= */

function parsePomodoroTimeToSeconds(value) {
    const text = String(value ?? "").trim();

    if (!/^\d{1,3}:\d{1,2}:\d{1,2}$/.test(text)) {
        return -1;
    }

    const [hours, minutes, seconds] = text.split(":").map(Number);

    if (minutes > 59 || seconds > 59) {
        return -1;
    }

    return (hours * 3600) + (minutes * 60) + seconds;
}

function formatPomodoroInputTime(totalSeconds) {
    const total = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const pomodoroForm = document.getElementById("pomodoroForm");

if (pomodoroForm) {
    // Enter nos campos do formulário nã pode iniciar o Pomodoro.
    // O início acontece somente quando o usuário clica no botão.
    pomodoroForm.addEventListener("keydown", event => {
        if (event.key === "Enter" && event.target?.tagName !== "BUTTON") {
            event.preventDefault();
        }
    });

    pomodoroForm.addEventListener("submit", event => {
        event.preventDefault();

        const subject = document.getElementById("sessionSubject")?.value.trim();

        const totalSeconds = parsePomodoroTimeToSeconds(
            document.getElementById("sessionTotalMinutes")?.value
        );
        const focusSeconds = parsePomodoroTimeToSeconds(
            document.getElementById("sessionFocusMinutes")?.value
        );
        const breakSeconds = parsePomodoroTimeToSeconds(
            document.getElementById("sessionBreakMinutes")?.value
        );

        if (!subject) {
            showToast("Selecione uma matéria.");
            return;
        }

        if (totalSeconds <= 0) {
            showToast("Informe o tempo total no formato HH:MM:SS. Ex.: 02:00:00");
            return;
        }

        if (focusSeconds <= 0) {
            showToast("O tempo de foco precisa ser maior que zero no formato HH:MM:SS.");
            return;
        }

        if (breakSeconds < 0) {
            showToast("A pausa deve estar no formato HH:MM:SS. Ex.: 00:10:00");
            return;
        }

        if (sessionData && timerRunning) {
            if (!confirm("Já existe uma sessão em andamento. Deseja substituí-la?")) return;
        }

        hideCompletionForm();
        pendingCompletion = null;
        localStorage.removeItem(PENDING_COMPLETION_KEY);

        sessionData = {
            sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            subject,
            // O restante do sistema trabalha em minutos; mantemos os segundos
            // como fração para preservar exatamente o HH:MM:SS informado.
            totalMinutes: totalSeconds / 60,
            focus: focusSeconds / 60,
            breakTime: breakSeconds / 60,
            questions: 0,
            category: "Teoria",
            elapsedSeconds: 0
        };

        timerMode = "focus";
        timerRunning = true;
        syncTimerFromElapsed();

        document.getElementById("studyTimerCard")?.classList.remove("hidden");
        updateTimerUI();
        saveActiveSession();
        startTimerInterval();

        showToast("Pomodoro iniciado!");
        document.getElementById("studyTimerCard")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}


/* =========================================================
   CRONÃ”METRO
========================================================= */

function getStopwatchElapsedSeconds() {
    if (!stopwatchRunning || !stopwatchStartedAt) {
        return Math.max(0, Math.floor(stopwatchAccumulatedSeconds));
    }

    return Math.max(
        0,
        Math.floor(stopwatchAccumulatedSeconds + ((Date.now() - stopwatchStartedAt) / 1000))
    );
}


function updateStopwatchUI() {
    const display = document.getElementById("stopwatchDisplay");
    const subject = document.getElementById("stopwatchSubjectLabel");
    const status = document.getElementById("stopwatchStatus");
    const pause = document.getElementById("pauseStopwatch");

    if (display) display.textContent = formatSecondsHMS(getStopwatchElapsedSeconds());
    if (subject) subject.textContent = stopwatchSubject || "-";
    if (status) status.textContent = stopwatchRunning ? "Cronômetro em andamento" : "Cronômetro pausado";
    if (pause) pause.textContent = stopwatchRunning ? "⏸ Pausar" : "▶ Continuar";
}


function saveActiveStopwatch() {
    if (!stopwatchSubject) return;

    localStorage.setItem(STOPWATCH_STORAGE_KEY, JSON.stringify({
        subject: stopwatchSubject,
        accumulatedSeconds: getStopwatchElapsedSeconds(),
        running: stopwatchRunning,
        startedAt: stopwatchRunning ? stopwatchStartedAt : null
    }));
}


function startStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchRunning = true;
    stopwatchStartedAt = Date.now();

    stopwatchInterval = setInterval(() => {
        updateStopwatchUI();
        saveActiveStopwatch();
    }, 500);

    document.getElementById("stopwatchCard")?.classList.remove("hidden");
    updateStopwatchUI();
    saveActiveStopwatch();
}


function pauseStopwatch() {
    if (!stopwatchRunning) return;

    stopwatchAccumulatedSeconds = getStopwatchElapsedSeconds();
    stopwatchRunning = false;
    stopwatchStartedAt = null;
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    updateStopwatchUI();
    saveActiveStopwatch();
}


function finishStopwatch() {
    const seconds = getStopwatchElapsedSeconds();
    if (seconds <= 0) {
        showToast("O cronômetro ainda não registrou tempo.");
        return;
    }

    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchRunning = false;
    stopwatchAccumulatedSeconds = seconds;
    stopwatchStartedAt = null;
    localStorage.removeItem(STOPWATCH_STORAGE_KEY);

    showCompletionForm({
        sessionId: `stopwatch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        subject: stopwatchSubject,
        seconds,
        category: "Questões"
    });

    document.getElementById("stopwatchCard")?.classList.add("hidden");
    updateStopwatchUI();
}


const stopwatchForm = document.getElementById("stopwatchForm");
if (stopwatchForm) {
    stopwatchForm.addEventListener("submit", event => {
        event.preventDefault();

        const subject = document.getElementById("stopwatchSubject")?.value.trim();
        if (!subject) {
            showToast("Selecione uma matéria.");
            return;
        }

        if (stopwatchRunning) {
            showToast("O cronômetro já está em andamento.");
            return;
        }

        stopwatchSubject = subject;
        stopwatchAccumulatedSeconds = 0;
        stopwatchStartedAt = null;
        hideCompletionForm();
        pendingCompletion = null;
        localStorage.removeItem(PENDING_COMPLETION_KEY);
        startStopwatch();
        showToast("Cronômetro iniciado!");
        document.getElementById("stopwatchCard")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}


document.getElementById("pauseStopwatch")?.addEventListener("click", () => {
    if (stopwatchRunning) {
        pauseStopwatch();
        showToast("Cronômetro pausado.");
    } else if (stopwatchSubject) {
        startStopwatch();
        showToast("Cronômetro retomado.");
    }
});

function confirmarFinalizacao(mensagem, aoConfirmar) {
    const overlay = document.createElement("div");
    overlay.className = "finalizar-overlay";

    overlay.innerHTML = `
        <div class="finalizar-modal" role="dialog" aria-modal="true">
            <h2>Finalizar estudo?</h2>
            <p>${mensagem}</p>

            <div class="finalizar-acoes">
                <button type="button" class="finalizar-cancelar">
                    Cancelar
                </button>

                <button type="button" class="finalizar-confirmar">
                    Finalizar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".finalizar-cancelar").onclick = () => {
        overlay.remove();
    };

    overlay.querySelector(".finalizar-confirmar").onclick = () => {
        overlay.remove();
        aoConfirmar();
    };
}

document.getElementById("finishStopwatch")?.addEventListener("click", () => {
    if (!stopwatchSubject) return;

    confirmarFinalizacao(
        "Deseja realmente finalizar o cronômetro?",
        finishStopwatch
    );
});


/* =========================================================
   INSERÇÃO MANUAL
========================================================= */

const manualStudyForm = document.getElementById("manualStudyForm");

if (manualStudyForm) {
    manualStudyForm.addEventListener("submit", event => {
        event.preventDefault();

        const subject = document.getElementById("manualSubject")?.value.trim();
        const manualTimeInput = document.getElementById("manualTime");
        const totalSeconds = parseCompletionTimeToSeconds(manualTimeInput?.value);
        const questions = Number(document.getElementById("manualQuestions")?.value || 0);
        const correct = Number(document.getElementById("manualCorrect")?.value || 0);

        if (!subject) {
            showToast("Selecione uma matéria.");
            return;
        }

        if (totalSeconds < 0) {
            showToast("Informe o tempo no formato HH:MM:SS. Ex.: 01:25:30");
            manualTimeInput?.focus();
            return;
        }

        // Aceita registros somente por questões, somente por tempo ou por ambos.
        if (totalSeconds === 0 && questions <= 0) {
            showToast("Informe um tempo de estudo ou uma quantidade de questões maior que zero.");
            return;
        }

        if (correct > questions) {
            showToast("Os acertos não podem ser maiores que a quantidade de questões.");
            return;
        }

        const saved = saveCompletedStudy({
            sessionId: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            subject,
            seconds: totalSeconds
        }, questions, correct, "Manual");

        if (!saved) return;

        manualStudyForm.reset();
        document.getElementById("manualTime").value = "00:00:00";
        document.getElementById("manualQuestions").value = 0;
        document.getElementById("manualCorrect").value = 0;

        updateAll();
        showToast("Estudo manual registrado!");
    });
}


/* =========================================================
   CARREGAMENTO DE REGISTROS PENDENTES
========================================================= */

loadPendingCompletion();


/* =========================================================
   INTERVALO DO TIMER
========================================================= */

function startTimerInterval() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(
            () => {

                if (
                    !sessionData ||
                    !timerRunning
                ) {

                    return;

                }


                const raw =
                    localStorage.getItem(
                        SESSION_STORAGE_KEY
                    );


                let stored =
                    null;


                try {

                    stored =
                        raw
                            ? JSON.parse(raw)
                            : null;

                } catch {

                    stored =
                        null;

                }


                if (
                    stored &&
                    stored.sessionId ===
                    sessionData.sessionId
                ) {

                    /*
                        Calcula o tempo usando a referência
                        persistida, evitando problemas de
                        atraso de setInterval.
                    */

                    const now =
                        Date.now();


                    const last =
                        Number(
                            stored.lastResumeTime ||
                            now
                        );


                    const delta =
                        Math.max(
                            0,
                            (
                                now -
                                last
                            ) / 1000
                        );


                    sessionData.elapsedSeconds =
                        Number(
                            stored.elapsedSeconds || 0
                        ) +
                        delta;

                } else {

                    sessionData.elapsedSeconds +=
                        1;

                }


                const totalSeconds =
                    sessionData.totalMinutes *
                    60;


                if (
                    sessionData.elapsedSeconds >=
                    totalSeconds
                ) {

                    sessionData.elapsedSeconds =
                        totalSeconds;


                    timerRunning =
                        false;


                    saveActiveSession();


                    finishTimerAutomatically();


                    return;

                }


                syncTimerFromElapsed();


                updateTimerUI();


                saveActiveSession();

            },
            1000
        );
}


/* =========================================================
   INTERFACE DO TIMER
========================================================= */

function updateTimerUI() {

    const display =
        document.getElementById(
            "timerDisplay"
        );


    const subject =
        document.getElementById(
            "timerSubject"
        );


    const status =
        document.getElementById(
            "timerStatus"
        );


    const modeLabel =
        document.getElementById(
            "timerModeLabel"
        );


    const pauseButton =
        document.getElementById(
            "pauseTimer"
        );


    if (subject && sessionData) {

        subject.textContent =
            sessionData.subject;

    }


    if (modeLabel) {

        modeLabel.textContent =
            timerMode === "focus"
                ? "FOCO"
                : "PAUSA";

    }


    if (status) {

        status.textContent =
            timerRunning
                ? (
                    timerMode === "focus"
                        ? "Sessão em andamento"
                        : "Pausa em andamento"
                )
                : "Sessão pausada";

    }


    if (pauseButton) {

        pauseButton.textContent =
            timerRunning
                ? "⏸ Pausar"
                : "▶ Continuar";

    }


    if (!display) {
        return;
    }


    const total =
        Math.max(
            0,
            Math.floor(
                timerSeconds
            )
        );


    const minutes =
        Math.floor(
            total / 60
        );


    const seconds =
        total % 60;


    display.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* =========================================================
   PAUSAR / CONTINUAR
========================================================= */

const pauseTimer =
    document.getElementById(
        "pauseTimer"
    );


if (pauseTimer) {

    pauseTimer.addEventListener(
        "click",
        () => {

            if (!sessionData) {
                return;
            }


            if (timerRunning) {

                /*
                    Antes de pausar, registra exatamente
                    quanto tempo passou desde a Ãºltima
                    atualizaÃ§Ã£o.
                */

                const raw =
                    localStorage.getItem(
                        SESSION_STORAGE_KEY
                    );


                if (raw) {

                    try {

                        const stored =
                            JSON.parse(raw);


                        if (
                            stored &&
                            stored.sessionId ===
                            sessionData.sessionId &&
                            stored.lastResumeTime
                        ) {

                            const delta =
                                Math.max(
                                    0,
                                    (
                                        Date.now() -
                                        Number(
                                            stored.lastResumeTime
                                        )
                                    ) / 1000
                                );


                            sessionData.elapsedSeconds =
                                Number(
                                    stored.elapsedSeconds || 0
                                ) +
                                delta;

                        }

                    } catch {

                        /* ignora */

                    }

                }


                timerRunning =
                    false;


                clearInterval(
                    timerInterval
                );


                timerInterval =
                    null;


                syncTimerFromElapsed();

                updateTimerUI();

                saveActiveSession();


                showToast(
                    "Sessão pausada."
                );

            } else {

                timerRunning =
                    true;


                saveActiveSession();


                startTimerInterval();

                updateTimerUI();


                showToast(
                    "Sessão retomada."
                );

            }

        }
    );

}


/* =========================================================
   FINALIZAR TIMER MANUALMENTE
========================================================= */

const finishTimer = document.getElementById("finishTimer");

if (finishTimer) {
    finishTimer.addEventListener("click", () => {
        if (!sessionData) return;

        confirmarFinalizacao(
            "Deseja realmente finalizar o Pomodoro?",
            finishTimerManually
        );
    });
}


function finishTimerManually() {
    if (!sessionData) return;

    const completedSession = { ...sessionData };
    const seconds = Math.max(0, Math.floor(Number(completedSession.elapsedSeconds || 0)));

    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    localStorage.removeItem(SESSION_STORAGE_KEY);

    sessionData = null;
    timerMode = "focus";
    timerSeconds = 0;

    document.getElementById("studyTimerCard")?.classList.add("hidden");
    updateTimerUI();

    showCompletionForm({
        sessionId: completedSession.sessionId,
        subject: completedSession.subject,
        seconds,
        category: "Teoria"
    });

    showToast("Sessão encerrada. Registre seu desempenho.");
}


/* =========================================================
   FINALIZAÃ‡ÃƒO AUTOMÃTICA
========================================================= */

function finishTimerAutomatically() {
    if (!sessionData) return;

    const completedSession = { ...sessionData };
    completedSession.elapsedSeconds = Math.max(
        0,
        Math.floor(Number(completedSession.elapsedSeconds || completedSession.totalMinutes * 60))
    );

    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    localStorage.removeItem(SESSION_STORAGE_KEY);

    sessionData = null;
    timerMode = "focus";
    timerSeconds = 0;

    document.getElementById("studyTimerCard")?.classList.add("hidden");
    updateTimerUI();

    showCompletionForm({
        sessionId: completedSession.sessionId,
        subject: completedSession.subject,
        seconds: completedSession.elapsedSeconds,
        category: "Teoria"
    });

    showToast("Tempo encerrado! Agora registre suas questões e acertos.");
}


/* =========================================================
   VISIBILIDADE DA PÁGINA
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            /*
                Só recarrega se houver sessão salva.
            */

            if (
                localStorage.getItem(
                    SESSION_STORAGE_KEY
                )
            ) {

                loadActiveSession();

            }

        }

    }
);


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatTime(seconds) {

    const total =
        Math.max(
            0,
            Math.floor(
                Number(seconds || 0)
            )
        );


    const hours =
        Math.floor(
            total / 3600
        );


    const minutes =
        Math.floor(
            (
                total % 3600
            ) / 60
        );


    const secs =
        total % 60;


    if (hours > 0) {

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    }


    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


function formatDateShort(date) {

    return `${String(
        date.getDate()
    ).padStart(2, "0")}/${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;
}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout =
    null;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* =========================================================
   PWA - INSTALAÇÃO
========================================================= */

let deferredInstallPrompt =
    null;


window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();


        deferredInstallPrompt =
            event;


        const installBtn =
            document.getElementById(
                "installBtn"
            );


        if (installBtn) {

            installBtn.style.display =
                "inline-block";

        }

    }
);


const installBtn =
    document.getElementById(
        "installBtn"
    );


if (installBtn) {

    installBtn.addEventListener(
        "click",
        async () => {

            if (!deferredInstallPrompt) {

                showToast(
                    "A instalação ainda não está disponível neste dispositivo."
                );

                return;
            }


            deferredInstallPrompt.prompt();


            const result =
                await deferredInstallPrompt.userChoice;


            if (
                result.outcome ===
                "accepted"
            ) {

                showToast(
                    "Aplicativo instalado!"
                );

            }


            deferredInstallPrompt =
                null;

        }
    );

}


/* =========================================================
   SERVICE WORKER
========================================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "sw.js"
                )
                .then(
                    registration => {

                        console.log(
                            "Service Worker registrado:",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.warn(
                            "Service Worker não registrado:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================================
   ATUALIZAÇÃO GERAL
========================================================= */

function updateAll() {

    renderWeek();

    updateDashboardSummary();

    renderCycle();

    updateSubjectDatalist();

    renderSettingsSubjects();

    renderHistory(
        document.querySelector(
            "[data-history-filter].active"
        )?.dataset.historyFilter ||
        "today"
    );

    const activeStatsFilter =
        document.querySelector(
            "[data-filter].active"
        )?.dataset.filter ||
        "day";


    updateStatistics(
        activeStatsFilter
    );


    renderSimulationSelect();

    renderSavedSimulations();

    renderSettingsSimulations();

    renderSimulationStatistics();
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeApp() {

    updateGreeting();

    // Preenche o resumo logo na abertura, inclusive com dados já salvos.
    updateDashboardSummary();

    renderWeek();

    renderCycle();

    renderSettingsSubjects();

    updateSubjectDatalist();

    renderHistory(
        "today"
    );

    updateStatistics(
        "day"
    );

    renderSimulationSelect();

    renderSavedSimulations();

    renderSettingsSimulations();

    renderSimulationStatistics();


    /*
        Recupera uma sessão que estava em andamento.
    */

    loadActiveSession();


    /*
        Garante que a interface do timer fique
        escondida quando não há sessão.
    */

    if (!sessionData) {

        const timerCard =
            document.getElementById(
                "studyTimerCard"
            );


        if (timerCard) {

            timerCard.classList.add(
                "hidden"
            );

        }

    }

}


initializeApp();


/* =========================================================
   FIM
========================================================= */
/* CONFIGURAÇÕES — ALTERNAR ABAS SEM ALTERAR OS DADOS */
(function initSettingsTabs() {
    const tabs = document.querySelectorAll('[data-settings-tab]');
    const panels = document.querySelectorAll('[data-settings-panel]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const selected = tab.dataset.settingsTab;
            tabs.forEach(item => {
                const active = item.dataset.settingsTab === selected;
                item.classList.toggle('active', active);
                item.setAttribute('aria-selected', String(active));
            });
            panels.forEach(panel => {
                panel.hidden = panel.dataset.settingsPanel !== selected;
            });
        });
    });
})();

/* =========================================================
   CONFIGURAÇÃO DO CICLO — SEM APAGAR MATÉRIAS OU HISTÓRICO
========================================================= */
function cycleActiveSubjects() {
    return subjects.filter(subject => subject.cycleEnabled !== false);
}
function cycleQuestionsDone(name) {
    return studies.filter(study => String(study.subject).toLowerCase() === String(name).toLowerCase())
        .reduce((sum, study) => sum + Number(study.questions || 0), 0);
}
function cyclePercentFor(subject) {
    const mode = subject.cycleMode || 'time';
    const timeGoal = Math.max(0, Number(subject.hours || 0) * 60);
    const questionGoal = Math.max(0, Number(subject.questions || 0));
    const timeRatio = timeGoal ? Math.min(1, getSubjectStudiedMinutes(subject.name) / timeGoal) : 0;
    const questionRatio = questionGoal ? Math.min(1, cycleQuestionsDone(subject.name) / questionGoal) : 0;
    if (mode === 'questions') return Math.round(questionRatio * 100);
    if (mode === 'both') return Math.round((timeRatio + questionRatio) * 50);
    return Math.round(timeRatio * 100);
}
function cycleFormatGoal(hours) {
    const secs = Math.max(0, Math.round(Number(hours || 0) * 3600));
    return [Math.floor(secs / 3600), Math.floor(secs % 3600 / 60), secs % 60].map(n => String(n).padStart(2, '0')).join(':');
}
function renderCycleSettings() {
    const container = document.getElementById('cycleSettingsList');
    if (!container) return;
    if (!subjects.length) {
        container.innerHTML = '<div class="settings-empty">Cadastre primeiro suas matérias na aba 📚 Matérias.</div>';
        return;
    }
    container.innerHTML = '';
    subjects.forEach(subject => {
        const row = document.createElement('div');
        row.className = 'cycle-setting-row';
        row.dataset.subjectId = String(subject.id);
        row.innerHTML = `
          <div class="cycle-setting-top">
            <label class="cycle-enabled"><input type="checkbox" class="cycle-check" ${subject.cycleEnabled !== false ? 'checked' : ''}> <span><span class="subject-color-dot" style="background:${getSubjectColor(subject.name)}"></span>${escapeHTML(subject.name)}</span></label>
            <label class="cycle-mode-label">Configurar por
              <select class="cycle-mode" aria-label="Tipo de meta de ${escapeHTML(subject.name)}">
                <option value="time">Tempo</option><option value="questions">Questões</option><option value="both">Ambos</option>
              </select>
            </label>
          </div>
          <div class="cycle-setting-fields">
            <label class="cycle-time-field">Meta de estudoㅤㅤㅤ<input type="text" class="cycle-time" inputmode="numeric" value="${cycleFormatGoal(subject.hours)}" placeholder="00:00:00"></label>
            <label class="cycle-questions-field">Meta de questõesㅤㅤㅤ<input type="number" class="cycle-questions" min="0" step="1" value="${Math.max(0, Number(subject.questions || 0))}"></label>
          </div>`;
        const modeSelect = row.querySelector('.cycle-mode');
        modeSelect.value = ['time', 'questions', 'both'].includes(subject.cycleMode) ? subject.cycleMode : 'time';
        const updateFields = () => {
            const mode = modeSelect.value;
            const enabled = row.querySelector('.cycle-check').checked;
            row.querySelector('.cycle-time-field').hidden = mode === 'questions' || !enabled;
            row.querySelector('.cycle-questions-field').hidden = mode === 'time' || !enabled;
            row.querySelector('.cycle-setting-fields').hidden = !enabled;
            modeSelect.disabled = !enabled;
        };
        modeSelect.addEventListener('change', updateFields);
        row.querySelector('.cycle-check').addEventListener('change', updateFields);
        updateFields();
        container.appendChild(row);
    });
}
document.getElementById('saveCycleSettings')?.addEventListener('click', () => {
    const changes = [];
    for (const row of document.querySelectorAll('.cycle-setting-row')) {
        const subject = subjects.find(s => String(s.id) === row.dataset.subjectId);
        if (!subject) continue;
        const mode = row.querySelector('.cycle-mode').value;
        const enabled = row.querySelector('.cycle-check').checked;
        const usesTime = mode === 'time' || mode === 'both';
        const usesQuestions = mode === 'questions' || mode === 'both';
        const value = row.querySelector('.cycle-time').value.trim();
        const match = /^(\d{1,4}):([0-5]\d):([0-5]\d)$/.exec(value);
        if (enabled && usesTime && !match) { showToast('Informe o tempo no formato HH:MM:SS.'); return; }
        const hours = match ? Number(match[1]) + Number(match[2]) / 60 + Number(match[3]) / 3600 : Number(subject.hours || 0);
        const enteredQuestions = Number(row.querySelector('.cycle-questions').value);
        if (enabled && usesQuestions && (!Number.isSafeInteger(enteredQuestions) || enteredQuestions < 0)) {
            showToast('Informe uma quantidade válida de questões.'); return;
        }
        const questions = Number.isSafeInteger(enteredQuestions) && enteredQuestions >= 0 ? enteredQuestions : Number(subject.questions || 0);
        if (enabled && ((usesTime && !hours) || (usesQuestions && !questions))) {
            showToast('Preencha as metas da matéria selecionada.'); return;
        }
        changes.push({ subject, enabled: row.querySelector('.cycle-check').checked, hours, questions, mode });
    }
    changes.forEach(({ subject, enabled, hours, questions, mode }) => {
        subject.cycleEnabled = enabled; subject.hours = hours; subject.questions = questions; subject.cycleMode = mode;
    });
    saveSubjects(); updateAll(); showToast('Ciclo salvo com sucesso!');
});
/* Atualiza a aba quando as matérias forem cadastradas ou editadas. */
const originalRenderSettingsSubjects = renderSettingsSubjects;
renderSettingsSubjects = function (...args) { const result = originalRenderSettingsSubjects(...args); renderCycleSettings(); return result; };
/* Progresso do ciclo respeita somente as matérias selecionadas. */
getSubjectProgress = function (name) {
    const subject = subjects.find(s => String(s.name).toLowerCase() === String(name).toLowerCase());
    return subject && subject.cycleEnabled !== false ? cyclePercentFor(subject) : 0;
};
getNextSubject = function () {
    return [...cycleActiveSubjects()].sort((a, b) => cyclePercentFor(a) - cyclePercentFor(b))[0] || null;
};
renderCycleSettings();

/* PALETA PERSONALIZADA — mantém os valores hexadecimais já usados pelo sistema */
let activeSubjectColorInput = null;
let selectedSubjectPaletteColor = "#22c55e";
const paletteOverlay = document.getElementById("subjectPaletteOverlay");
const paletteHex = document.getElementById("subjectPaletteHex");
const paletteOptions = document.getElementById("subjectPaletteOptions");
const subjectHue = document.getElementById("subjectHue");
const subjectSaturation = document.getElementById("subjectSaturation");
const subjectLightness = document.getElementById("subjectLightness");
const subjectColorPreview =
    document.getElementById("subjectColorPreview");

const subjectColorPreviewHex =
    document.getElementById("subjectColorPreviewHex");

function updateSubjectColorPreview(color) {
    if (!validSubjectColor(color)) return;

    if (subjectColorPreview) {
        subjectColorPreview.style.backgroundColor = color;
    }

    if (subjectColorPreviewHex) {
        subjectColorPreviewHex.textContent = color.toUpperCase();
    }
}
function hslToSubjectHex(h, s, l) {
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);

    const convert = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(
            -1,
            Math.min(k - 3, 9 - k, 1)
        );

        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };

    return `#${convert(0)}${convert(8)}${convert(4)}`;
}

function subjectHexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const difference = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (difference !== 0) {
        s = difference / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case r:
                h = ((g - b) / difference) % 6;
                break;
            case g:
                h = (b - r) / difference + 2;
                break;
            default:
                h = (r - g) / difference + 4;
        }

        h *= 60;
        if (h < 0) h += 360;
    }

    return [
        Math.round(h),
        Math.round(s * 100),
        Math.round(l * 100)
    ];
}

function syncSubjectColorSliders(color) {
    if (!validSubjectColor(color)) return;
    updateSubjectColorPreview(color);

    const [h, s, l] = subjectHexToHsl(color);

    if (subjectHue) subjectHue.value = h;
    if (subjectSaturation) subjectSaturation.value = s;
    if (subjectLightness) subjectLightness.value = l;
}

function updateCustomSubjectColor() {
    if (!subjectHue || !subjectSaturation || !subjectLightness) return;

    selectedSubjectPaletteColor = hslToSubjectHex(
        Number(subjectHue.value),
        Number(subjectSaturation.value),
        Number(subjectLightness.value)
    );
    updateSubjectColorPreview(selectedSubjectPaletteColor);

    if (paletteHex) {
        paletteHex.value = selectedSubjectPaletteColor;
        paletteHex.setCustomValidity("");
    }

    renderSubjectPalette();
}

[subjectHue, subjectSaturation, subjectLightness].forEach(slider => {
    slider?.addEventListener("input", updateCustomSubjectColor);
});

function syncSubjectColorTriggers() {
    document.querySelectorAll("[data-color-for]").forEach(trigger => {
        const input = document.getElementById(trigger.dataset.colorFor);
        const dot = trigger.querySelector(".conc-color-dot");
        if (input && dot) dot.style.backgroundColor = input.value;
    });
}

function renderSubjectPalette() {
    if (!paletteOptions) return;
    paletteOptions.innerHTML = "";
    SUBJECT_PALETTE.forEach(color => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "conc-color-option" + (color.toLowerCase() === selectedSubjectPaletteColor.toLowerCase() ? " selected" : "");
        button.style.backgroundColor = color;
        button.setAttribute("aria-label", `Selecionar cor ${color}`);
        button.setAttribute("aria-pressed", String(color.toLowerCase() === selectedSubjectPaletteColor.toLowerCase()));
        button.textContent = color.toLowerCase() === selectedSubjectPaletteColor.toLowerCase() ? "✓" : "";
        button.addEventListener("click", () => {
            selectedSubjectPaletteColor = color;
            paletteHex.value = color;
            syncSubjectColorSliders(color);
            renderSubjectPalette();
        });
        paletteOptions.appendChild(button);
    });
}

function closeSubjectPaletteModal() {
    paletteOverlay?.classList.add("hidden");
    document.body.classList.remove("conc-modal-open");
    activeSubjectColorInput = null;
}

document.querySelectorAll("[data-color-for]").forEach(trigger => {
    trigger.addEventListener("click", () => {
        activeSubjectColorInput = document.getElementById(trigger.dataset.colorFor);
        if (!activeSubjectColorInput || !paletteOverlay) return;
        selectedSubjectPaletteColor = activeSubjectColorInput.value || "#22c55e";
        paletteHex.value = selectedSubjectPaletteColor;
        paletteHex.setCustomValidity("");
        syncSubjectColorSliders(selectedSubjectPaletteColor);
        renderSubjectPalette();
        paletteOverlay.classList.remove("hidden");
        document.body.classList.add("conc-modal-open");
    });
});
paletteHex?.addEventListener("input", () => {
    if (validSubjectColor(paletteHex.value)) {
        selectedSubjectPaletteColor = paletteHex.value;
        paletteHex.setCustomValidity("");
        syncSubjectColorSliders(selectedSubjectPaletteColor);
        renderSubjectPalette();
    }
});
document.getElementById("applySubjectPalette")?.addEventListener("click", () => {
    const value = paletteHex.value.trim();
    if (!validSubjectColor(value)) {
        paletteHex.setCustomValidity("Informe uma cor como #22c55e.");
        paletteHex.reportValidity();
        return;
    }
    paletteHex.setCustomValidity("");
    if (activeSubjectColorInput) {
        activeSubjectColorInput.value = value;
        activeSubjectColorInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    syncSubjectColorTriggers();
    closeSubjectPaletteModal();
});
for (const id of ["closeSubjectPalette", "cancelSubjectPalette"]) {
    document.getElementById(id)?.addEventListener("click", closeSubjectPaletteModal);
}
paletteOverlay?.addEventListener("click", event => {
    if (event.target === paletteOverlay) closeSubjectPaletteModal();
});
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (!paletteOverlay?.classList.contains("hidden")) closeSubjectPaletteModal();
    else if (!document.getElementById("historyDateOverlay")?.classList.contains("hidden")) closeHistoryDateModal();
});

// Mantém os indicadores atualizados após a abertura da edição e o cadastro.
document.addEventListener("click", event => {
    if (event.target.closest("[data-edit-subject], [data-color-for], [data-settings-tab]")) {
        queueMicrotask(syncSubjectColorTriggers);
    }
});
syncSubjectColorTriggers();

function showConcursadoConfirm({ title, message, confirmLabel = "Confirmar" }) {
    return new Promise(resolve => {
        if (!document.getElementById("concursado-confirm-styles")) {
            const style = document.createElement("style");
            style.id = "concursado-confirm-styles";
            style.textContent = `
                .cc-confirm-overlay {
                    position: fixed; inset: 0; z-index: 99999;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px; background: rgba(0, 0, 0, .76);
                    backdrop-filter: blur(4px);
                }
                .cc-confirm-dialog {
                    box-sizing: border-box; width: min(100%, 440px);
                    padding: 28px; border: 1px solid rgba(94, 183, 130, .25);
                    border-radius: 18px; background: #101b17;
                    color: #f1f7f3; box-shadow: 0 24px 70px rgba(0,0,0,.48);
                    text-align: left;
                }
                .cc-confirm-dialog h3 {
                    margin: 0 0 12px; color: #f5f8f6;
                    font-size: 21px; font-weight: 700; line-height: 1.35;
                }
                .cc-confirm-dialog p {
                    margin: 0; color: #b9c8bf; font-size: 15px;
                    line-height: 1.6; overflow-wrap: anywhere;
                }
                .cc-confirm-actions {
                    display: flex; justify-content: flex-end;
                    gap: 12px; margin-top: 28px; flex-wrap: wrap;
                }
                .cc-confirm-actions button {
                    box-sizing: border-box; min-height: 44px; padding: 10px 18px;
                    border-radius: 10px; font: inherit; font-weight: 600;
                    cursor: pointer; white-space: normal;
                }
                .cc-confirm-cancel {
                    background: #24332b; border: 1px solid #3a5042; color: #e8f0ea;
                }
                .cc-confirm-delete {
                    background: #bb3434; border: 1px solid #d54b4b; color: #fff;
                }
                .cc-confirm-cancel:hover { background: #304437; }
                .cc-confirm-delete:hover { background: #a52929; }
                .cc-confirm-actions button:focus-visible {
                    outline: 2px solid #6fdb96; outline-offset: 3px;
                }
                @media (max-width: 420px) {
                    .cc-confirm-dialog { padding: 22px 18px; }
                    .cc-confirm-actions { flex-direction: column-reverse; }
                    .cc-confirm-actions button { width: 100%; }
                }
            `;
            document.head.appendChild(style);
        }

        const overlay = document.createElement("div");
        overlay.className = "cc-confirm-overlay";
        overlay.innerHTML = `
            <div class="cc-confirm-dialog" role="alertdialog" aria-modal="true"
                 aria-labelledby="cc-confirm-title" aria-describedby="cc-confirm-message">
                <h3 id="cc-confirm-title"></h3>
                <p id="cc-confirm-message"></p>
                <div class="cc-confirm-actions">
                    <button type="button" class="cc-confirm-cancel">Cancelar</button>
                    <button type="button" class="cc-confirm-delete"></button>
                </div>
            </div>
        `;
        overlay.querySelector("h3").textContent = title;
        overlay.querySelector("p").textContent = message;
        overlay.querySelector(".cc-confirm-delete").textContent = confirmLabel;

        const previousFocus = document.activeElement;
        document.body.appendChild(overlay);
        const cancelButton = overlay.querySelector(".cc-confirm-cancel");
        const deleteButton = overlay.querySelector(".cc-confirm-delete");
        cancelButton.focus();
        let closed = false;

        function close(result) {
            if (closed) return;
            closed = true;
            overlay.removeEventListener("keydown", handleKeydown);
            overlay.remove();
            if (previousFocus && previousFocus.isConnected) previousFocus.focus();
            resolve(result);
        }
        function handleKeydown(event) {
            if (event.key === "Escape") { event.preventDefault(); close(false); }
            if (event.key === "Tab") {
                const first = cancelButton, last = deleteButton;
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault(); last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault(); first.focus();
                }
            }
        }
        cancelButton.addEventListener("click", () => close(false));
        deleteButton.addEventListener("click", () => close(true));
        overlay.addEventListener("click", event => {
            if (event.target === overlay) close(false);
        });
        overlay.addEventListener("keydown", handleKeydown);
    });
}


/* Fecha o menu da conta ao clicar fora ou pressionar Esc. */
(function setupAccountDropdownDismiss() {
    const accountDetails = document.querySelector("#authAccount .auth-account-details");
    if (!accountDetails) return;

    document.addEventListener("pointerdown", (event) => {
        if (accountDetails.open && !accountDetails.contains(event.target)) {
            accountDetails.open = false;
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && accountDetails.open) {
            accountDetails.open = false;
            accountDetails.querySelector("summary")?.focus();
        }
    });
})();
