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
    "aprovado_simulations",
    defaultSimulations
);

let subjects = loadJSON(
    "aprovado_subjects",
    []
);

let studies = loadJSON(
    "aprovado_studies",
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
        "aprovado_studies",
        JSON.stringify(studies)
    );
}


function saveSubjects() {
    localStorage.setItem(
        "aprovado_subjects",
        JSON.stringify(subjects)
    );
}


function saveSimulations() {
    localStorage.setItem(
        "aprovado_simulations",
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
        "SÁB"
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

const historyFilters =
    document.querySelectorAll(
        "[data-history-filter]"
    );


historyFilters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            historyFilters.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            renderHistory(
                button.dataset.historyFilter
            );

        }
    );

});


function getHistoryStartDate(filter) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    if (filter === "today") {
        return today;
    }


    if (filter === "week") {

        const start =
            new Date(today);

        start.setDate(
            today.getDate() -
            today.getDay()
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


    const startDate =
        getHistoryStartDate(
            filter
        );


    let filtered =
        [...studies];


    if (startDate) {

        const startKey =
            getDateKey(startDate);


        filtered =
            filtered.filter(
                study =>
                    study.date >= startKey
            );
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
        subjects.reduce(
            (sum, subject) =>
                sum +
                Number(subject.hours || 0) * 60,
            0
        );


    const totalStudiedMinutes =
        studies.reduce(
            (sum, study) =>
                sum + getStudyMinutes(study),
            0
        );


    const percent =
        totalPlannedMinutes > 0
            ? Math.min(
                100,
                Math.round(
                    (
                        totalStudiedMinutes /
                        totalPlannedMinutes
                    ) * 100
                )
            )
            : 0;


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


        setText(
            "nextRemaining",
            formatStudyDuration(
                remaining
            )
        );


        setText(
            "cyclePageNextRemaining",
            `${formatStudyDuration(remaining)} restantes`
        );

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


    if (!subjects.length) {

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


    subjects.forEach(subject => {

        const planned =
            Number(
                subject.hours || 0
            ) * 60;


        const studied =
            getSubjectStudiedMinutes(
                subject.name
            );


        const percent =
            planned > 0
                ? Math.min(
                    100,
                    Math.round(
                        (
                            studied /
                            planned
                        ) * 100
                    )
                )
                : 0;


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "cycle-subject-row";


        row.innerHTML = `

            <div class="cycle-subject-top">

                <span class="cycle-subject-name">
                    ${escapeHTML(
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
                    style="width:${percent}%"
                ></div>

            </div>


            <div class="cycle-subject-meta">

                <span>
                    Estudado:
                    ${formatStudyDuration(studied)}
                </span>

                <span>
                    Meta:
                    ${formatStudyDuration(planned)}
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


            const hours =
                Number(
                    document.getElementById(
                        "subjectHours"
                    )?.value || 0
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


            if (editingId) {

                const subject =
                    subjects.find(
                        item =>
                            String(item.id) ===
                            String(editingId)
                    );


                if (subject) {

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


            renderSettingsSubjects();

            updateSubjectDatalist();

            renderCycle();

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
                    ${escapeHTML(
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

    const subject =
        subjects.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!subject) {
        return;
    }


    const editing =
        document.getElementById(
            "editingSubjectId"
        );


    if (editing) {
        editing.value =
            subject.id;
    }


    const name =
        document.getElementById(
            "subjectName"
        );


    const hours =
        document.getElementById(
            "subjectHours"
        );


    const questions =
        document.getElementById(
            "subjectQuestions"
        );


    if (name) {
        name.value =
            subject.name;
    }


    if (hours) {
        hours.value =
            subject.hours;
    }


    if (questions) {
        questions.value =
            subject.questions || 0;
    }


    const submit =
        subjectForm?.querySelector(
            'button[type="submit"]'
        );


    if (submit) {
        submit.textContent =
            "💾 Salvar alterações";
    }


    const cancel =
        document.getElementById(
            "cancelSubjectEdit"
        );


    if (cancel) {
        cancel.classList.remove(
            "hidden"
        );
    }


    subjectForm?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function deleteSubject(id) {

    const subject =
        subjects.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!subject) {
        return;
    }


    const confirmed =
        confirm(
            `Excluir a matéria "${subject.name}"?`
        );


    if (!confirmed) {
        return;
    }


    subjects =
        subjects.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveSubjects();


    renderSettingsSubjects();

    updateSubjectDatalist();

    renderCycle();


    showToast(
        "Matéria excluída."
    );
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
========================================================= */

function renderTimeChart(
    filtered
) {

    const container =
        document.getElementById(
            "timeChart"
        );


    if (!container) {
        return;
    }


    if (!filtered.length) {

        container.innerHTML =
            "Nenhum estudo registrado no período.";

        return;
    }


    const byDate = {};


    filtered.forEach(study => {

        byDate[study.date] =
            (
                byDate[study.date] || 0
            ) +
            getStudyMinutes(study);

    });


    const entries =
        Object.entries(byDate)
            .sort(
                ([a], [b]) =>
                    a.localeCompare(b)
            );


    const max =
        Math.max(
            ...entries.map(
                ([, value]) =>
                    value
            ),
            1
        );


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

            ${entries.map(
                ([date, minutes]) => {

                    const height =
                        Math.max(
                            5,
                            (
                                minutes /
                                max
                            ) * 170
                        );


                    const dateObj =
                        parseStudyDate({
                            date
                        });


                    return `

                        <div
                            style="
                                flex:1;
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
                                    font-size:9px;
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
                                    font-size:9px;
                                    color:var(--muted);
                                "
                            >
                                ${String(
                                    dateObj.getDate()
                                ).padStart(2, "0")}
                            </small>

                        </div>

                    `;

                }
            ).join("")}

        </div>

    `;
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
                                    background:
                                        linear-gradient(
                                            90deg,
                                            var(--green),
                                            var(--green-light)
                                        );
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
            ${escapeHTML(
                simulation.name
            )}
        </strong>

        <br>

        Tempo:
        ${hours}h ${String(minutes).padStart(2, "0")}min

        <br>

        Questões:
        ${Number(
            simulation.questions || 0
        )}

        ${
            simulation.correct !== undefined
                ? `
                    <br>
                    Acertos:
                    ${Number(
                        simulation.correct || 0
                    )}
                `
                : ""
        }

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

const simulationForm =
    document.getElementById(
        "simulationForm"
    );


if (simulationForm) {

    simulationForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "simulationName"
                )?.value.trim();


            const hours =
                Number(
                    document.getElementById(
                        "simulationHours"
                    )?.value || 0
                );


            const minutes =
                Number(
                    document.getElementById(
                        "simulationMinutes"
                    )?.value || 0
                );


            const questions =
                Number(
                    document.getElementById(
                        "simulationQuestionCount"
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


            const simulation = {

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

            };


            simulations.push(
                simulation
            );


            saveSimulations();


            renderSimulationSelect();

            renderSavedSimulations();

            renderSettingsSimulations();

            renderSimulationStatistics();


            simulationForm.reset();


            showToast(
                "Simulado criado!"
            );


            startSimulationTimer(

                (
                    simulation.hours *
                    3600
                ) +
                (
                    simulation.minutes *
                    60
                ),

                simulation.name

            );

        }
    );

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


            const hours =
                Number(
                    document.getElementById(
                        "settingsSimulationHours"
                    )?.value || 0
                );


            const minutes =
                Number(
                    document.getElementById(
                        "settingsSimulationMinutes"
                    )?.value || 0
                );


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

    const simulation =
        simulations.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!simulation) {
        return;
    }


    /*
        O HTML original não possui necessariamente
        editingSimulationId.

        Criamos dinamicamente caso necessário.
    */

    let editing =
        document.getElementById(
            "editingSimulationId"
        );


    if (!editing) {

        editing =
            document.createElement(
                "input"
            );


        editing.type =
            "hidden";

        editing.id =
            "editingSimulationId";


        settingsSimulationForm?.appendChild(
            editing
        );

    }


    editing.value =
        simulation.id;


    const name =
        document.getElementById(
            "settingsSimulationName"
        );


    const hours =
        document.getElementById(
            "settingsSimulationHours"
        );


    const minutes =
        document.getElementById(
            "settingsSimulationMinutes"
        );


    const questions =
        document.getElementById(
            "settingsSimulationQuestions"
        );


    if (name) {
        name.value =
            simulation.name;
    }


    if (hours) {
        hours.value =
            simulation.hours || 0;
    }


    if (minutes) {
        minutes.value =
            simulation.minutes || 0;
    }


    if (questions) {
        questions.value =
            simulation.questions || 0;
    }


    const submit =
        settingsSimulationForm?.querySelector(
            'button[type="submit"]'
        );


    if (submit) {

        submit.textContent =
            "✏️ Salvar alterações";

    }


    let cancel =
        document.getElementById(
            "cancelSimulationEdit"
        );


    if (!cancel) {

        cancel =
            document.createElement(
                "button"
            );


        cancel.type =
            "button";

        cancel.id =
            "cancelSimulationEdit";

        cancel.className =
            "secondary-btn";

        cancel.textContent =
            "Cancelar";


        settingsSimulationForm
            ?.querySelector(
                ".form-actions"
            )
            ?.appendChild(
                cancel
            );


        cancel.addEventListener(
            "click",
            resetSimulationSettingsForm
        );

    }


    cancel.classList.remove(
        "hidden"
    );


    settingsSimulationForm?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


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


function deleteSimulation(id) {

    const simulation =
        simulations.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!simulation) {
        return;
    }


    const confirmed =
        confirm(
            `Excluir o simulado "${simulation.name}"?`
        );


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

let simulationInterval =
    null;


let simulationRemaining =
    0;


let simulationRunning =
    false;


function startSimulationTimer(
    seconds,
    name
) {

    simulationRemaining =
        Math.max(
            0,
            Number(seconds || 0)
        );


    simulationRunning =
        true;


    const card =
        document.getElementById(
            "simulationTimer"
        );


    const nameElement =
        document.getElementById(
            "simulationTimerName"
        );


    if (card) {

        card.classList.remove(
            "hidden"
        );

    }


    if (nameElement) {

        nameElement.textContent =
            name || "Simulado";

    }


    updateSimulationTimerUI();


    clearInterval(
        simulationInterval
    );


    simulationInterval =
        setInterval(
            () => {

                if (
                    !simulationRunning
                ) {
                    return;
                }


                simulationRemaining =
                    Math.max(
                        0,
                        simulationRemaining - 1
                    );


                updateSimulationTimerUI();


                if (
                    simulationRemaining <= 0
                ) {

                    finishSimulationTimer(
                        true
                    );

                }

            },
            1000
        );
}


function updateSimulationTimerUI() {

    const display =
        document.getElementById(
            "simulationTimerDisplay"
        );


    if (!display) {
        return;
    }


    const total =
        Math.max(
            0,
            Math.floor(
                simulationRemaining
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


    const seconds =
        total % 60;


    display.textContent =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    setText(
        "simulationTimerStatus",
        simulationRemaining > 0
            ? "Tempo restante"
            : "Tempo encerrado"
    );
}


function finishSimulationTimer(
    automatic = false
) {

    clearInterval(
        simulationInterval
    );


    simulationInterval =
        null;


    simulationRunning =
        false;


    simulationRemaining =
        0;


    updateSimulationTimerUI();


    const card =
        document.getElementById(
            "simulationTimer"
        );


    if (card) {

        card.classList.add(
            "hidden"
        );

    }


    showToast(
        automatic
            ? "Tempo do simulado encerrado."
            : "Simulado finalizado."
    );
}


const finishSimulation =
    document.getElementById(
        "finishSimulation"
    );


if (finishSimulation) {

    finishSimulation.addEventListener(
        "click",
        () => {

            finishSimulationTimer(
                false
            );

        }
    );

}


/* =========================================================
   POMODORO / SESSÃO DE ESTUDO
========================================================= */

const SESSION_STORAGE_KEY =
    "aprovado_active_session";


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

const PENDING_COMPLETION_KEY = "aprovado_pending_completion";
const STOPWATCH_STORAGE_KEY = "aprovado_active_stopwatch";


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


document.getElementById("finishStopwatch")?.addEventListener("click", () => {
    if (!stopwatchSubject) return;
    if (!confirm("Deseja finalizar o cronômetro?")) return;
    finishStopwatch();
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

        if (totalSeconds <= 0) {
            showToast("Informe um tempo de estudo maior que zero.");
            manualTimeInput?.focus();
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
                ? "â¸ Pausar"
                : "â–¶ Continuar";

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

        if (!confirm("Deseja finalizar esta sessÃ£o?")) return;

        finishTimerManually();
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
