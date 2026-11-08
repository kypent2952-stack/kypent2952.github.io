/* =========================================================
   AASM 수면 단계 심층 판독 가이드 — 인터랙션 스크립트
   - 단계 선택 → 설명/파형 갱신
   - 파형 캔버스: 고해상도(DPR) 렌더링, 테마 색은 CSS 토큰에서 읽음
   - Chart.js 차트: 라이트/다크 테마 자동 대응
   ========================================================= */
(function () {
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const stageData = {
        W: {
            title: 'Stage W (각성 단계)',
            description: '각성 단계는 다른 모든 수면 단계를 판독하기 위한 기준선(baseline) 역할을 합니다. 눈을 감은 안정 상태의 생체 신호 특징을 명확히 파악해야 이후 수면 단계에서의 미세한 변화를 감지할 수 있습니다.',
            eegAnalysis: '눈을 감은 안정 상태에서 후두부(Occipital)에 8-13Hz의 <strong>알파파(Alpha rhythm)</strong>가 뚜렷하게 나타납니다. 이는 눈을 뜨면 감쇠하거나 사라지는 특징을 보입니다.',
            eogAnalysis: '의식적인 눈 깜빡임(Blinking)이나 자발적인 빠른 안구 운동이 관찰됩니다. 0.5-2Hz 빈도의 빈번하고 빠른 눈 깜빡임이 특징입니다.',
            emgAnalysis: '근긴장도가 모든 수면 단계 중 가장 높아, 파형이 굵고 활발하게 나타납니다. 이는 이후 렘수면의 근육 무긴장 상태와 극명한 대조를 이룹니다.',
            eegWave: 'alpha',
            eogWave: 'blinks',
            emgWave: 'high'
        },
        N1: {
            title: 'Stage N1 (얕은 수면 단계)',
            description: 'N1 단계는 각성 상태에서 수면으로 넘어가는 과도기적 단계로, 전체 수면의 약 2-5%를 차지하는 짧은 기간입니다. 이 단계에서는 주변 자극에 쉽게 깰 수 있습니다.',
            eegAnalysis: '알파파가 현저히 감소(에폭의 50% 미만)하고, 저진폭의 혼합 주파수(주로 4-7Hz의 세타파)로 대체됩니다. 간혹 <strong>두정부 예파(Vertex sharp waves)</strong>가 나타날 수 있습니다.',
            eogAnalysis: '<strong>느린 안구 운동(Slow Eye Movements, SEM)</strong>이 특징적으로 나타납니다. 파형의 시작부터 정점까지의 시간이 0.5초(500msec) 이상으로, 렘수면의 빠른 안구 운동과 명확히 구분됩니다.',
            emgAnalysis: '각성 단계보다 근긴장도가 다소 감소하지만, 변화가 뚜렷하지 않을 수 있습니다.',
            eegWave: 'theta',
            eogWave: 'slow',
            emgWave: 'medium'
        },
        N2: {
            title: 'Stage N2 (일반 수면 단계)',
            description: 'N2 단계는 전체 수면의 약 45-55%를 차지하는 가장 긴 구간입니다. 이 단계부터 본격적인 수면 상태로 간주하며, 외부 자극에 대한 각성 역치가 N1보다 높아집니다.',
            eegAnalysis: 'N1과 유사한 배경 파형 위에 <strong>수면 방추(Sleep Spindle)</strong>나 <strong>K-복합체(K-Complex)</strong>가 나타납니다. 이 두 파형은 N2 단계를 정의하는 결정적 증거입니다. 수면 방추는 11-16Hz의 주파수를 가지며 0.5초 이상 지속되는 <strong class="font-bold">방추(紡錘, 가운데가 불룩한 실패 모양)</strong> 형태를 띠며, K-복합체는 뚜렷한 <strong class="font-bold">음의 예파(sharp negative wave)</strong> 직후에 <strong class="font-bold">양의 파(positive component)</strong>가 따라오는 복합 파형입니다.',
            eogAnalysis: '안구 운동이 거의 관찰되지 않습니다.',
            emgAnalysis: '근긴장도는 N1과 비슷하거나 약간 더 낮은 수준을 유지합니다.',
            eegWave: 'kcomplex',
            eogWave: 'flat',
            emgWave: 'low'
        },
        N3: {
            title: 'Stage N3 (깊은 수면/서파 수면 단계)',
            description: 'N3 단계는 "깊은 잠" 또는 "서파 수면(Slow-wave sleep)"으로 불리며, 낮 동안 소모된 신체 기능을 회복하고 성장 호르몬이 분비되는 중요한 시기입니다. 주로 수면 전반부에 집중적으로 나타납니다.',
            eegAnalysis: '0.5-2Hz의 주파수와 75μV 이상의 높은 진폭을 가진 <strong>델타파(Delta wave)</strong>가 에폭의 20% 이상을 차지합니다. 이 기준을 충족하는 K-복합체도 델타파로 간주될 수 있습니다.',
            eogAnalysis: '안구 운동이 없습니다.',
            emgAnalysis: '근긴장도가 N2보다 낮거나 비슷하며, 때로는 REM 단계처럼 매우 낮게 나타나기도 합니다.',
            eegWave: 'delta',
            eogWave: 'flat',
            emgWave: 'low'
        },
        R: {
            title: 'Stage R (렘수면 단계)',
            description: '렘수면(REM Sleep)은 이름 그대로 급속한 안구 운동이 특징인 단계로, 뇌는 활발하게 활동하지만 신체 근육은 마비된 듯 이완되는 역설적인 상태를 보입니다. 감정 조절 및 기억 강화 등 정신적 회복에 중요한 역할을 합니다.',
            eegAnalysis: '각성 상태와 유사한 저진폭의 혼합 주파수 파형이 나타납니다. 특징적인 <strong>톱니파(Sawtooth waves)</strong>가 관찰될 수 있습니다.',
            eogAnalysis: '<strong>급속 안구 운동(Rapid Eye Movements, REMs)</strong>이 특징적으로 나타납니다. 파형의 시작부터 정점까지의 시간이 0.5초(500msec) 미만으로 매우 빠르고 불규칙합니다.',
            emgAnalysis: '근육의 힘이 완전히 빠지는 <strong>"무긴장(Atonia)"</strong> 상태가 되어, 근전도 활성도가 모든 단계 중 가장 낮습니다. 이는 꿈의 내용을 행동으로 옮기지 못하도록 하는 보호 기전입니다.',
            eegWave: 'sawtooth',
            eogWave: 'rapid',
            emgWave: 'flat'
        }
    };

    /* ---------- 테마 토큰 ---------- */
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rootStyle = () => getComputedStyle(document.documentElement);
    const token = (name) => rootStyle().getPropertyValue(name).trim();
    const onMediaChange = (mq, fn) => {
        if (mq.addEventListener) mq.addEventListener('change', fn);
        else if (mq.addListener) mq.addListener(fn);
    };

    /* ---------- DOM ---------- */
    const stageTitleEl = document.getElementById('stage-title');
    const stageDescriptionEl = document.getElementById('stage-description');
    const eegAnalysisEl = document.getElementById('eeg-analysis');
    const eogAnalysisEl = document.getElementById('eog-analysis');
    const emgAnalysisEl = document.getElementById('emg-analysis');
    const navButtons = document.querySelectorAll('.nav-button');

    /* ---------- 캔버스 뷰 ----------
       원본 파형 수식은 기본 캔버스 크기(300×150) 좌표계를 기준으로 작성되어 있으므로,
       같은 좌표계에서 계산한 뒤 실제 표시 크기·기기 픽셀 비율에 맞춰 그립니다.
       (파형 모양은 그대로, 선은 선명하게) */
    const LOGICAL_W = 300;
    const LOGICAL_H = 150;

    function makeView(canvas) {
        return { canvas, ctx: canvas.getContext('2d'), cssW: 0, cssH: 0 };
    }

    function fitView(view) {
        const rect = view.canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cssW = Math.max(1, Math.round(rect.width));
        const cssH = Math.max(1, Math.round(rect.height));
        if (cssW === view.cssW && cssH === view.cssH && view.dpr === dpr) return;
        view.cssW = cssW; view.cssH = cssH; view.dpr = dpr;
        view.canvas.width = Math.round(cssW * dpr);
        view.canvas.height = Math.round(cssH * dpr);
        view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function plot(view, color, yAt) {
        const { ctx, cssW, cssH } = view;
        const sx = cssW / LOGICAL_W;
        const sy = cssH / LOGICAL_H;
        ctx.clearRect(0, 0, cssW, cssH);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        for (let x = 0; x < LOGICAL_W; x++) {
            ctx.lineTo(x * sx, yAt(x) * sy);
        }
        ctx.stroke();
    }

    const eegView = makeView(document.getElementById('eeg-canvas'));
    const eogView = makeView(document.getElementById('eog-canvas'));
    const emgView = makeView(document.getElementById('emg-canvas'));
    const stageViews = [eegView, eogView, emgView];

    let animationFrameId = null;
    let time = 0;
    let currentStage = 'W';
    let waveVisible = true;

    function updateStageContent(stage) {
        const data = stageData[stage];
        currentStage = stage;
        stageTitleEl.textContent = data.title;
        stageDescriptionEl.textContent = data.description;
        eegAnalysisEl.innerHTML = data.eegAnalysis;
        eogAnalysisEl.innerHTML = data.eogAnalysis;
        emgAnalysisEl.innerHTML = data.emgAnalysis;

        navButtons.forEach(button => {
            const isActive = button.dataset.stage === stage;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        document.getElementById('eeg-canvas').setAttribute('aria-label', `${data.title} 대표 EEG 파형`);
        document.getElementById('eog-canvas').setAttribute('aria-label', `${data.title} 대표 EOG 파형`);
        document.getElementById('emg-canvas').setAttribute('aria-label', `${data.title} 대표 EMG 파형`);

        startWaveforms();
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateStageContent(button.dataset.stage);
        });
    });

    function drawFrame() {
        const data = stageData[currentStage];
        stageViews.forEach(fitView);
        drawEEG(data.eegWave, eegView, token('--wave-eeg'));
        drawEOG(data.eogWave, eogView, token('--wave-eog'));
        drawEMG(data.emgWave, emgView, token('--wave-emg'));
    }

    function stopWaveforms() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function startWaveforms() {
        stopWaveforms();
        // 움직임 줄이기 설정 또는 화면 밖일 때는 정지 화면 1프레임만 그림
        if (motionQuery.matches || !waveVisible) {
            drawFrame();
            return;
        }
        const loop = () => {
            drawFrame();
            time += 2;
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();
    }

    function drawEEG(type, view, color) {
        const w = LOGICAL_W;
        const h = LOGICAL_H;
        const amplitude = h / 3;
        const centerY = h / 2;
        plot(view, color, (x) => {
            switch (type) {
                case 'alpha':
                    return centerY - Math.sin((x + time) * 0.1) * amplitude * 0.8;
                case 'theta':
                    return centerY - Math.sin((x + time) * 0.05) * amplitude * 0.9;
                case 'kcomplex': {
                    const spikeX = w / 2;
                    const baseWave = Math.sin((x + time) * 0.04) * amplitude * 0.2;
                    let kComplex = 0;
                    if (x > spikeX - 30 && x < spikeX + 30) {
                        kComplex = (1 - Math.abs(x - spikeX) / 30) * -amplitude * 1.2;
                        if (x > spikeX) kComplex *= -0.5;
                    }
                    return centerY - baseWave + kComplex;
                }
                case 'delta':
                    return centerY - Math.sin((x * 0.02) + time * 0.03) * amplitude * 1.1;
                case 'sawtooth': {
                    const period = 80;
                    const sawX = (x + time) % period;
                    const sawY = (sawX / period) * amplitude * 1.5 - amplitude * 0.75;
                    const baseTheta = Math.sin((x + time) * 0.06) * amplitude * 0.3;
                    return centerY - baseTheta + sawY;
                }
                default:
                    return centerY;
            }
        });
    }

    function drawEOG(type, view, color) {
        const h = LOGICAL_H;
        const centerY = h / 2;
        plot(view, color, (x) => {
            switch (type) {
                case 'blinks':
                    return centerY - Math.sin((x + time) * 0.2) * (x % 50 < 5 ? h / 3 : 0);
                case 'slow':
                    return centerY - Math.sin((x + time) * 0.05) * (x % 70 < 35 ? h / 4 : h / 5);
                case 'rapid':
                    return centerY - Math.sin((x + time) * 0.4) * (x % 20 < 10 ? h / 3 : 0);
                case 'flat':
                default:
                    return centerY;
            }
        });
    }

    function drawEMG(type, view, color) {
        const h = LOGICAL_H;
        const centerY = h / 2;
        plot(view, color, (x) => {
            switch (type) {
                case 'high':
                    return centerY - Math.random() * (h / 2) + h / 4;
                case 'medium':
                    return centerY - Math.random() * (h / 3) + h / 6;
                case 'low':
                    return centerY - Math.sin((x + time) * 0.01) * h * 0.02;
                case 'flat':
                default:
                    return centerY;
            }
        });
    }

    /* ---------- 기본 뇌파 (정적) ---------- */
    const basicViews = [
        ['alpha', makeView(document.getElementById('alpha-canvas'))],
        ['beta', makeView(document.getElementById('beta-canvas'))],
        ['delta', makeView(document.getElementById('delta-wave-canvas'))]
    ];

    function drawBasicWaveforms() {
        const color = token('--wave-eeg');
        basicViews.forEach(([type, view]) => {
            fitView(view);
            drawStaticWaveform(type, view, color);
        });
    }

    function drawStaticWaveform(type, view, color) {
        const h = LOGICAL_H;
        const amplitude = h / 3;
        const centerY = h / 2;
        plot(view, color, (x) => {
            switch (type) {
                case 'alpha':
                    return centerY - Math.sin(x * 0.1) * amplitude * 0.8;
                case 'beta':
                    return centerY - Math.sin(x * 0.3) * amplitude * 0.6;
                case 'delta':
                    return centerY - Math.sin(x * 0.02) * amplitude * 1.1;
                default:
                    return centerY;
            }
        });
    }

    updateStageContent('W');
    drawBasicWaveforms();

    // 파형 패널이 화면 밖이면 애니메이션 정지 (배터리 절약)
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            const visible = entries.some(e => e.isIntersecting);
            if (visible === waveVisible) return;
            waveVisible = visible;
            startWaveforms();
        });
        io.observe(document.getElementById('eeg-canvas').closest('.wave-panel'));
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            drawBasicWaveforms();
            if (!animationFrameId) drawFrame();
        }, 120);
    });

    /* ---------- 차트 (Chart.js) ---------- */
    const charts = {};

    function stageColors() {
        return ['--stage-w', '--stage-n1', '--stage-n2', '--stage-n3', '--stage-r'].map(token);
    }

    function applyChartTheme() {
        if (!window.Chart) return;
        const text = token('--chart-text');
        const grid = token('--chart-grid');
        Chart.defaults.color = text;
        Chart.defaults.borderColor = grid;
        Chart.defaults.font.family = token('--font-sans') || 'sans-serif';

        if (charts.hypnogram) {
            const c = charts.hypnogram;
            c.data.datasets[0].borderColor = token('--chart-line');
            c.data.datasets[0].backgroundColor = token('--chart-fill');
            ['x', 'y'].forEach(axis => {
                c.options.scales[axis].ticks.color = text;
                c.options.scales[axis].title.color = text;
                c.options.scales[axis].grid.color = grid;
            });
            c.update('none');
        }
        if (charts.proportion) {
            const c = charts.proportion;
            c.data.datasets[0].backgroundColor = stageColors();
            c.data.datasets[0].borderColor = token('--surface');
            c.options.plugins.legend.labels.color = text;
            c.update('none');
        }
    }

    function initCharts() {
        if (!window.Chart) {
            // CDN 미로딩 시: 캔버스 대신 텍스트 대체 콘텐츠가 보이도록 처리
            document.querySelectorAll('#hypnogramChart, #sleepProportionChart').forEach(canvas => {
                const note = document.createElement('p');
                note.className = 'chart-fallback';
                note.textContent = canvas.id === 'hypnogramChart'
                    ? (canvas.textContent.trim() || '차트를 불러오지 못했습니다.')
                    : 'Wake 5%, N1 5%, N2 50%, N3 20%, REM 20%';
                canvas.replaceWith(note);
            });
            const srCopy = document.getElementById('proportion-sr');
            if (srCopy) srCopy.remove();
            return;
        }
        applyChartTheme();

        const hypnogramCtx = document.getElementById('hypnogramChart').getContext('2d');
        const hypnogramData = {
            labels: Array.from({ length: 96 }, (_, i) => `${Math.floor(i/12)}h ${i%12*5}m`),
            datasets: [{
                label: '수면 단계',
                data: [0, 0, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1, 2, 4, 4, 4, 4, 2, 1, 2, 2, 3, 3, 3, 2, 2, 2, 4, 4, 4, 4, 4, 2, 1, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 1, 1, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 2, 1, 2, 2, 4, 4, 4, 4, 4, 4, 4, 2, 1, 0, 0, 1, 2, 4, 4, 4, 4, 4, 2, 1, 0, 0, 0, 1, 2, 4, 4, 0],
                borderColor: token('--chart-line'),
                backgroundColor: token('--chart-fill'),
                borderWidth: 2,
                stepped: true,
                // 위(W) 방향으로 채우면 각성 구간이 강조되어 오독 소지가 있어, 선만 표시
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 4,
            }]
        };
        charts.hypnogram = new Chart(hypnogramCtx, {
            type: 'line',
            data: hypnogramData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: motionQuery.matches ? false : undefined,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    y: {
                        reverse: true,
                        ticks: {
                            callback: function(value) {
                                return ['W', 'N1', 'N2', 'N3', 'R'][value];
                            },
                            stepSize: 1
                        },
                        grid: {},
                        min: 0,
                        max: 4,
                        title: { display: true, text: '수면 단계' }
                    },
                    x: {
                        title: { display: true, text: '수면 시간' },
                        grid: {},
                        ticks: {
                            maxTicksLimit: 8
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const stage = ['Wake', 'N1', 'N2', 'N3', 'REM'][context.raw];
                                label += stage;
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });

        const proportionCtx = document.getElementById('sleepProportionChart').getContext('2d');
        const proportionData = {
            labels: ['Wake (5%)', 'N1 (5%)', 'N2 (50%)', 'N3 (20%)', 'REM (20%)'],
            datasets: [{
                label: '수면 단계 비율',
                data: [5, 5, 50, 20, 20],
                backgroundColor: stageColors(),
                borderColor: token('--surface'),
                borderWidth: 2,
                hoverOffset: 4
            }]
        };
        charts.proportion = new Chart(proportionCtx, {
            type: 'doughnut',
            data: proportionData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: motionQuery.matches ? false : undefined,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: token('--chart-text'), usePointStyle: true, padding: 14 }
                    },
                    title: {
                        display: false,
                    }
                }
            }
        });
        applyChartTheme();
    }

    initCharts();

    /* ---------- 테마/모션 설정 변경 시 다시 그리기 ---------- */
    onMediaChange(darkQuery, () => {
        drawBasicWaveforms();
        drawFrame();
        applyChartTheme();
    });
    onMediaChange(motionQuery, startWaveforms);
});
})();
