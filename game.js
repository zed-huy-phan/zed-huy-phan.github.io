// --- 1. GLOBAL AUDIO SYSTEM (HOMEPAGE & IN-GAME) ---
const bgmAudio = new Audio('assets/bgm.mp3');
bgmAudio.loop = true;
bgmAudio.volume = 0.2;

const clickAudio = new Audio('assets/click_sfx.mp3');
clickAudio.volume = 0.4;

const interactAudio = new Audio('assets/interact_sfx.mp3');
interactAudio.volume = 0.4;

let bgmMuted = false;
let sfxMuted = false;

// Function to start BGM on initial user interaction (handles browser autoplay policies)
function startBGM() {
    if (bgmAudio.paused && !bgmMuted) {
        bgmAudio.play().catch(() => {});
    }
}

// Global UI Click SFX trigger
function playClickSFX() {
    startBGM();
    if (!sfxMuted) {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(() => {});
    }
}

// Player Interact SFX trigger
function playInteractSFX() {
    startBGM();
    if (!sfxMuted) {
        interactAudio.currentTime = 0;
        interactAudio.play().catch(() => {});
    }
}

// Auto-start BGM on first user interaction anywhere on page
['click', 'keydown', 'touchstart'].forEach(eventType => {
    window.addEventListener(eventType, () => {
        startBGM();
    }, { once: true });
});


// --- 2. HTML UI LOGIC & FORCED DYNAMIC MODAL CONTENT OVERWRITE ---
const uiLayer = document.getElementById('ui-layer') || document.body;

// Inject shared CSS for modal centering, bottom-centered close button, scrollable modal bodies, responsive tabs, node cards & image galleries
const modalStyleTag = document.createElement('style');
modalStyleTag.innerHTML = `
    .menu-box {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        margin: 0 !important;
        padding-top: 25px !important;
        padding-bottom: 55px !important;
        box-sizing: border-box !important;
        max-width: 90vw !important;
    }
    #main-menu {
        padding-bottom: 25px !important;
    }
    .btn-close {
        position: absolute !important;
        bottom: 14px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        top: auto !important;
        right: auto !important;
        background: rgba(0, 0, 0, 0.6) !important;
        border: 1px solid #ffcc00 !important;
        color: #ffcc00 !important;
        font-size: 10px !important;
        font-family: inherit !important;
        padding: 5px 12px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        z-index: 100 !important;
        white-space: nowrap !important;
        transition: all 0.2s ease;
    }
    .btn-close:hover {
        background: #ffcc00 !important;
        color: #000000 !important;
    }
    .modal-scroll-body {
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 8px;
        margin-bottom: 10px;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
        text-align: left;
    }
    .modal-scroll-body::-webkit-scrollbar {
        width: 6px;
    }
    .modal-scroll-body::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 4px;
    }
    .modal-scroll-body p {
        margin-top: 0;
        margin-bottom: 14px;
        line-height: 1.6;
        font-size: 13px;
    }
    .edu-tabs-header {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
        border-bottom: 2px solid #444;
        padding-bottom: 6px;
        width: 100%;
        box-sizing: border-box;
    }
    .edu-tab-btn {
        flex: 1 1 0;
        min-width: 0;
        padding: 6px 4px;
        font-size: 10px;
        line-height: 1.4;
        cursor: pointer;
        background: #222;
        color: #aaa;
        border: 1px solid #444;
        border-radius: 4px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        word-break: break-word;
        box-sizing: border-box;
    }
    .edu-tab-btn.active {
        background: #007acc;
        color: #fff;
        border-color: #0099ff;
        font-weight: bold;
    }
    .tab-tutorial-hint {
        font-size: 10px;
        color: #ffcc00;
        margin-bottom: 12px;
        text-align: center;
        background: rgba(0, 0, 0, 0.4);
        padding: 5px 8px;
        border-radius: 4px;
    }

    /* Node Card Layout with 200x200 Scaled Thumbnail */
    .node-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 8px;
        box-sizing: border-box;
    }
    .node-card-img {
        width: 200px;
        height: 200px;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #444;
        flex-shrink: 0;
        box-sizing: border-box;
    }
    .node-card-text {
        flex: 1;
        font-size: 13px;
        line-height: 1.5;
        color: #eee;
    }
    .node-card-text p {
        margin: 0 0 10px 0 !important;
        line-height: 1.4 !important;
    }
    .node-card-text p:last-child {
        margin-bottom: 0 !important;
    }

    /* Modal Gallery for Inline Document Showcase Images (Strict 200x200px on Desktop) */
    .modal-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
        margin-bottom: 14px;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
    }
    .modal-gallery img {
        width: 200px;
        height: 200px;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #444;
        flex-shrink: 0;
        box-sizing: border-box;
    }

    /* Game Poster Grid Layouts */
    .game-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 10px;
        margin-bottom: 14px;
        justify-items: center;
        width: 100%;
        box-sizing: border-box;
    }
    .game-grid-2col {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 10px;
        margin-bottom: 14px;
        justify-items: center;
        width: 100%;
        box-sizing: border-box;
    }
    .game-grid-4col {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-top: 10px;
        margin-bottom: 6px;
        justify-items: center;
        width: 100%;
        box-sizing: border-box;
    }
    .game-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
    }
    .game-item img {
        width: 200px;
        height: 200px;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #444;
        box-sizing: border-box;
    }
    .game-item span {
        margin-top: 6px;
        font-size: 11px;
        font-weight: bold;
        color: #eee;
        text-align: center;
        line-height: 1.3;
    }

    /* Responsive Mobile Overrides */
    @media (max-width: 600px) {
        .edu-tab-btn {
            font-size: 9px !important;
            padding: 5px 2px !important;
            line-height: 1.3 !important;
        }
        .edu-tabs-header {
            gap: 4px !important;
        }

        /* Node Card: Centered Thumbnail First, Stacked Text Below */
        .node-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 10px !important;
            padding: 8px !important;
        }
        .node-card-img {
            width: 200px !important;
            height: 200px !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }
        .node-card-text {
            width: 100% !important;
            text-align: center !important;
            font-size: 11px !important;
        }

        /* Showcase Gallery Mobile: 2 Images Per Row, Remaining Odd Images Centered */
        .modal-gallery {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            justify-content: center !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        .modal-gallery img {
            box-sizing: border-box !important;
            flex: 0 0 calc(50% - 6px) !important;
            width: calc(50% - 6px) !important;
            max-width: 200px !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
            object-fit: cover !important;
        }

        /* Game Grid Mobile: 2 Columns Layout */
        .game-grid, .game-grid-2col, .game-grid-4col {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
        }
        .game-item img {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
        }
        .game-item span {
            font-size: 10px !important;
        }
    }
`;
document.head.appendChild(modalStyleTag);

// Force update HTML inner content for both new and existing modals (targeting all matching IDs in DOM)
function forceUpdateModalContent(id, innerHTMLContent) {
    let modals = document.querySelectorAll('#' + id);
    if (modals.length === 0) {
        let modal = document.createElement('div');
        modal.id = id;
        modal.className = 'menu-box hidden';
        (document.getElementById('ui-layer') || document.body).appendChild(modal);
        modal.innerHTML = innerHTMLContent;
        return modal;
    } else {
        modals.forEach(modal => {
            modal.innerHTML = innerHTMLContent;
        });
        return modals[0];
    }
}

// Setup and overwrite all modal nodes with INTERACTION NODES.md specs
function setupNodeModals() {
    // 1. RETURN TO HOME MODAL
    forceUpdateModalContent('confirm-home-modal', `
        <h2>RETURN TO HOME</h2>
        <p style="text-align: center; margin-top: 10px; margin-bottom: 15px;">Return to home screen?</p>
        <div class="button-group" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; margin-top: 15px; width: 100%; max-width: 100%; box-sizing: border-box;">
            <button id="btn-home-yes" style="min-width: 80px; max-width: 110px; width: 42%; box-sizing: border-box; padding: 8px 10px;">YES</button>
            <button id="btn-home-no" style="min-width: 80px; max-width: 110px; width: 42%; box-sizing: border-box; padding: 8px 10px;">NO</button>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 2. EDUCATION & SKILLS MODAL (1st Tab: SKILLS & EXPERTISE, 2nd Tab: EDUCATION & CERTIFICATION)
    const eduModal = forceUpdateModalContent('modal-edu', `
        <h2>EDUCATION & SKILLS</h2>
        <div class="tab-tutorial-hint">💡 TIP: Press ◄ / ► Arrow Keys or Tap Tabs to Switch</div>
        <div class="edu-tabs-header">
            <button class="edu-tab-btn active" id="tab-btn-1">SKILLS & EXPERTISE</button>
            <button class="edu-tab-btn" id="tab-btn-2">EDUCATION & CERTIFICATION</button>
        </div>
        <div class="modal-scroll-body">
            <div id="edu-tab-content-1">
                <p>• <strong>PRODUCTION:</strong> Agile, Scrum, Kanban, Roadmapping, Milestone Planning, Dependency Management, Risk Mitigation, Capacity Planning, Live-Ops Release Management</p>
                <p>• <strong>PARTNERS & BUSINESS:</strong> Co-dev Partner Vetting, SOW Scoping & Contract Negotiation, External Milestone Review, Quality Gates, Vendor & Stakeholder Management, Budget & Resource Allocation</p>
                <p>• <strong>PLATFORMS:</strong> PC, PlayStation, Xbox, Nintendo Switch, Mobile; Multi-platform Production, Platform Requirements</p>
                <p>• <strong>GAME TYPES:</strong> Early Access, Multiplayer, Live Service, Cross-Platform, Systems-driven Games</p>
                <p>• <strong>LEADERSHIP:</strong> Remote/Async Team Leadership, Executive Reporting, Mentoring & Coaching, Cross-Discipline Coordination</p>
                <p>• <strong>TOOLS (Hands-on):</strong> Jira, Confluence, Notion, Airtable, Miro, Figma</p>
                <p>• <strong>TECHNICAL FAMILIARITY:</strong> Unity, Unreal Engine 5, Perforce</p>
            </div>
            <div id="edu-tab-content-2" style="display: none;">
                <p>• <strong>Bachelor of Engineering, Logistics & Supply Chain Management</strong> | Vietnam National University - HCM IU</p>
                <p>• <strong>Project Management Certificate</strong> | Google</p>
                <p>• <strong>Feedback and Conflict Management</strong> | PACE Institute</p>
                <p>• <strong>Managed Ad Service and Business Development in Games</strong> | Yodo1 Games</p>
                <p>• <strong>Data-Driven Product Management</strong> | NASBA Association</p>
                <p>• <strong>Product Management: Customer Development</strong> | Project Management Institute</p>
                <p>• <strong>AI Infrastructure and Operations</strong> | NVIDIA Academy</p>
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // Tab switching event handlers for Book & Diploma Modal
    window.switchEduTab = function(tabIndex) {
        const modal = document.getElementById('modal-edu');
        if (!modal) return;
        const btn1 = modal.querySelector('#tab-btn-1');
        const btn2 = modal.querySelector('#tab-btn-2');
        const content1 = modal.querySelector('#edu-tab-content-1');
        const content2 = modal.querySelector('#edu-tab-content-2');
        if (tabIndex === 1) {
            if (btn1) btn1.classList.add('active');
            if (btn2) btn2.classList.remove('active');
            if (content1) content1.style.display = 'block';
            if (content2) content2.style.display = 'none';
        } else {
            if (btn2) btn2.classList.add('active');
            if (btn1) btn1.classList.remove('active');
            if (content2) content2.style.display = 'block';
            if (content1) content1.style.display = 'none';
        }
    };

    const tabBtn1 = eduModal ? eduModal.querySelector('#tab-btn-1') : null;
    const tabBtn2 = eduModal ? eduModal.querySelector('#tab-btn-2') : null;
    if (tabBtn1 && tabBtn2) {
        tabBtn1.onclick = () => { playClickSFX(); window.switchEduTab(1); };
        tabBtn2.onclick = () => { playClickSFX(); window.switchEduTab(2); };
    }

    // 3. WORK EXPERIENCE MODAL (Monitor, Laptop, Keyboard & Chart)
    forceUpdateModalContent('modal-work', `
        <h2>WORK EXPERIENCE</h2>
        <div class="modal-scroll-body">
            <p><strong>SENIOR PROJECT MANAGER, Live-Ops Production</strong> | 04/2026 – Present<br>
            <em>Gameloft, global mobile and console game publisher | Hybrid</em></p>
            <p>• Produce live-ops content for Asphalt Legends, including cosmetics and promotional assets, with the Saigon team and Barcelona co-dev to keep the live-ops roadmap on cadence.</p>
            <p>• Align Agile/Jira workflows and dependency tracking across Barcelona and Saigon studios to reduce cross-timezone handoff delays.</p>
            <p>• Deliver weekly status to studio leadership on progress, resource allocation and live-ops risks.</p>
            <p>• Support discipline leads across Saigon and Barcelona in owning feature delivery and clearing daily blockers.</p>
            <div class="modal-gallery">
                <img src="assets/document/gameloft_1.png" alt="Gameloft Showcase">
            </div>
            <hr style="border: 0; border-top: 1px solid #444; margin: 12px 0;">
            <p><strong>PRODUCER (Concurrent Contract)</strong> | 09/2025 – 11/2025<br>
            <em>Seedworld Studios, survival game developer (Unreal Engine 5) | Remote</em></p>
            <p>• Set up workflows between Design, 3D Art and Tech Art to speed up UE5 integration in a 3-month engagement.</p>
            <p>• Drove production sprints to a public playtest build on Epic Games Store before the studio closed due to funding.</p>
            <div class="modal-gallery">
                <img src="assets/document/seedworld_1.png" alt="Seedworld Showcase 1">
                <img src="assets/document/seedworld_2.gif" alt="Seedworld Showcase 2">
            </div>
            <hr style="border: 0; border-top: 1px solid #444; margin: 12px 0;">
            <p><strong>LEAD PROJECT MANAGER | PRODUCER</strong> | 05/2022 – 11/2025<br>
            <em>Sky Mavis, developer of Axie Infinity | Hybrid</em></p>
            <p>• Led and mentored associate producers, and aligned discipline leads across Design, Art and Engineering, on a Homeland team.</p>
            <p>• Produced Axie Infinity: Homeland from pre-production through Early Access to a simultaneous global 1.0 launch, then produced 4 major post-launch content updates informed by telemetry; coordinated QA, localization and audio vendors.</p>
            <p>• Co-built the 12-month production roadmap for Axie Infinity: Origins and scoped requirements for 2 co-dev studios (animation, audio) through 1.0 launch.</p>
            <p>• Vetted work-for-hire art vendors for Duet Monsters and Origins; negotiated 6-month SOWs (scope, rates, payment terms) with Legal/BizDev and saved 8% on asset budget.</p>
            <p>• Reworked sprint planning for multiple concurrent projects during rapid studio growth; main contact between dev teams and senior business stakeholders.</p>
            <div class="modal-gallery">
                <img src="assets/document/skymavis_1.png" alt="Sky Mavis Showcase 1">
                <img src="assets/document/skymavis_2.png" alt="Sky Mavis Showcase 2">
                <img src="assets/document/skymavis_3.png" alt="Sky Mavis Showcase 3">
                <img src="assets/document/skymavis_4.png" alt="Sky Mavis Showcase 4">
            </div>
            <hr style="border: 0; border-top: 1px solid #444; margin: 12px 0;">
            <p><strong>PRODUCER</strong> | 01/2019 – 05/2022<br>
            <em>Sparx - a Virtuos Studio, AAA co-development studio | Hybrid</em></p>
            <p>• Managed external delivery of the art pipeline for AAA clients, including The Quarry (Supermassive Games), CORE (Manticore Games), XCOM Legends (Chimera Games), Clash of Beasts (Ubisoft) and Century: Age of Ashes (Playwing).</p>
            <p>• Set acceptance criteria and quality checks with clients; verified deliveries in Perforce against milestone requirements and flagged console memory risks early.</p>
            <p>• Forecasted headcount across Tech Art and 3D Character teams against client milestones.</p>
            <div class="modal-gallery">
                <img src="assets/document/sparx_1.png" alt="Sparx Showcase 1">
                <img src="assets/document/sparx_2.png" alt="Sparx Showcase 2">
                <img src="assets/document/sparx_3.png" alt="Sparx Showcase 3">
            </div>
            <hr style="border: 0; border-top: 1px solid #444; margin: 12px 0;">
            <p><strong>Early career (non-game project management)</strong><br>
            <strong>LG Corp, PROJECT MANAGER</strong> (02/2018 – 01/2019) | <strong>Vegetexco, PROJECT COORDINATOR</strong> (01/2017 – 12/2017)</p>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 4. SHIPPED TITLES & PROJECTS MODAL (TV, PS5 & Switch)
    forceUpdateModalContent('modal-game', `
        <h2>SHIPPED TITLES & PROJECTS</h2>
        <div class="modal-scroll-body">
            <div class="node-card">
                <img src="assets/document/asphaltlegends.png" alt="Asphalt Legends Unite" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>ASPHALT LEGENDS (2026)</strong> | PS4/PS5, Xbox One/Series, Switch, PC, Mobile<br>
                    <em>PRODUCER, live-ops | 20+ internal (Saigon), co-dev with Gameloft Barcelona</em></p>
                </div>
            </div>
            <div class="node-card">
                <img src="assets/document/duetmonsters.png" alt="Duet Monsters" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>DUET MONSTERS (2024)</strong> | PC, Mobile | Licensed IP<br>
                    <em>EXTERNAL DEVELOPMENT PRODUCER, co-dev production | Co-dev oversight, SOW negotiation with Legal/BizDev</em></p>
                </div>
            </div>
            <div class="node-card">
                <img src="assets/document/homeland.png" alt="Axie Infinity: Homeland" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>AXIE INFINITY: HOMELAND (2023)</strong> | PC (Early Access → 1.0)<br>
                    <em>LEAD PRODUCER, pre-production through live support | 35+ internal, plus external QA, localization and audio vendors</em></p>
                </div>
            </div>
            <div class="node-card">
                <img src="assets/document/origins.png" alt="Axie Infinity: Origins" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>AXIE INFINITY: ORIGINS (2022)</strong> | PC, Mobile<br>
                    <em>PRODUCER, roadmap through 1.0 launch | 25+ internal, 2 co-dev studios (animation, audio)</em></p>
                </div>
            </div>
            <div class="node-card">
                <img src="assets/document/thequarry.png" alt="The Quarry" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>THE QUARRY (2022)</strong> | PS4/PS5, Xbox One/Series, PC<br>
                    <em>PRODUCER (AAA co-dev), art pipeline delivery | 10-person Tech Art and 3D Character team</em></p>
                </div>
            </div>
            <div class="node-card" style="display: block;">
                <div class="node-card-text" style="margin-bottom: 8px;">
                    <p style="margin: 0 !important;">• <strong>ADDITIONAL AAA CO-DEV TITLES</strong><br><em>(Sparx, art pipeline delivery)</em></p>
                </div>
                <div class="game-grid-4col">
                    <div class="game-item">
                        <img src="assets/document/core.png" alt="CORE by Manticore Games">
                        <span>CORE by Manticore Games</span>
                    </div>
                    <div class="game-item">
                        <img src="assets/document/xcomlegends.png" alt="XCOM LEGENDS by Chimera Games">
                        <span>XCOM LEGENDS by Chimera Games</span>
                    </div>
                    <div class="game-item">
                        <img src="assets/document/clashofbeasts.png" alt="CLASH OF BEAST by Ubisoft">
                        <span>CLASH OF BEAST by Ubisoft</span>
                    </div>
                    <div class="game-item">
                        <img src="assets/document/century.png" alt="CENTURY: AGE OF ASHES by Playwing LTD">
                        <span>CENTURY: AGE OF ASHES by Playwing LTD</span>
                    </div>
                </div>
            </div>
            <div class="node-card">
                <img src="assets/document/seedworld_1.png" alt="Unreleased Project: Seedworld" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>UNRELEASED PROJECT: SEEDWORLD (2025)</strong> | PC, UE5 survival game<br>
                    <em>Producer, UE5 workflow setup and playtest build | Studio closed due to funding before release.</em></p>
                </div>
            </div>
            <div class="node-card">
                <img src="assets/document/greenbird_0b.png" alt="Unannounced Indie Project" class="node-card-img">
                <div class="node-card-text">
                    <p>• <strong>UNANNOUNCED INDIE PROJECT (2026 - Present)</strong> | Roguelite RPG<br>
                    <em>Producer and systems designer, pre-production</em></p>
                </div>
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 5. MY INDIE GAME PROJECT MODAL (Bird)
    forceUpdateModalContent('modal-indie-game', `
        <h2>MY INDIE GAME PROJECT</h2>
        <div class="modal-scroll-body">
            <div style="text-align: center; margin-bottom: 12px;">
                <img src="assets/document/greenbird_0a.png" alt="Greenbird Banner" style="width: 100%; max-width: 314px; height: auto; aspect-ratio: 1257 / 600; object-fit: cover; border-radius: 4px; border: 1px solid #444; margin: 0 auto; display: block; box-sizing: border-box;">
            </div>
            <p><strong>Unannounced Kakapo-Inspired 2.5D Roguelite RPG</strong></p>
            <p>• <strong>Role:</strong> Product Strategy, Systemic Design & Worldbuilding (In collaboration with a Core Team spanning Art, Technical, and Community & IP Building)</p>
            <p>• <strong>Overview & Mechanics</strong><br>
            An unannounced 2.5D roguelite RPG currently in early prototype, blending high-tempo combat with an integrated base-building economy. Dungeon extraction runs directly feed raw ingredients into a specialized restaurant simulation, where customer interactions, menu growth, and revenue seamlessly fund deeper combat gear and progression.</p>
            <p>• <strong>World & Visual Identity</strong><br>
            Set in a multi-layered avian kingdom divided by class and power, the core experience is driven by deep story exploration and character development. Anchored by dynamic In-Run Character Swapping, players unearth the dark secrets of a dystopian world while uncovering the personal arcs, synergies, and evolving relationships of four distinct bird protagonists.</p>
            <p><strong>Early Character Concept</strong></p>
            <div class="modal-gallery">
                <img src="assets/document/greenbird_1.png" alt="Early Character Concept 1">
                <img src="assets/document/greenbird_2.png" alt="Early Character Concept 2">
                <img src="assets/document/greenbird_3.png" alt="Early Character Concept 3">
                <img src="assets/document/greenbird_4.png" alt="Early Character Concept 4">
                <img src="assets/document/greenbird_5.png" alt="Early Character Concept 5">
            </div>
            <p><strong>Camera Angle Test</strong></p>
            <div class="modal-gallery">
                <img src="assets/document/greenbird_6.png" alt="Camera Angle Test 1">
                <img src="assets/document/greenbird_7.png" alt="Camera Angle Test 2">
                <img src="assets/document/greenbird_8.png" alt="Camera Angle Test 3">
            </div>
            <p><strong>Restaurant View Test & Color Options</strong></p>
            <div class="modal-gallery">
                <img src="assets/document/greenbird_9.png" alt="Restaurant View Test 1">
                <img src="assets/document/greenbird_10.png" alt="Restaurant View Test 2">
                <img src="assets/document/greenbird_11.png" alt="Restaurant View Test 3">
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 6. ABOUT ME / PROFESSIONAL SUMMARY MODAL (Person on Sofa)
    forceUpdateModalContent('about-modal', `
        <h2>PROFESSIONAL SUMMARY</h2>
        <div class="modal-scroll-body">
            <p>Hello, I am Zed, welcome to my personal portfolio!</p>
            <p>I am a Senior Producer with 7+ years in game production and 3+ shipped PC, console and mobile titles, including the full lifecycle from pre-production through 1.0 launch and live-ops. Specializes in co-development partnerships: vetting studios, negotiating scope and payment terms with Legal/BizDev, and reviewing external milestones. Led and mentored associate producers and aligned cross-discipline leads across distributed studios.</p>
            <p>Feel free to go around and interact with the items in the room to learn more about me :)</p>
            <p>Hope you enjoy it!</p>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 7. MY LOVELY PUPPY MODAL (Bông)
    forceUpdateModalContent('modal-puppy', `
        <h2>MY LOVELY PUPPY - BÔNG</h2>
        <div class="modal-scroll-body">
            <div class="node-card">
                <img src="assets/document/bong_thumbnail.png" alt="Bông Thumbnail" class="node-card-img">
                <div class="node-card-text">
                    <p>Meet Bông, my 5-year-old tiny cotton ball! She is a Bichon Frise and Shih Tzu mix and a content creator that has +10k follower on TikTok (account run by her mama lol).</p>
                    <p>You can check her out at: <a href="https://www.tiktok.com/@conbongbao" target="_blank" rel="noopener noreferrer" style="color: #4af; text-decoration: underline; word-break: break-all;">https://www.tiktok.com/@conbongbao</a>.</p>
                    <p>Please drop a follow if you think she's cute! Thank you!</p>
                </div>
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 8. MY ACOUSTIC CAFÉ & LOUNGE STARTUP MODAL (Guitar)
    forceUpdateModalContent('modal-music', `
        <h2>MY ACOUSTIC CAFÉ & LOUNGE STARTUP</h2>
        <div class="modal-scroll-body">
            <div class="node-card">
                <img src="assets/document/cliche_thumbnail.png" alt="Cliche Thumbnail" class="node-card-img">
                <div class="node-card-text">
                    <p><strong>My Real-World Business Bootcamp: Cliché Café & Lounge</strong></p>
                    <p>Acquired, rebranded, and managed an end-to-end F&B business in central Saigon. From optimizing daytime office traffic to weekend acoustic shows and pivoting through COVID-19 lockdowns, this 2-year venture laid the foundational operational mindset for my leadership career.</p>
                    <p><a href="assets/document/cliche.pdf" target="_blank" rel="noopener noreferrer" style="color: #ffcc00; text-decoration: underline; font-weight: bold;">[See details]</a></p>
                </div>
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 9. MY HOBBIES MODAL (Basketball)
    const sportModal = forceUpdateModalContent('modal-sport', `
        <h2>MY HOBBIES</h2>
        <div class="tab-tutorial-hint">💡 TIP: Press ◄ / ► Arrow Keys or Tap Tabs to Switch</div>
        <div class="edu-tabs-header">
            <button class="edu-tab-btn active" id="sport-tab-btn-1">BASKETBALL</button>
            <button class="edu-tab-btn" id="sport-tab-btn-2">MY FIRST SIDE HUSTLE</button>
        </div>
        <div class="modal-scroll-body">
            <div id="sport-tab-content-1">
                <p>Basketball has been a core pillar of my life since the age of 8. Moving from school leagues to founding and leading corporate teams, the court has always been my laboratory for discipline, high-speed execution, and situational leadership. To me, basketball is far more than a sport - it is a continuous masterclass in spatial awareness, adaptive tactics under pressure, and building seamless team synergy. The deep, lasting camaraderie built over a decade on the court directly shapes how I lead cross-functional game development teams today: with high trust, clear communication, and relentless drive.</p>
                <div class="modal-gallery">
                    <img src="assets/document/basketball_1.png" alt="Basketball 1">
                    <img src="assets/document/basketball_2.png" alt="Basketball 2">
                    <img src="assets/document/basketball_3.png" alt="Basketball 3">
                    <img src="assets/document/basketball_4.png" alt="Basketball 4">
                </div>
            </div>
            <div id="sport-tab-content-2" style="display: none;">
                <div class="node-card">
                    <img src="assets/document/zoomarc.png" alt="Zoomarc Thumbnail" class="node-card-img">
                    <div class="node-card-text">
                        <p><strong>ZOOMARC</strong> - Custom Basketball Apparel</p>
                        <p><a href="https://www.instagram.com/zoomarc" target="_blank" rel="noopener noreferrer" style="color: #ffcc00; text-decoration: underline;">[Link to IG Page]</a></p>
                    </div>
                </div>
                <p>Driven by a passion for basketball culture and self-expression, I co-founded a specialized custom sublimation-printed apparel brand during my senior year of university alongside my then-girlfriend (now my wife and long-term creative business partner). We built the business end-to-end: handling raw material sourcing, operating heat-transfer machinery, managing inventory, directing product shoots, and driving direct-to-consumer digital marketing.</p>
                <p>Over its run, we built an organic community of over 800+ players and delivered 1000+ custom units, and maintained a ~25% repeat customer rate. Managing this venture provided invaluable real-world grounding in unit economics, budget allocation, customer empathy, and operational resilience. While I strategically sunsetted the business in 2021 to dedicate our full focus to scaling careers in game production, this experience laid the foundational business mindset that drives my project leadership today.</p>
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // Tab switching event handlers for Basketball Modal
    window.switchSportTab = function(tabIndex) {
        const modal = document.getElementById('modal-sport');
        if (!modal) return;
        const btn1 = modal.querySelector('#sport-tab-btn-1');
        const btn2 = modal.querySelector('#sport-tab-btn-2');
        const content1 = modal.querySelector('#sport-tab-content-1');
        const content2 = modal.querySelector('#sport-tab-content-2');
        if (tabIndex === 1) {
            if (btn1) btn1.classList.add('active');
            if (btn2) btn2.classList.remove('active');
            if (content1) content1.style.display = 'block';
            if (content2) content2.style.display = 'none';
        } else {
            if (btn2) btn2.classList.add('active');
            if (btn1) btn1.classList.remove('active');
            if (content2) content2.style.display = 'block';
            if (content1) content1.style.display = 'none';
        }
    };

    const sportTabBtn1 = sportModal ? sportModal.querySelector('#sport-tab-btn-1') : null;
    const sportTabBtn2 = sportModal ? sportModal.querySelector('#sport-tab-btn-2') : null;
    if (sportTabBtn1 && sportTabBtn2) {
        sportTabBtn1.onclick = () => { playClickSFX(); window.switchSportTab(1); };
        sportTabBtn2.onclick = () => { playClickSFX(); window.switchSportTab(2); };
    }

    // 10. MY RECENT FAVORITE GAMES MODAL (Poster) - Grid
    forceUpdateModalContent('modal-poster', `
        <h2>MY RECENT FAVORITE GAMES</h2>
        <div class="modal-scroll-body">
            <div class="game-grid">
                <div class="game-item">
                    <img src="assets/document/davethediver.png" alt="DAVE THE DIVER">
                    <span>DAVE THE DIVER</span>
                </div>
                <div class="game-item">
                    <img src="assets/document/cultofthelambs.png" alt="CULT OF THE LAMB">
                    <span>CULT OF THE LAMB</span>
                </div>
                <div class="game-item">
                    <img src="assets/document/dredge.png" alt="DREDGE">
                    <span>DREDGE</span>
                </div>
                <div class="game-item">
                    <img src="assets/document/fc26.png" alt="FC 26">
                    <span>FC 26</span>
                </div>
                <div class="game-item">
                    <img src="assets/document/streetfighter6.png" alt="STREET FIGHTER 6">
                    <span>STREET FIGHTER 6</span>
                </div>
                <div class="game-item">
                    <img src="assets/document/valorant.png" alt="VALORANT">
                    <span>VALORANT</span>
                </div>
                <div class="game-item">
                    <img src="assets/document/marvelsnap.png" alt="MARVEL SNAP">
                    <span>MARVEL SNAP</span>
                </div>
            </div>
        </div>
        <button class="btn-close">Close / [ESC]</button>
    `);

    // 11. UPDATE EXISTING OPTIONS MODAL CLOSE BUTTON IF PRESENT
    ['options-modal'].forEach(id => {
        const m = document.getElementById(id);
        if (m && !m.querySelector('.btn-close')) {
            const btn = document.createElement('button');
            btn.className = 'btn-close';
            btn.textContent = 'Close / [ESC]';
            m.appendChild(btn);
        } else if (m && m.querySelector('.btn-close')) {
            m.querySelector('.btn-close').textContent = 'Close / [ESC]';
        }
    });
}

// Run forced modal content updates at script load and DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNodeModals);
} else {
    setupNodeModals();
}

const mainMenu = document.getElementById('main-menu');
const tutorialPopup = document.getElementById('tutorial-popup');

let game;
let isMenuOpen = true; // Main menu is active on load
let joystickMove = { x: 0, y: 0 };

// Helper function to close all active non-main-menu modals
function closeActiveModals() {
    const activeModals = document.querySelectorAll('.menu-box:not(#main-menu):not(.hidden)');
    activeModals.forEach(modal => modal.classList.add('hidden'));
    
    // Only unfreeze character movement if the main menu is already closed
    if (mainMenu.classList.contains('hidden')) {
        isMenuOpen = false;
    }

    // Reset HUD icon glows on modal close
    if (game && game.scene && game.scene.scenes[0]) {
        const scene = game.scene.scenes[0];
        if (scene.settingIcon && scene.settingIcon.glowFx) scene.settingIcon.glowFx.setActive(false);
        if (scene.homeIcon && scene.homeIcon.glowFx) scene.homeIcon.glowFx.setActive(false);
        if (game.canvas) game.canvas.style.cursor = 'default';
    }
}

// Global Keyboard Listener for Modal PC Navigation: Up/Down Arrow Scrolling, Left/Right Arrow Tab Switch & ESC to Close
window.addEventListener('keydown', (event) => {
    const activeModal = document.querySelector('.menu-box:not(#main-menu):not(.hidden)');

    if (activeModal) {
        const scrollBody = activeModal.querySelector('.modal-scroll-body');

        // 1. PC UP & DOWN ARROW SCROLLING inside active modal body
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (scrollBody) scrollBody.scrollTop -= 40;
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (scrollBody) scrollBody.scrollTop += 40;
            return;
        }

        // 2. ONLY LEFT & RIGHT ARROWS FOR TAB SWITCHING (inside Education & Hobbies Modals)
        if (activeModal.id === 'modal-edu') {
            if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
                event.preventDefault();
                playClickSFX();
                if (window.switchEduTab) window.switchEduTab(1);
                return;
            }
            if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
                event.preventDefault();
                playClickSFX();
                if (window.switchEduTab) window.switchEduTab(2);
                return;
            }
        }

        if (activeModal.id === 'modal-sport') {
            if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
                event.preventDefault();
                playClickSFX();
                if (window.switchSportTab) window.switchSportTab(1);
                return;
            }
            if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
                event.preventDefault();
                playClickSFX();
                if (window.switchSportTab) window.switchSportTab(2);
                return;
            }
        }

        // 3. CLOSE MODAL SHORTCUT (ESCAPE ONLY)
        if (event.key === 'Escape') {
            event.preventDefault();
            playClickSFX();
            closeActiveModals();
        }
    }
});

// Setup Options Checkboxes Listener
const optionsCheckboxes = document.querySelectorAll('#options-modal input[type="checkbox"]');
if (optionsCheckboxes.length > 0) {
    // BGM Checkbox (Index 0)
    optionsCheckboxes[0].addEventListener('change', (e) => {
        playClickSFX();
        bgmMuted = !e.target.checked;
        bgmAudio.muted = bgmMuted;
        if (!bgmMuted) startBGM();
    });

    // SFX Checkbox (Index 1)
    if (optionsCheckboxes[1]) {
        optionsCheckboxes[1].addEventListener('change', (e) => {
            playClickSFX();
            sfxMuted = !e.target.checked;
            if (game && game.scene && game.scene.scenes[0]) {
                const scene = game.scene.scenes[0];
                if (scene.flyingSfx) {
                    scene.flyingSfx.setMute(sfxMuted);
                }
            }
        });
    }
}

document.getElementById('btn-play').addEventListener('click', () => {
    playClickSFX();
    mainMenu.classList.add('hidden');
    isMenuOpen = false; // Reset menu freeze state so character can move immediately

    // Reveal game container and canvas
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'block';

    if (!game) {
        initPhaserGame();
    } else {
        if (game.canvas) game.canvas.style.display = 'block';
        if (game.scene && game.scene.scenes[0]) {
            const scene = game.scene.scenes[0];
            if (scene.player) {
                scene.player.setPosition(530, 520);
                scene.currentDir = 'se';
                scene.player.setFlipX(false);
                scene.player.play('player_idle_se');
            }
        }
    }

    if (game && game.canvas) {
        game.canvas.focus();
    }
    tutorialPopup.classList.remove('hidden');
    setTimeout(() => tutorialPopup.classList.add('hidden'), 5000);
});

document.getElementById('btn-options').addEventListener('click', () => {
    playClickSFX();
    openNodeModal('options-modal');
});

document.getElementById('btn-about').addEventListener('click', () => {
    playClickSFX();
    openNodeModal('about-modal');
});

// Confirmation Modal "YES" & "NO" and Close Button Handlers
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-home-yes') {
        playClickSFX();
        closeActiveModals();
        if (tutorialPopup) tutorialPopup.classList.add('hidden');
        
        // Hide room canvas so it returns to initial clean homepage stage
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) gameContainer.style.display = 'none';
        if (game && game.canvas) game.canvas.style.display = 'none';

        mainMenu.classList.remove('hidden');
        isMenuOpen = true;
    } else if (e.target && e.target.id === 'btn-home-no') {
        playClickSFX();
        closeActiveModals();
    } else if (e.target && e.target.classList.contains('btn-close')) {
        playClickSFX();
        closeActiveModals();
    }
});

function openNodeModal(modalId) {
    setupNodeModals(); // Refresh modal content to overwrite any late-loaded static DOM elements
    const modals = document.querySelectorAll('#' + modalId);
    modals.forEach(m => m.classList.remove('hidden'));
    isMenuOpen = true; 
}

// Setup Global Screen Touch -> Bottom-Middle Translucent Joystick
function setupVirtualJoystick() {
    const container = document.getElementById('joystick-container');
    const thumb = document.getElementById('joystick-thumb');
    if (!container || !thumb) return;

    let isDragging = false;
    let touchId = null;
    let startX = 0;
    let startY = 0;
    const maxRadius = 45; // Maximum thumb drag radius in px

    const start = (e) => {
        if (isMenuOpen) return;
        if (e.target.closest('.menu-box') || e.target.closest('button')) return;

        const touch = e.touches ? e.touches[0] : e;
        if (e.touches && touchId !== null) return; 

        isDragging = true;
        if (e.touches) touchId = touch.identifier;

        startX = touch.clientX;
        startY = touch.clientY;

        // Reveal the fixed bottom-middle joystick
        container.classList.add('visible');

        thumb.style.transform = 'translate(0px, 0px)';
        joystickMove.x = 0;
        joystickMove.y = 0;

        move(e);
    };

    const move = (e) => {
        if (!isDragging) return;

        let touch = e;
        if (e.touches) {
            touch = Array.from(e.touches).find(t => t.identifier === touchId);
            if (!touch) return;
        }

        let dx = touch.clientX - startX;
        let dy = touch.clientY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > maxRadius) {
            dx = (dx / dist) * maxRadius;
            dy = (dy / dist) * maxRadius;
        }

        thumb.style.transform = `translate(${dx}px, ${dy}px)`;

        // Direct normalized vector output
        joystickMove.x = dx / maxRadius;
        joystickMove.y = dy / maxRadius;
    };

    const stop = (e) => {
        if (!isDragging) return;

        if (e.touches && touchId !== null) {
            const stillActive = Array.from(e.touches).some(t => t.identifier === touchId);
            if (stillActive) return;
        }

        isDragging = false;
        touchId = null;
        
        // Hide bottom-middle joystick when thumb is released
        container.classList.remove('visible');
        thumb.style.transform = 'translate(0px, 0px)';
        joystickMove.x = 0;
        joystickMove.y = 0;
    };

    window.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop, { passive: false });
    window.addEventListener('touchcancel', stop, { passive: false });

    window.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
}


// --- 3. PHASER 3 SETUP ---
function initPhaserGame() {
    if (game) return; 
    const config = {
        type: Phaser.AUTO, 
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'game-container',
            width: 1071, 
            height: 960   
        },
        pixelArt: true, // Preserves crisp pixel art when scaled 2x
        audio: {
            disableWebAudio: false
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false // DISABLED ARCADE PHYSICS DEBUG
            }
        },
        scene: { preload, create, update }
    };
    game = new Phaser.Game(config);
    setupVirtualJoystick();
}


// --- 4. PHASER SCENE LOGIC ---

// Array listed in Phaser Back-to-Front rendering order (Indices 0 to 24)
const RENDER_ORDER = [
    'floor', 'wall_r', 'wall_l', 'bookshelf', 'book', 
    'chart', 'desk', 'keyboard', 'monitor', 'laptop', 'chair', 'diploma', 
    'mat', 'tv', 'poster', 'bong', 'guitar', 
    'smalldesk', 'ps5', 'switch', 'speaker',
    'basketball', 'me_in_sofa', 'sofa', 'bird'
];

// Define animated background/prop assets
const ANIMATED_ASSETS = {
    'tv': { count: 20, fps: 12 }
};

// Player Character Spritesheet Config (360x360 with 4x4 grid = 90x90 per frame)
const PLAYER_SHEETS = {
    'se': 'CloakCharacter_315.png',
    's':  'CloakCharacter_270.png',
    'n':  'CloakCharacter_90.png',
    'ne': 'CloakCharacter_45.png',
    'e':  'CloakCharacter_0.png'
};

function preload() {
    // 1. Preload Audio Assets & In-Game HUD Icon Images
    this.load.audio('flying_sfx', 'assets/flying_sfx.mp3');
    this.load.image('home_icon', 'assets/home.png');
    this.load.image('setting_icon', 'assets/setting.png');

    // 2. Preload room visual assets
    RENDER_ORDER.forEach(key => {
        if (ANIMATED_ASSETS[key]) {
            const frameCount = ANIMATED_ASSETS[key].count;
            for (let i = 1; i <= frameCount; i++) {
                this.load.image(`${key}_${i}`, `assets/${key}_${i}.png`);
            }
        } else {
            this.load.image(key, `assets/${key}.png`);
        }
    });

    // 3. Preload Player Character Spritesheets at 90x90 px
    Object.keys(PLAYER_SHEETS).forEach(dir => {
        this.load.spritesheet(`player_${dir}`, `assets/${PLAYER_SHEETS[dir]}`, {
            frameWidth: 90,
            frameHeight: 90
        });
    });
}

function create() {
    this.visualSprites = {};

    // 1. MOVEMENT SFX SETUP
    this.flyingSfx = this.sound.add('flying_sfx', { volume: 0.5, loop: true });
    this.flyingSfx.setMute(sfxMuted);
    
    // 2. RENDER VISUALS
    RENDER_ORDER.forEach((key, index) => {
        let initialKey = ANIMATED_ASSETS[key] ? `${key}_1` : key;
        let sprite = this.add.sprite(0, 0, initialKey).setOrigin(0, 0);
        sprite.setDepth(index);
        this.visualSprites[key] = sprite;
    });

    // 3. HUD BUTTON SPRITES (AUTO-DETECT FULL CANVAS VS CROPPED ICON PNG)
    const setTex = this.textures.get('setting_icon').getSourceImage();
    const homeTex = this.textures.get('home_icon').getSourceImage();

    if (setTex && setTex.width > 300) {
        this.settingIcon = this.add.sprite(0, 0, 'setting_icon').setOrigin(0, 0).setDepth(2000);
    } else {
        this.settingIcon = this.add.sprite(880, 125, 'setting_icon').setOrigin(0, 0).setDepth(2000);
    }

    if (homeTex && homeTex.width > 300) {
        this.homeIcon = this.add.sprite(0, 0, 'home_icon').setOrigin(0, 0).setDepth(2000);
    } else {
        this.homeIcon = this.add.sprite(960, 155, 'home_icon').setOrigin(0, 0).setDepth(2000);
    }

    // Register HUD icons into visualSprites map
    this.visualSprites['settingIcon'] = this.settingIcon;
    this.visualSprites['homeIcon'] = this.homeIcon;

    // Attach shape glow FX to HUD setting and home icons
    [this.settingIcon, this.homeIcon].forEach(icon => {
        if (icon && icon.preFX) {
            icon.glowFx = icon.preFX.addGlow(0xffff00, 1, 0, false);
            icon.glowFx.setActive(false);

            this.tweens.add({
                targets: icon.glowFx,
                outerStrength: 5,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    });

    // 4. BUILD & PLAY PROP ANIMATIONS
    Object.keys(ANIMATED_ASSETS).forEach(key => {
        const config = ANIMATED_ASSETS[key];
        const frames = [];
        
        for (let i = 1; i <= config.count; i++) {
            frames.push({ key: `${key}_${i}` });
        }
        
        this.anims.create({
            key: `${key}-anim`,
            frames: frames,
            frameRate: config.fps, 
            repeat: -1     
        });
        
        this.visualSprites[key].play(`${key}-anim`);
    });

    // 5. BUILD PLAYER CHARACTER ANIMATIONS
    Object.keys(PLAYER_SHEETS).forEach(dir => {
        // Idle (Row 1: frames 0-3)
        this.anims.create({
            key: `player_idle_${dir}`,
            frames: this.anims.generateFrameNumbers(`player_${dir}`, { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        // Walk (Row 2: frames 4-7)
        this.anims.create({
            key: `player_walk_${dir}`,
            frames: this.anims.generateFrameNumbers(`player_${dir}`, { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        // Interact (Row 3: frames 8-11)
        this.anims.create({
            key: `player_interact_${dir}`,
            frames: this.anims.generateFrameNumbers(`player_${dir}`, { start: 8, end: 11 }),
            frameRate: 8,
            repeat: 0
        });

        // Attack (Row 4: frames 12-15)
        this.anims.create({
            key: `player_attack_${dir}`,
            frames: this.anims.generateFrameNumbers(`player_${dir}`, { start: 12, end: 15 }),
            frameRate: 10,
            repeat: 0
        });
    });

    // 6. SETUP INVISIBLE PHYSICS OBSTACLES
    this.obstacles = this.physics.add.staticGroup();

    const addHitbox = (x, y, w, h) => {
        let rect = this.add.rectangle(x, y, w, h).setOrigin(0, 0);
        this.physics.add.existing(rect, true);
        this.obstacles.add(rect);
    };

    const createIsoWall = (x1, y1, x2, y2, size) => {
        const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
        const steps = Math.floor(distance / (size * 0.75)); 
        if (steps <= 0) return;
        const dx = (x2 - x1) / steps;
        const dy = (y2 - y1) / steps;

        for (let i = 0; i <= steps; i++) {
            let rect = this.add.rectangle(x1 + dx * i, y1 + dy * i, size, size).setOrigin(0.5, 0.5);
            this.physics.add.existing(rect, true);
            this.obstacles.add(rect);
        }
    };

    // --- MASSIVE OUTER BOUNDARIES ---
    addHitbox(-200, 0, 280, 960);    
    addHitbox(990, 0, 200, 960);     
    addHitbox(0, -200, 1071, 670);   
    addHitbox(0, 920, 1071, 200);    

    // --- Exact Isometric Floor Perimeter ---
    createIsoWall(505, 445, 55,  670, 45); 
    createIsoWall(535, 435, 985, 660, 45); 
    createIsoWall(85,  700, 535, 925, 45); 
    createIsoWall(985, 700, 535, 925, 45); 

    // --- Core Safe Blocks ---
    addHitbox(110, 560, 60,  60);  // Speaker block
    addHitbox(375, 475, 50,  75);  // Guitar / corner block
    addHitbox(720, 450, 200, 100); // Main Desk block
    addHitbox(400, 750, 260, 90);  // Sofa center block

    // --- Clean Diagonal Edges ---
    createIsoWall(170, 675, 370, 585, 45); // Smalldesk diagonal front edge
    createIsoWall(175, 570, 375, 470, 40); // Left diagonal edge
    createIsoWall(600, 460, 850, 585, 35); // Bookshelf to desk diagonal edge

    // --- Full Sofa Perimeter ---
    createIsoWall(380, 810, 650, 675, 45); 
    createIsoWall(380, 810, 460, 850, 45); 
    createIsoWall(650, 675, 720, 710, 45); 

    // --- GAP SEALER ---
    createIsoWall(720, 710, 870, 635, 45); 


    // 7. PLAYER SETUP
    this.player = this.physics.add.sprite(530, 520, 'player_se');
    
    // Scale sprite visually by 2x
    this.player.setScale(2);
    
    // Set 65% opacity for character sprite
    this.player.setAlpha(0.65);
    
    // Depth 20.5 places player ON TOP of speaker (20) & BEHIND basketball (21)
    this.player.setDepth(20.5); 
    
    // Feet Collision Box tuned for 2x scaled player
    this.player.body.setSize(20, 12).setOffset(35, 72);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.obstacles);

    // Track active orientation, flip state & interaction state
    this.currentDir = 'se';
    this.isFlipped = false;
    this.isInteracting = false;
    this.player.play('player_idle_se');

    // 8. INDIVIDUALIZED INTERACTION NODES (INCLUDING HUD SETTING & HOME TRIGGER BOXES)
    this.nodes = [
        // --- HUD TRIGGER BOXES (LEFT TO RIGHT TOP OF BOOKSHELF ALONG WALL_R) ---
        { id: 'options-modal', type: 'hud-setting', keys: ['settingIcon'], rx: 880, ry: 125, rw: 60, rh: 60 },
        { id: 'confirm-home-modal', type: 'hud-home', keys: ['homeIcon'], rx: 960, ry: 155, rw: 60, rh: 60 },

        // --- SHIPPED TITLES & PROJECTS MODAL NODES (TV, PS5 & SWITCH) ---
        { id: 'modal-game', keys: ['ps5', 'switch', 'tv'], rx: 240, ry: 520, rw: 80, rh: 60, maxDist: 40 },
        { id: 'modal-game', keys: ['tv'], rx: 100, ry: 360, rw: 220, rh: 120, maxDist: 40 }, 
        
        // --- MY INDIE GAME PROJECT NODE (BIRD) ---
        { id: 'modal-indie-game', keys: ['bird'], rx: 600, ry: 560, rw: 50, rh: 50, maxDist: 35 },  
        
        // --- MUSIC & HOBBIES NODES (GUITAR & BASKETBALL) ---
        { id: 'modal-music', keys: ['guitar'], rx: 370, ry: 450, rw: 40, rh: 40, maxDist: 40 }, 
        { id: 'modal-sport', keys: ['basketball'], rx: 740, ry: 630, rw: 50, rh: 40, maxDist: 60 }, 

        // --- EDUCATION & SKILLS MODAL NODES (BOOK & DIPLOMA) ---
        { id: 'modal-edu', keys: ['book', 'diploma'], rx: 590, ry: 360, rw: 90, rh: 60, maxDist: 50 },
        { id: 'modal-edu', keys: ['diploma'], rx: 820, ry: 260, rw: 90, rh: 70, maxDist: 50 },
        
        // --- WORK EXPERIENCE MODAL (MONITOR, LAPTOP, KEYBOARD & CHART) ---
        { id: 'modal-work', keys: ['laptop', 'keyboard', 'monitor', 'chart'], rx: 730, ry: 425, rw: 170, rh: 80, maxDist: 50 },
        { id: 'modal-work', keys: ['chart'], rx: 920, ry: 320, rw: 65, rh: 85, maxDist: 50 },
        
        // --- MY LOVELY PUPPY MODAL (BÔNG) ---
        { id: 'modal-puppy', keys: ['bong'], rx: 260, ry: 680, rw: 70, rh: 50, maxDist: 45 },
        
        // --- ABOUT ME MODAL (PERSON ON SOFA) ---
        { id: 'about-modal', keys: ['me_in_sofa'], rx: 460, ry: 650, rw: 80, rh: 60, maxDist: 40 },

        // --- MY RECENT FAVORITE GAMES MODAL (POSTER) ---
        { id: 'modal-poster', keys: ['poster'], rx: 430, ry: 380, rw: 50, rh: 30, maxDist: 50 }
    ];

    // *** SETUP BEATING YELLOW GLOW FX (0xffff00) FOR ALL INTERACTABLE PROPS ***
    const interactableKeys = new Set(this.nodes.flatMap(n => n.keys || []));
    interactableKeys.forEach(key => {
        let sprite = this.visualSprites[key];
        if (sprite && sprite.preFX && key !== 'settingIcon' && key !== 'homeIcon') {
            sprite.glowFx = sprite.preFX.addGlow(0xffff00, 1, 0, false);
            sprite.glowFx.setActive(false);

            // Pulse outerStrength smoothly between 1 and 5 for a slow beating effect
            this.tweens.add({
                targets: sprite.glowFx,
                outerStrength: 5,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    });

    // *** [E / TAP] PROMPT UI (TOUCH INTERACTIVE) ***
    this.interactIcon = this.add.text(0, 0, '[E / TAP]', {
        fontFamily: '"Press Start 2P"', 
        fontSize: '9px', 
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 6, y: 4 }
    })
    .setOrigin(0.5)
    .setDepth(100)
    .setAlpha(0.85)
    .setVisible(false)
    .setInteractive({ useHandCursor: true });

    // Helper function to trigger interaction modal execution
    this.triggerModal = (node) => {
        if (!node || this.isInteracting || isMenuOpen) return;

        // If HUD Box Tapped directly
        if (node.type === 'hud-setting') {
            if (this.settingIcon && this.settingIcon.glowFx) this.settingIcon.glowFx.setActive(true);
            playClickSFX();
            openNodeModal('options-modal');
            return;
        }
        if (node.type === 'hud-home') {
            if (this.homeIcon && this.homeIcon.glowFx) this.homeIcon.glowFx.setActive(true);
            playClickSFX();
            openNodeModal('confirm-home-modal');
            return;
        }
        
        playInteractSFX(); // Play interact_sfx.mp3 when player interacts
        
        this.isInteracting = true;
        this.player.setVelocity(0);
        this.interactIcon.setVisible(false);
        if (this.flyingSfx && this.flyingSfx.isPlaying) {
            this.flyingSfx.stop();
        }
        
        // Play interact animation pose
        this.player.play(`player_interact_${this.currentDir}`, true);

        // Open modal after delay
        this.time.delayedCall(800, () => {
            openNodeModal(node.id);
            this.isInteracting = false;
        });
    };

    // Mouse Pointer Movement Hover Listener (Highlights HUD Setting & Home Icons on Mouseover)
    this.input.on('pointermove', (pointer) => {
        if (isMenuOpen || this.isInteracting) return;

        // Setting Icon Hover Check
        const overSetting = (
            pointer.x >= 880 && pointer.x <= 880 + 60 &&
            pointer.y >= 125 && pointer.y <= 125 + 60
        );

        // Home Icon Hover Check
        const overHome = (
            pointer.x >= 960 && pointer.x <= 960 + 60 &&
            pointer.y >= 155 && pointer.y <= 155 + 60
        );

        if (this.settingIcon && this.settingIcon.glowFx) {
            this.settingIcon.glowFx.setActive(overSetting);
        }
        if (this.homeIcon && this.homeIcon.glowFx) {
            this.homeIcon.glowFx.setActive(overHome);
        }

        if (overSetting || overHome) {
            if (this.game && this.game.canvas) this.game.canvas.style.cursor = 'pointer';
        } else {
            if (this.game && this.game.canvas) this.game.canvas.style.cursor = 'default';
        }
    });

    // Tap directly on the floating [E / TAP] label
    this.interactIcon.on('pointerdown', (pointer) => {
        pointer.event.stopPropagation();
        if (this.activeNode) {
            this.triggerModal(this.activeNode);
        }
    });

    // Direct Touch / Mobile Tap Handler: Allows tapping trigger boxes directly strictly within box bounds
    this.input.on('pointerdown', (pointer) => {
        if (isMenuOpen || this.isInteracting) return;

        // 1. Direct Touch: Check if pointer tapped STRICTLY inside ANY trigger box
        let tappedNode = this.nodes.find(node => {
            return (
                pointer.x >= node.rx - 5 &&
                pointer.x <= node.rx + node.rw + 5 &&
                pointer.y >= node.ry - 5 &&
                pointer.y <= node.ry + node.rh + 5
            );
        });

        if (tappedNode) {
            this.triggerModal(tappedNode);
            return;
        }

        // 2. Fallback Proximity Tap: Tap near active node when player is already close
        if (this.activeNode) {
            let node = this.activeNode;
            let clampX = Phaser.Math.Clamp(pointer.x, node.rx, node.rx + node.rw);
            let clampY = Phaser.Math.Clamp(pointer.y, node.ry, node.ry + node.rh);
            let distToTap = Phaser.Math.Distance.Between(pointer.x, pointer.y, clampX, clampY);

            if (distToTap < 50) {
                this.triggerModal(node);
            }
        }
    });

    // 9. INPUTS
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.activeNode = null;
}

function update() {
    // Stop input/movement if menu or any modal is open
    if (isMenuOpen) {
        this.player.setVelocity(0);
        this.interactIcon.setVisible(false);
        this.player.play(`player_idle_${this.currentDir}`, true);
        if (this.flyingSfx && this.flyingSfx.isPlaying) {
            this.flyingSfx.stop();
        }
        return; 
    }

    // Freeze character movement while playing interaction animation
    if (this.isInteracting) {
        this.player.setVelocity(0);
        this.interactIcon.setVisible(false);
        if (this.flyingSfx && this.flyingSfx.isPlaying) {
            this.flyingSfx.stop();
        }
        return;
    }

    // 1. MOVEMENT & EXACT 360-DEGREE ANGLE CALCULATION (KEYBOARD + VIRTUAL JOYSTICK)
    let moveX = joystickMove.x; 
    let moveY = joystickMove.y;

    if (this.cursors.left.isDown || this.wasd.left.isDown) moveX = -1;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) moveX = 1;

    if (this.cursors.up.isDown || this.wasd.up.isDown) moveY = -1;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) moveY = 1;

    let magnitude = Math.sqrt(moveX * moveX + moveY * moveY);

    if (magnitude > 0.02) {
        this.player.setVelocity(moveX, moveY);
        this.player.body.velocity.normalize().scale(240); 

        // Play movement SFX loop if not already playing and SFX is unmuted
        if (this.flyingSfx && !this.flyingSfx.isPlaying && !sfxMuted) {
            this.flyingSfx.play();
        }

        // Exact 8-directional sector mapping using Atan2 angle (-180 to 180 degrees)
        let angle = Phaser.Math.RadToDeg(Math.atan2(moveY, moveX));

        if (angle >= -22.5 && angle < 22.5)         { this.currentDir = 'e';  this.isFlipped = false; } // E
        else if (angle >= 22.5 && angle < 67.5)     { this.currentDir = 'se'; this.isFlipped = false; } // SE
        else if (angle >= 67.5 && angle < 112.5)    { this.currentDir = 's';  this.isFlipped = false; } // S
        else if (angle >= 112.5 && angle < 157.5)   { this.currentDir = 'se'; this.isFlipped = true;  } // SW
        else if (angle >= 157.5 || angle < -157.5)  { this.currentDir = 'e';  this.isFlipped = true;  } // W
        else if (angle >= -157.5 && angle < -112.5) { this.currentDir = 'ne'; this.isFlipped = true;  } // NW
        else if (angle >= -112.5 && angle < -67.5)  { this.currentDir = 'n';  this.isFlipped = false; } // N
        else if (angle >= -67.5 && angle < -22.5)   { this.currentDir = 'ne'; this.isFlipped = false; } // NE

        this.player.setFlipX(this.isFlipped);
        this.player.play(`player_walk_${this.currentDir}`, true);
    } else {
        this.player.setVelocity(0);
        this.player.play(`player_idle_${this.currentDir}`, true);

        // Stop movement SFX loop when character stops
        if (this.flyingSfx && this.flyingSfx.isPlaying) {
            this.flyingSfx.stop();
        }
    }

    // 2. INDIVIDUAL INTERACTION DISTANCE CHECK (PC Proximity Walking Logic)
    let closestNode = null;
    let minDistance = Infinity; 

    this.nodes.forEach(node => {
        // Skip HUD nodes for proximity walking
        if (node.type === 'hud-setting' || node.type === 'hud-home') return;

        let clampX = Phaser.Math.Clamp(this.player.x, node.rx, node.rx + node.rw);
        let clampY = Phaser.Math.Clamp(this.player.y, node.ry, node.ry + node.rh);
        
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, clampX, clampY);
        let threshold = node.maxDist !== undefined ? node.maxDist : 90;

        if (dist < threshold && dist < minDistance) {
            closestNode = node;
            minDistance = dist; 
        }
    });

    // DYNAMIC STANDALONE GLOW TOGGLING
    if (this.activeNode !== closestNode) {
        if (this.activeNode && this.activeNode.keys) {
            this.activeNode.keys.forEach(key => {
                let sprite = this.visualSprites[key];
                if (sprite && sprite.glowFx) {
                    sprite.glowFx.setActive(false);
                } else if (sprite) {
                    sprite.clearTint(); 
                }
            });
        }
        
        if (closestNode && closestNode.keys) {
            closestNode.keys.forEach(key => {
                let sprite = this.visualSprites[key];
                if (sprite && sprite.glowFx) {
                    sprite.glowFx.setActive(true);
                } else if (sprite) {
                    sprite.setTint(0xffff00); 
                }
            });
        }
        
        this.activeNode = closestNode;
    }

    // 3. INTERACTION UI & KEY PRESS
    if (closestNode) {
        this.interactIcon.setVisible(true);
        this.interactIcon.setPosition(this.player.x, this.player.y - 67.5);

        if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.triggerModal(closestNode);
        }
    } else {
        this.interactIcon.setVisible(false);
    }
}